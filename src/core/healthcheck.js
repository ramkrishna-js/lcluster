import fetch from 'node-fetch';
import { events } from './events.js';
import { getAllNodes, updateNode } from './registry.js';

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import yaml from 'js-yaml';

const failCounters = new Map();
const pingHistories = new Map(); // Add Ping history arrays
const NODE_TIMEOUT_MS = 3000;

function getConfig() {
    const configPath = path.join(os.homedir(), '.lcluster', 'config.yml');
    if (fs.existsSync(configPath)) {
        try { return yaml.load(fs.readFileSync(configPath, 'utf8')) || {}; } catch (e) { }
    }
    return {};
}

export function startHealthCheck() {
    setInterval(async () => {
        const nodes = getAllNodes();
        for (const node of nodes) {
            checkNode(node);
        }
    }, 5000);
}

async function checkNode(node) {
    const start = Date.now();
    let failCount = failCounters.get(node.name) || 0;

    try {
        const res = await fetch(`http://localhost:${node.port}/v4/stats`, {
            method: 'GET',
            headers: {
                'Authorization': node.password || 'youshallnotpass',
                'Content-Type': 'application/json'
            },
            timeout: NODE_TIMEOUT_MS
        });

        if (res.ok) {
            const ping = Date.now() - start;
            const stats = await res.json();

            const wasOffline = node.status !== 'online'; // anything not online should trigger recovery

            failCounters.set(node.name, 0);

            // Track ping history
            if (!pingHistories.has(node.name)) pingHistories.set(node.name, []);
            const hist = pingHistories.get(node.name);
            hist.push(ping);
            if (hist.length > 10) hist.shift();

            const cpu = stats.cpu ? Math.round(stats.cpu.lavalinkLoad * 100) : 0;
            const memory = stats.memory ? Math.round(stats.memory.used / 1024 / 1024) : 0;
            const players = stats.players || 0;

            updateNode(node.name, {
                status: 'online',
                ping,
                cpu,
                memory,
                players,
                pingHistory: [...pingHistories.get(node.name)]
            });

            const config = getConfig();
            const cpuWarnThreshold = config.alerts?.thresholds?.cpu_warn || 90;

            if (cpu >= cpuWarnThreshold) {
                if (node.cpuWarnCount >= 2) {
                    events.emit('cpu:critical', node);
                    node.cpuWarnCount = 0;
                } else {
                    node.cpuWarnCount = (node.cpuWarnCount || 0) + 1;
                }
            } else {
                node.cpuWarnCount = 0;
            }

            if (wasOffline) {
                events.emit('node:online', node.name);
            }
        } else {
            throw new Error(`HTTP ${res.status}`);
        }
    } catch (error) {
        failCount++;
        failCounters.set(node.name, failCount);

        let newStatus = node.status || 'offline';
        let eventToEmit = null;

        if (node.mode === 'external') {
            if (failCount >= 12 && newStatus !== 'unreachable') {
                newStatus = 'unreachable';
            } else if (failCount > 0 && failCount < 12) {
                if (newStatus === 'online' || newStatus === 'reconnecting') {
                    newStatus = 'reconnecting';
                } else if (newStatus !== 'unreachable') {
                    newStatus = 'waiting';
                }
            }
        } else {
            if (failCount >= 6 && newStatus !== 'offline') {
                newStatus = 'offline';
                eventToEmit = 'node:offline';
            } else if (failCount >= 3 && failCount < 6 && newStatus !== 'degraded') {
                newStatus = 'degraded';
            }
        }

        if (newStatus !== node.status) {
            updateNode(node.name, { status: newStatus });
            if (eventToEmit) events.emit(eventToEmit, node.name);
        }
    }

    // After each check emit updated
    events.emit('node:updated', node.name);
}

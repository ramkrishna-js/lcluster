import { sendDiscord } from './discord.js';
import { sendDesktop } from './desktop.js';
import { sendSound } from './sound.js';
import { events } from '../core/events.js';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import yaml from 'js-yaml';

function getConfig() {
    const configPath = path.join(os.homedir(), '.lcluster', 'config.yml');
    if (fs.existsSync(configPath)) {
        try { return yaml.load(fs.readFileSync(configPath, 'utf8')) || {}; } catch (e) { }
    }
    return {};
}

function getAlertConfig() {
    const cfg = getConfig();
    return cfg.alerts || {
        discord: { enabled: false, webhook: '' },
        desktop: { enabled: false },
        sound: { enabled: false },
        thresholds: { cpu_warn: 90, idle_warn: false }
    };
}

export function alert(level, node, message) {
    const alertsConfig = getAlertConfig();

    if (alertsConfig.discord?.enabled && alertsConfig.discord?.webhook) {
        sendDiscord(level, node, message, alertsConfig.discord.webhook);
    }

    if (alertsConfig.desktop?.enabled) {
        sendDesktop(level, message);
    }

    if (alertsConfig.sound?.enabled) {
        sendSound(level);
    }
}

export function initAlerts() {
    events.on('node:offline', (node) => alert('danger', node, 'went offline'));
    events.on('node:online', (node) => alert('success', node, 'is back online'));
    events.on('node:degraded', (node) => alert('warning', node, 'is degraded'));
    events.on('gateway:ready', () => alert('info', null, 'gateway started'));
    events.on('cpu:critical', (node) => alert('warning', node, 'CPU above threshold'));
}

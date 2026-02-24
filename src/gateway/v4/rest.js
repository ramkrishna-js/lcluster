import { pickNode } from '../../core/loadbalancer.js';
import { getSession } from '../sessionMap.js';
import { getNode, getAllNodes } from '../../core/registry.js';
import { handleProxy } from '../proxy.js';

export function handleRest(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;

    if (path === '/v4/stats') {
        return handleStats(req, res);
    }

    // Handle specific session
    const sessionMatch = path.match(/^\/v4\/sessions\/([^\/]+)(.*)$/);
    if (sessionMatch) {
        const sessionId = sessionMatch[1];
        const nodeName = getSession(sessionId);
        if (nodeName) {
            const targetNode = getNode(nodeName);
            if (targetNode && targetNode.status === 'online') {
                return handleProxy(req, res, `http://localhost:${targetNode.port}`);
            }
        }
    }

    // Fallback / Load balancer
    try {
        const targetNode = pickNode();
        handleProxy(req, res, `http://localhost:${targetNode.port}`);
    } catch (e) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'No nodes available' }));
    }
}

function handleStats(req, res) {
    const nodes = getAllNodes().filter(n => n.status === 'online');

    // Aggregate stats
    const aggregated = {
        players: 0,
        playingPlayers: 0,
        uptime: Math.floor(process.uptime() * 1000), // cluster uptime (not node uptime)
        memory: {
            free: 0,
            used: 0,
            allocated: 0,
            reservable: 0
        },
        cpu: {
            cores: 0,
            systemLoad: 0,
            lavalinkLoad: 0
        }
    };

    if (nodes.length === 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(aggregated));
    }

    // Since we don't store the full stats object historically, we just return
    // the basic summation logic over the cached node data.
    let sumCpu = 0;

    nodes.forEach(n => {
        aggregated.players += (n.players || 0);
        // Rough approximations since we only cache high level stats in registry
        // In a full impl we would fetch live stats or cache full object
        aggregated.memory.used += ((n.memory || 0) * 1024 * 1024);
        sumCpu += (n.cpu || 0);
    });

    aggregated.cpu.lavalinkLoad = (sumCpu / nodes.length) / 100;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(aggregated));
}

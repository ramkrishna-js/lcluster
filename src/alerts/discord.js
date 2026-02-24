import fetch from 'node-fetch';
import { events } from '../core/events.js';

export async function sendDiscord(level, node, message, webhookUrl) {
    if (!webhookUrl) return;

    let colorByLevel = 0x89B4FA; // info blue
    let title = 'ℹ️ lcluster Info';

    if (level === 'danger') {
        colorByLevel = 0xFF3366;
        title = '🔴 Node Offline';
    } else if (level === 'warning') {
        colorByLevel = 0xFFCC00;
        title = '🟡 Node Warning';
    } else if (level === 'success') {
        colorByLevel = 0x00FF9F;
        title = '🟢 Node Online';
    }

    const payload = {
        embeds: [{
            title,
            description: message,
            color: colorByLevel,
            fields: node ? [
                { name: 'Node', value: node.name, inline: true },
                { name: 'Mode', value: node.mode, inline: true },
                { name: 'Uptime', value: node.uptime || '—', inline: true },
                { name: 'Players', value: String(node.players || 0), inline: true },
                { name: 'Ping', value: (node.ping || 0) + 'ms', inline: true },
                { name: 'CPU', value: (node.cpu || 0) + '%', inline: true },
            ] : [],
            footer: {
                text: 'lcluster · Built by Ram Krishna & Claude (Anthropic AI)'
            },
            timestamp: new Date().toISOString()
        }]
    };

    try {
        const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) {
            events.emit('alert:failed', `Discord webhook failed: ${res.status}`);
        }
    } catch (err) {
        events.emit('alert:failed', `Discord webhook error: ${err.message}`);
    }
}

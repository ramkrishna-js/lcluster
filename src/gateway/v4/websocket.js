import { WebSocketServer, WebSocket } from 'ws';
import { pickNode } from '../../core/loadbalancer.js';
import { setSession, getSession } from '../sessionMap.js';
import { events } from '../../core/events.js';
import { getNode, getAllNodes } from '../../core/registry.js';

const wss = new WebSocketServer({ noServer: true });

export function handleWebsocketUpgrade(req, socket, head, gatewayPassword) {
    const auth = req.headers['authorization'];
    if (auth !== gatewayPassword) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }

    wss.handleUpgrade(req, socket, head, (botWs) => {
        const resumeKey = req.headers['session-resume-key'];
        let targetNode;

        if (resumeKey) {
            const existingNodeName = getSession(resumeKey);
            if (existingNodeName) {
                targetNode = getNode(existingNodeName);
            }
        }

        if (!targetNode || targetNode.status !== 'online') {
            try {
                targetNode = pickNode();
            } catch (e) {
                botWs.close(1011, 'No nodes available');
                return;
            }
        }

        connectToNode(botWs, req, targetNode, resumeKey);
    });
}

function connectToNode(botWs, req, targetNode, resumeKey) {
    const headers = { ...req.headers };
    delete headers.host;
    delete headers.upgrade;
    delete headers.connection;
    delete headers['sec-websocket-key'];
    delete headers['sec-websocket-version'];
    delete headers['sec-websocket-extensions'];

    const nodeWs = new WebSocket(`ws://localhost:${targetNode.port}/v4/websocket`, {
        headers: {
            ...headers,
            'Authorization': targetNode.password || 'youshallnotpass' // Usually load config
        }
    });

    let sessionId = resumeKey;

    nodeWs.on('message', (data, isBinary) => {
        // Check first message for ready op
        if (!isBinary) {
            try {
                const msg = JSON.parse(data.toString());
                if (msg.op === 'ready' && msg.sessionId) {
                    sessionId = msg.sessionId;
                    setSession(sessionId, targetNode.name);
                    events.emit('session:created', sessionId);
                }
            } catch (e) { }
        }

        // Pipe buffer directly
        if (botWs.readyState === WebSocket.OPEN) {
            botWs.send(data, { binary: isBinary });
        }
    });

    botWs.on('message', (data, isBinary) => {
        if (nodeWs.readyState === WebSocket.OPEN) {
            nodeWs.send(data, { binary: isBinary });
        }
    });

    botWs.on('close', () => {
        nodeWs.close();
    });

    nodeWs.on('close', () => {
        botWs.close();
        // In a full implementation we'd do failover here if the bot wasn't the one who closed
    });

    botWs.on('error', () => nodeWs.close());
    nodeWs.on('error', () => botWs.close());
}

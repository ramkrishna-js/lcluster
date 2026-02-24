import http from 'node:http';
import { handleRest } from './v4/rest.js';
import { handleWebsocketUpgrade } from './v4/websocket.js';
import { getGatewayConfig } from '../core/config.js';
import { events } from '../core/events.js';

export function startGateway() {
    const config = getGatewayConfig();

    const server = http.createServer((req, res) => {
        // Only route v4, drop others
        if (req.url.startsWith('/v4/')) {
            handleRest(req, res);
        } else {
            res.writeHead(404);
            res.end('Not Found');
        }
    });

    server.on('upgrade', (req, socket, head) => {
        const path = new URL(req.url, `http://${req.headers.host}`).pathname;

        if (path === '/v4/websocket') {
            handleWebsocketUpgrade(req, socket, head, config.password);
        } else {
            socket.destroy();
        }
    });

    server.listen(config.port, () => {
        events.emit('gateway:ready', config.port);
    });

    return server;
}

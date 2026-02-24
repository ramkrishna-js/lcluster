import { events } from './events.js';

const buffers = new Map();
const MAX_LINES = 200;

export function initLogBuffer() {
    events.on('node:online', (name) => addLog(name, `[lcluster] Node ${name} is online`));
    events.on('node:offline', (name) => addLog(name, `[lcluster] Node ${name} is offline`));

    // We need a catch-all for logs or we bind dynamically
    // For simplicity, we can intercept all emit calls, but events.js is standard EventEmitter.
    const originalEmit = events.emit;
    events.emit = function (event, ...args) {
        if (event.startsWith('log:')) {
            const nodeName = event.slice(4);
            addLog(nodeName, args[0]);
        }
        return originalEmit.apply(this, [event, ...args]);
    };
}

function addLog(nodeName, line) {
    if (!buffers.has(nodeName)) {
        buffers.set(nodeName, []);
    }
    const b = buffers.get(nodeName);
    b.push(line);
    if (b.length > MAX_LINES) {
        b.shift();
    }
}

export function getLogs(nodeName) {
    return buffers.get(nodeName) || [];
}

import { spawn } from 'node:child_process';
import { events } from '../core/events.js';
import { updateNode } from '../core/registry.js';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const CONFIG_DIR = path.join(os.homedir(), '.lcluster');
const NODES_DIR = path.join(CONFIG_DIR, 'nodes');

export function spawnProcess(node) {
    const workingDir = path.join(NODES_DIR, node.name);
    if (!fs.existsSync(workingDir)) {
        fs.mkdirSync(workingDir, { recursive: true });
    }

    const proc = spawn('java', ['-jar', 'Lavalink.jar'], {
        cwd: workingDir,
        stdio: ['ignore', 'pipe', 'pipe']
    });

    proc.stdout.on('data', (chunk) => {
        const lines = chunk.toString().split('\n').filter(Boolean);
        for (const line of lines) {
            events.emit(`log:${node.name}`, line);
        }
    });

    proc.stderr.on('data', (chunk) => {
        const lines = chunk.toString().split('\n').filter(Boolean);
        for (const line of lines) {
            events.emit(`log:${node.name}`, line);
        }
    });

    proc.on('exit', (code) => {
        updateNode(node.name, { status: 'offline' });
        events.emit('node:offline', node.name);
        events.emit(`log:${node.name}`, `[lcluster] Process exited with code ${code}`);
    });

    return proc;
}

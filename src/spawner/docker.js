import Docker from 'dockerode';
import { events } from '../core/events.js';
import { updateNode } from '../core/registry.js';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const docker = new Docker();
const CONFIG_DIR = path.join(os.homedir(), '.lcluster');
const NODES_DIR = path.join(CONFIG_DIR, 'nodes');

export async function spawnDocker(node) {
    const workingDir = path.join(NODES_DIR, node.name);
    if (!fs.existsSync(workingDir)) {
        fs.mkdirSync(workingDir, { recursive: true });
    }

    const configPath = path.join(workingDir, 'application.yml');

    const container = await docker.createContainer({
        Image: 'fredboat/lavalink:latest',
        name: `lcluster-${node.name}`,
        HostConfig: {
            PortBindings: {
                '2333/tcp': [{ HostPort: String(node.port) }]
            },
            Binds: [
                `${configPath}:/opt/Lavalink/application.yml`
            ]
        }
    });

    await container.start();

    const logStream = await container.logs({ follow: true, stdout: true, stderr: true });

    logStream.on('data', (chunk) => {
        // Docker log stream has an 8 byte header per frame
        // For simplicity with standard terminal output we strip it
        // Actually we can just stringify it
        const text = chunk.toString('utf8').replace(/^[^\x20-\x7E]+/, '');
        const lines = text.split('\n').filter(Boolean);
        for (const line of lines) {
            events.emit(`log:${node.name}`, line);
        }
    });

    container.wait().then((data) => {
        updateNode(node.name, { status: 'offline' });
        events.emit('node:offline', node.name);
        events.emit(`log:${node.name}`, `[lcluster] Container exited with code ${data.StatusCode}`);
    });

    return container;
}

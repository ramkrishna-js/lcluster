import os from 'node:os';
import { spawnSync } from 'node:child_process';
import net from 'node:net';

export async function detectSystem() {
    const result = {
        os: detectOs(),
        java: detectJava(),
        docker: detectDocker(),
        port2333: await detectPort(2333)
    };
    return result;
}

function detectOs() {
    const platform = os.platform();
    if (platform === 'darwin') return 'macos';
    if (platform === 'win32') return 'windows';
    if (platform === 'linux') {
        try {
            const osRelease = fs.readFileSync('/etc/os-release', 'utf8');
            if (osRelease.includes('ubuntu')) return 'ubuntu';
            if (osRelease.includes('debian')) return 'debian';
        } catch {
            return 'linux';
        }
        return 'linux';
    }
    return 'unknown';
}

function detectJava() {
    const proc = spawnSync('java', ['-version'], { encoding: 'utf8' });
    if (proc.error || proc.status !== 0) {
        return { found: false, version: null };
    }
    const output = proc.stderr || proc.stdout; // Java usually prints version to stderr
    const match = output.match(/version "([^"]+)"/);
    return {
        found: true,
        version: match ? match[1] : 'unknown'
    };
}

function detectDocker() {
    const proc = spawnSync('docker', ['info'], { encoding: 'utf8' });
    if (proc.error) {
        return { found: false, running: false };
    }
    if (proc.status !== 0) {
        return { found: true, running: false };
    }
    return { found: true, running: true };
}

function detectPort(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve({ available: false });
            } else {
                resolve({ available: false });
            }
        });

        server.once('listening', () => {
            server.close();
            resolve({ available: true });
        });

        server.listen(port);
    });
}

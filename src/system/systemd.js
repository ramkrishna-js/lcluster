import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export function installSystemd() {
    const __filename = fileURLToPath(import.meta.url);
    const cliPath = path.resolve(path.dirname(__filename), '../../src/cli.js');

    const unitFile = `[Unit]
Description=lcluster Lavalink Cluster Manager
After=network.target

[Service]
Type=simple
ExecStart=${process.execPath} ${cliPath} ui
Restart=always
RestartSec=5
User=root

[Install]
WantedBy=multi-user.target
`;

    try {
        fs.writeFileSync('/etc/systemd/system/lcluster.service', unitFile, 'utf8');
        spawnSync('systemctl', ['daemon-reload'], { stdio: 'ignore' });
        spawnSync('systemctl', ['enable', 'lcluster'], { stdio: 'ignore' });
        return true;
    } catch (e) {
        return false;
    }
}

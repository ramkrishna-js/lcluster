import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import yaml from 'js-yaml';

export function getGatewayConfig() {
    const configPath = path.join(os.homedir(), '.lcluster', 'config.yml');
    if (!fs.existsSync(configPath)) {
        return { port: 2333, password: 'youshallnotpass' };
    }
    try {
        const doc = yaml.load(fs.readFileSync(configPath, 'utf8'));
        return doc?.gateway || { port: 2333, password: 'youshallnotpass' };
    } catch {
        return { port: 2333, password: 'youshallnotpass' };
    }
}

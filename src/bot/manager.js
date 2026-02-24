import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fork } from 'node:child_process';
import { events } from '../core/events.js';

let botProcess = null;

export function startBot() {
    const configPath = path.join(os.homedir(), '.lcluster', 'config.yml');

    let config = {};
    if (fs.existsSync(configPath)) {
        try {
            const yaml = await import('js-yaml');
            config = yaml.default.load(fs.readFileSync(configPath, 'utf8')) || {};
        } catch { }
    }

    if (config?.bot?.enabled && config?.bot?.token) {
        // Resolve absolute path to bots/template.js from local installation or global 
        const __dirname = path.dirname(new URL(import.meta.url).pathname);
        const templatePath = path.join(__dirname, '..', '..', 'bots', 'template.js');

        if (fs.existsSync(templatePath)) {
            botProcess = fork(templatePath, [], {
                env: { ...process.env, DISCORD_TOKEN: config.bot.token },
                stdio: 'ignore' // We don't want the bot destroying our TUI with console.log
            });

            botProcess.on('error', (err) => {
                events.emit('system:log', `Failed to start Custom Discord Bot: ${err.message}`);
            });

            botProcess.on('exit', (code) => {
                events.emit('system:log', `Custom Discord Bot naturally exited with code ${code}`);
                botProcess = null;
            });

            // Assume started successfully if we made it here
            events.emit('system:log', 'Custom Discord Bot successfully mounted and detached to background.');
        } else {
            events.emit('system:log', 'Custom Discord Bot enabled but bots/template.js is missing.');
        }
    }
}

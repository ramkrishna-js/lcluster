import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import yaml from 'js-yaml';
import neon from './neon.js';
import minimal from './minimal.js';
import amber from './amber.js';
import cyberpunk from './cyberpunk.js';
import hacker from './hacker.js';
import ocean from './ocean.js';

let currentThemeConfig = 'neon';

export function loadTheme() {
    const configPath = path.join(os.homedir(), '.lcluster', 'config.yml');
    if (fs.existsSync(configPath)) {
        try {
            const doc = yaml.load(fs.readFileSync(configPath, 'utf8'));
            if (doc && doc.theme) {
                currentThemeConfig = doc.theme;
            }
        } catch { }
    }
}

export function updateTheme(name) {
    currentThemeConfig = name;
}

export function getTheme() {
    switch (currentThemeConfig) {
        case 'minimal': return minimal;
        case 'amber': return amber;
        case 'cyberpunk': return cyberpunk;
        case 'hacker': return hacker;
        case 'ocean': return ocean;
        case 'neon':
        default: return neon;
    }
}

export { currentThemeConfig };

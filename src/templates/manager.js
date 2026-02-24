import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const CONFIG_DIR = path.join(os.homedir(), '.lcluster');
const USER_TEMPLATES_DIR = path.join(CONFIG_DIR, 'templates');
const BUILT_IN_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../built-in-templates');

export function initTemplatesDir() {
    if (!fs.existsSync(USER_TEMPLATES_DIR)) {
        fs.mkdirSync(USER_TEMPLATES_DIR, { recursive: true });
    }
}

export function listTemplates() {
    initTemplatesDir();
    const templates = [];

    if (fs.existsSync(BUILT_IN_DIR)) {
        const builtIn = fs.readdirSync(BUILT_IN_DIR).filter(f => f.endsWith('.yml'));
        builtIn.forEach(f => templates.push({ name: f, builtin: true }));
    }

    const user = fs.readdirSync(USER_TEMPLATES_DIR).filter(f => f.endsWith('.yml'));
    user.forEach(f => templates.push({ name: f, builtin: false }));

    return templates;
}

export function getTemplate(name) {
    initTemplatesDir();
    const builtInPath = path.join(BUILT_IN_DIR, name);
    const userPath = path.join(USER_TEMPLATES_DIR, name);

    if (fs.existsSync(builtInPath)) {
        return fs.readFileSync(builtInPath, 'utf8');
    } else if (fs.existsSync(userPath)) {
        return fs.readFileSync(userPath, 'utf8');
    }
    return null;
}

export function saveTemplate(name, content) {
    initTemplatesDir();
    const userPath = path.join(USER_TEMPLATES_DIR, name);
    fs.writeFileSync(userPath, content, 'utf8');
}

export function deleteTemplate(name) {
    initTemplatesDir();
    const template = listTemplates().find(t => t.name === name);
    if (!template) throw new Error('Template not found');
    if (template.builtin) throw new Error('Cannot delete built-in template');

    const userPath = path.join(USER_TEMPLATES_DIR, name);
    if (fs.existsSync(userPath)) {
        fs.unlinkSync(userPath);
    }
}

export function copyTemplateTo(name, destPath) {
    const content = getTemplate(name);
    if (!content) throw new Error('Template not found');
    fs.writeFileSync(path.join(destPath, 'application.yml'), content, 'utf8');
}

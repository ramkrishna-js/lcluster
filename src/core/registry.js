import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const CONFIG_DIR = path.join(os.homedir(), '.lcluster');
const NODES_FILE = path.join(CONFIG_DIR, 'nodes.json');

let nodesArray = [];

export function loadNodes() {
    if (fs.existsSync(NODES_FILE)) {
        try {
            const data = fs.readFileSync(NODES_FILE, 'utf-8');
            nodesArray = JSON.parse(data);
        } catch (e) {
            nodesArray = [];
        }
    } else {
        nodesArray = [];
    }
}

export function saveNodes() {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    fs.writeFileSync(NODES_FILE, JSON.stringify(nodesArray, null, 2), 'utf-8');
}

export function addNode(node) {
    const existingIndex = nodesArray.findIndex(n => n.name === node.name);
    if (existingIndex !== -1) {
        nodesArray[existingIndex] = node;
    } else {
        nodesArray.push(node);
    }
    saveNodes();
}

export function removeNode(name) {
    nodesArray = nodesArray.filter(n => n.name !== name);
    saveNodes();
}

export function getNode(name) {
    return nodesArray.find(n => n.name === name);
}

export function getAllNodes() {
    return [...nodesArray];
}

export function updateNode(name, data) {
    const node = getNode(name);
    if (node) {
        Object.assign(node, data);
        saveNodes();
    }
}

import React, { useState } from 'react';
import { render, Box } from 'ink';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import yaml from 'js-yaml';
import Welcome from './Welcome.jsx';
import ThemePicker from './ThemePicker.jsx';
import GatewaySetup from './GatewaySetup.jsx';
import NodeSetup from './NodeSetup.jsx';
import DiscordAlerts from './DiscordAlerts.jsx';
import Done from './Done.jsx';
import { addNode } from '../../core/registry.js';
import { copyTemplateTo } from '../../templates/manager.js';
import { updateTheme } from '../theme/index.js';

function Wizard({ onComplete }) {
    const [step, setStep] = useState(0);
    const [systemContext, setSystemContext] = useState(null);
    const [config, setConfig] = useState({ theme: 'neon', gateway: { port: 2333, password: 'youshallnotpass' } });
    const [nodeConfig, setNodeConfig] = useState(null);

    const updateConfig = (subset) => setConfig({ ...config, ...subset });

    const handleDone = () => {
        // Save config
        const configPath = path.join(os.homedir(), '.lcluster', 'config.yml');
        fs.mkdirSync(path.dirname(configPath), { recursive: true });

        const existing = fs.existsSync(configPath) ? yaml.load(fs.readFileSync(configPath, 'utf8')) : {};
        const finalConf = { ...existing, ...config };
        if (!finalConf.cluster) finalConf.cluster = { startedAt: new Date().toISOString() };

        fs.writeFileSync(configPath, yaml.dump(finalConf), 'utf8');

        // Save Node
        if (nodeConfig) {
            addNode({
                name: nodeConfig.name,
                template: nodeConfig.template,
                mode: nodeConfig.mode,
                port: nodeConfig.port,
                status: 'offline',
                players: 0,
                ping: 0,
                cpu: 0,
                memory: 0
            });
            // Copy template
            const NODES_DIR = path.join(os.homedir(), '.lcluster', 'nodes');
            const workingDir = path.join(NODES_DIR, nodeConfig.name);
            if (!fs.existsSync(workingDir)) fs.mkdirSync(workingDir, { recursive: true });
            copyTemplateTo(nodeConfig.template, workingDir);
        }

        onComplete();
    };

    return (
        <Box>
            {step === 0 && <Welcome onNext={() => setStep(1)} updateSystemContext={setSystemContext} />}
            {step === 1 && <ThemePicker onNext={() => setStep(2)} updateConfig={updateConfig} />}
            {step === 2 && <GatewaySetup onNext={() => setStep(3)} updateConfig={updateConfig} />}
            {step === 3 && <NodeSetup onNext={() => setStep(4)} addInitialNode={setNodeConfig} systemContext={systemContext} />}
            {step === 4 && <DiscordAlerts onNext={() => setStep(5)} updateConfig={updateConfig} />}
            {step === 5 && <Done onDone={handleDone} config={config} nodeConfig={nodeConfig} systemContext={systemContext} />}
        </Box>
    );
}

export function initWizard() {
    return new Promise((resolve) => {
        const { unmount } = render(<Wizard onComplete={() => {
            unmount();
            resolve();
        }} />, { fullscreen: true });
    });
}

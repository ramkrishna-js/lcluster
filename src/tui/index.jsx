import React, { useState } from 'react';
import { render, Box, Text, useInput } from 'ink';
import { getTheme, loadTheme } from './theme/index.js';
import { loadNodes, getAllNodes } from '../core/registry.js';
import { startGateway } from '../gateway/server.js';
import { startHealthCheck } from '../core/healthcheck.js';
import { initLogBuffer } from '../core/logBuffer.js';
import Dashboard from './screens/Dashboard.jsx';
import Logs from './screens/Logs.jsx';
import Templates from './screens/Templates.jsx';
// Add Settings as a mock here
function Settings({ onBack }) {
    const theme = getTheme();
    useInput((i, k) => { if (i === 'q' || k.escape) onBack(); });
    return <Box><Text color={theme.text}>Settings (Press q to back)</Text></Box>;
}

function App() {
    const [screen, setScreen] = useState('dashboard');
    const [targetNode, setTargetNode] = useState(null);
    const [nodes, setNodes] = useState(() => getAllNodes());
    const [gatewayInfo, setGatewayInfo] = useState({ port: '...' });
    const [uptimeStart] = useState(() => new Date());

    // Rerender loop for nodes
    React.useEffect(() => {
        const timer = setInterval(() => {
            setNodes(getAllNodes());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useInput((input, key) => {
        if (screen === 'dashboard') {
            if (input === 'q') {
                process.exit(0);
            }
            if (input === 'l') {
                const selected = nodes[0]; // In real impl, get from selectedIndex of NodeList
                if (selected) {
                    setTargetNode(selected.name);
                    setScreen('logs');
                }
            }
            if (input === 't') {
                setScreen('templates');
            }
            if (input === 's') {
                setScreen('settings');
            }
        }
    });

    if (screen === 'logs') return <Logs nodeName={targetNode} onBack={() => setScreen('dashboard')} />;
    if (screen === 'templates') return <Templates onBack={() => setScreen('dashboard')} />;
    if (screen === 'settings') return <Settings onBack={() => setScreen('dashboard')} />;

    return <Dashboard nodes={nodes} gatewayPort={2333} uptimeStart={uptimeStart} />;
}

export function renderTui() {
    loadTheme();
    loadNodes();
    initLogBuffer();
    startHealthCheck();
    startGateway();

    render(<App />, { fullscreen: true });
}

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { getTheme } from '../theme/index.js';
import Border from '../components/Border.jsx';
import NodeList from '../components/NodeList.jsx';
import StatPanel from '../components/StatPanel.jsx';
import NodeDetail from './NodeDetail.jsx';

export default function Dashboard({ nodes, gatewayPort, uptimeStart, onAction }) {
    const theme = getTheme();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedNode, setSelectedNode] = useState(null);

    const uptime = Date.now() - new Date(uptimeStart).getTime();

    return (
        <Box flexDirection="column" paddingX={2} paddingY={1} width="100%" height="100%" backgroundColor={theme.background}>
            <Border borderColor={theme.border}>
                <Box flexDirection="row" justifyContent="space-between" width="100%">
                    <Text color={theme.accent}>  ⬡ lcluster v1.0.2-beta</Text>
                    <Box flexDirection="row" gap={2}>
                        <Text color={theme.online}>● {nodes.filter(n => n.status === 'online').length} online</Text>
                        <Text color={theme.degraded}>⚠ {nodes.filter(n => n.status === 'degraded' || n.status === 'reconnecting').length} warn</Text>
                    </Box>
                    <Text color={theme.accent}>gateway :{gatewayPort}  <Text color={theme.online}>●</Text></Text>
                </Box>
            </Border>

            <Box marginY={1}>
                <NodeList
                    nodes={nodes}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                    onSelectNode={setSelectedNode}
                />
            </Box>

            <Box flexDirection="row" gap={2}>
                <StatPanel nodes={nodes} uptime={uptime} gatewayPort={gatewayPort} />
                <NodeDetail node={selectedNode} onClose={() => setSelectedNode(null)} />
            </Box>

            <Box marginTop={1}>
                <Text color={theme.textDim}>
                    [↑↓] navigate  [enter] manage  [n] new node  [t] templates  [q] quit{'\n'}
                    [r] restart    [d] delete      [g] gateway   [l] logs
                </Text>
            </Box>
        </Box>
    );
}

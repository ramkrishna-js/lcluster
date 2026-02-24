import React from 'react';
import { Box, Text } from 'ink';
import { getTheme } from '../theme/index.js';
import Border from '../components/Border.jsx';
import StatusDot from '../components/StatusDot.jsx';
import MiniBar from '../components/MiniBar.jsx';

export default function NodeDetail({ node, onClose }) {
    const theme = getTheme();

    if (!node) return <Border title="node details" width="50%" height={10}></Border>;

    const modeIcon = node.mode === 'docker' ? '🐋' : ' ';
    const formatUptime = () => {
        // mock for now
        return '6h 12m';
    };

    return (
        <Border title="node details" width="50%">
            <Box flexDirection="column" paddingX={1}>
                <Box flexDirection="row" justifyContent="space-between">
                    <Text color={theme.textDim}>name    </Text>
                    <Text color={theme.text} bold>{node.name}</Text>
                </Box>
                <Box flexDirection="row" justifyContent="space-between">
                    <Text color={theme.textDim}>mode    </Text>
                    <Text color={node.mode === 'docker' ? theme.docker : theme.process}>{node.mode} {modeIcon}</Text>
                </Box>
                <Box flexDirection="row" justifyContent="space-between" marginTop={1}>
                    <Text color={theme.textDim}>ping    </Text>
                    <Text color={theme.text}>{node.ping || 0}ms    <StatusDot status={node.status} /> {node.status}</Text>
                </Box>
                <Box flexDirection="row" justifyContent="space-between">
                    <Text color={theme.textDim}>cpu     </Text>
                    <Text color={theme.text}>{String(node.cpu || 0).padEnd(4)}%     <MiniBar percent={node.cpu || 0} /></Text>
                </Box>
                <Box flexDirection="row" justifyContent="space-between">
                    <Text color={theme.textDim}>mem     </Text>
                    <Text color={theme.text}>{String(node.memory || 0).padEnd(4)}mb   <MiniBar percent={((node.memory || 0) / 2048) * 100} /></Text>
                </Box>
                <Box flexDirection="row" justifyContent="space-between" marginTop={1}>
                    <Text color={theme.textDim}>uptime  </Text>
                    <Text color={theme.text}>{formatUptime()}</Text>
                </Box>
                <Box flexDirection="row" justifyContent="space-between">
                    <Text color={theme.textDim}>status  </Text>
                    <Text color={theme.text}><StatusDot status={node.status} /> {node.status}</Text>
                </Box>

                <Box marginTop={1} justifyContent="center">
                    <Text color={theme.textDim}>[r] restart   [d] delete   [l] logs   [enter] close</Text>
                </Box>
            </Box>
        </Border>
    );
}

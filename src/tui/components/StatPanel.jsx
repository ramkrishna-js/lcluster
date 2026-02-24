import React from 'react';
import { Box, Text } from 'ink';
import { getTheme } from '../theme/index.js';
import Border from './Border.jsx';
import StatusDot from './StatusDot.jsx';

export default function StatPanel({ nodes, uptime, gatewayPort }) {
    const theme = getTheme();

    const online = nodes.filter(n => n.status === 'online').length;
    const degraded = nodes.filter(n => n.status === 'degraded').length;
    const offline = nodes.filter(n => n.status === 'offline').length;
    const total = nodes.length;

    const players = nodes.reduce((sum, n) => sum + (n.players || 0), 0);
    const avgPing = total > 0 ? Math.round(nodes.reduce((sum, n) => sum + (n.ping || 0), 0) / total) : 0;

    // Build Ping Sparkline
    let globalHist = [];
    for (let i = 0; i < 10; i++) {
        let sum = 0, count = 0;
        nodes.forEach(n => {
            if (n.pingHistory && n.pingHistory.length > i) {
                sum += n.pingHistory[i];
                count++;
            }
        });
        if (count > 0) globalHist.push(Math.round(sum / count));
    }
    const sparkChars = [' ', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
    let sparkline = '';
    if (globalHist.length > 0) {
        const maxPing = Math.max(...globalHist, 50);
        sparkline = globalHist.map(p => sparkChars[Math.min(7, Math.floor((p / maxPing) * 8))]).join('');
    }
    sparkline = sparkline.padEnd(10, ' ');

    const formatUptime = (ms) => {
        const d = Math.floor(ms / (1000 * 60 * 60 * 24));
        const h = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        return `${d}d ${h}h ${m}m`;
    };

    return (
        <Border title="quick stats" width="50%">
            <Box flexDirection="row" justifyContent="space-between">
                <Text color={theme.text}> <StatusDot status="online" /> online  <Text bold>{online}</Text></Text>
                <Text color={theme.text}> <StatusDot status="degraded" /> warn  <Text bold>{degraded}</Text></Text>
            </Box>
            <Box flexDirection="row" justifyContent="space-between" marginBottom={1}>
                <Text color={theme.text}> <StatusDot status="offline" /> offline <Text bold>{offline}</Text></Text>
                <Text color={theme.textDim}> total  <Text bold>{total}</Text></Text>
            </Box>
            <Text color={theme.borderDim}>{'─'.repeat(35)}</Text>
            <Box flexDirection="column" marginTop={1}>
                <Text color={theme.text}>players       <Text bold>{players} active</Text></Text>
                <Text color={theme.text}>avg ping      <Text bold>{avgPing}ms  </Text><Text color={theme.accent}>{sparkline}</Text>  last 10</Text>
                <Text color={theme.text}>gateway       <StatusDot status="online" /> active :{gatewayPort}</Text>
                <Text color={theme.text}>cluster up    <Text bold>{formatUptime(uptime)}</Text></Text>
            </Box>
        </Border>
    );
}

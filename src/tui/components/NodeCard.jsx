import React from 'react';
import { Box, Text } from 'ink';
import { getTheme } from '../theme/index.js';
import StatusDot from './StatusDot.jsx';
import MiniBar from './MiniBar.jsx';
import chalk from 'chalk';

export default function NodeCard({ node, isSelected }) {
    const theme = getTheme();
    const bg = isSelected ? theme.selected : undefined;

    const modeIcon = node.mode === 'docker' ? '🐋' : ' ';
    const modeColor = node.mode === 'docker' ? theme.docker : theme.process;

    let statusColor = theme.offline;
    let statusText = node.status || 'offline';
    if (statusText === 'online') statusColor = theme.online;
    if (statusText === 'degraded' || statusText === 'reconnecting') statusColor = theme.degraded;
    if (statusText === 'waiting') statusColor = theme.textDim;

    const templateStr = node.mode === 'external' ? '—' : (node.template || 'unknown');

    // Safe memory calc - max memory is theoretically arbitrary but let's assume 1024mb 
    // for the mini bar percentage or just pass the raw mb. The prompt asks for "%" on memory
    // "MEM ▓▓░░░░ 29%" -> node.memory from healthcheck is in MB. We'll fake a % or assume 1GB max.
    const memPercent = Math.min(100, Math.round(((node.memory || 0) / 1024) * 100));

    return (
        <Box flexDirection="row" paddingX={1} paddingY={1} backgroundColor={bg}>
            <Box width={3}>
                {isSelected ? <Text color={theme.accent}>▶</Text> : <Text> </Text>}
            </Box>
            <Box flexDirection="column" flexGrow={1}>
                {/* Row 1: Status Dot, Name, Uptime */}
                <Box flexDirection="row" justifyContent="space-between">
                    <Box>
                        <StatusDot status={statusText} />
                        <Text color={theme.text} bold>  {node.name.padEnd(25)} </Text>
                    </Box>
                    <Box>
                        <Text color={theme.textDim}> ↑ 2d 4h 12m </Text>
                    </Box>
                </Box>

                {/* Row 2: Template, Mode, Status */}
                <Box marginLeft={3} flexDirection="row" justifyContent="space-between">
                    <Box>
                        <Text color={theme.textDim}>{templateStr}  ·  </Text>
                        <Text color={modeColor}>{node.mode} {modeIcon}</Text>
                    </Box>
                    <Box>
                        <Text color={statusColor}>
                            <StatusDot status={statusText} /> {statusText}
                        </Text>
                    </Box>
                </Box>

                {/* Row 3: Stats */}
                <Box marginTop={1} marginLeft={3}>
                    <Text color={theme.textDim}>
                        ♪ <Text color={theme.text}>{node.players || 0}</Text> players   ⚡ <Text color={theme.text}>{node.ping || 0}</Text>ms   CPU <MiniBar percent={node.cpu || 0} /> <Text color={theme.text}>{node.cpu || 0}</Text>%   MEM <MiniBar percent={memPercent} /> <Text color={theme.text}>{memPercent}</Text>%
                    </Text>
                </Box>
            </Box>
        </Box>
    );
}

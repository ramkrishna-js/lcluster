import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { getTheme } from '../theme/index.js';
import Border from '../components/Border.jsx';
import { getLogs } from '../../core/logBuffer.js';
import { events } from '../../core/events.js';

export default function Logs({ nodeName, onBack }) {
    const theme = getTheme();
    const [logs, setLogs] = useState([]);
    const [frozen, setFrozen] = useState(false);
    const [scroll, setScroll] = useState(0);

    useEffect(() => {
        setLogs(getLogs(nodeName));

        const handler = (line) => {
            setLogs(prev => {
                const next = [...prev, line];
                if (next.length > 200) next.shift();
                return next;
            });
        };

        events.on(`log:${nodeName}`, handler);
        return () => events.off(`log:${nodeName}`, handler);
    }, [nodeName]);

    useInput((input, key) => {
        if (input === 'f') {
            setFrozen(!frozen);
        }
        if (input === 'q' || key.escape) {
            onBack();
        }
        if (frozen) {
            if (key.upArrow) setScroll(s => Math.min(s + 1, Math.max(0, logs.length - 20))); // Assuming 20 lines visible
            if (key.downArrow) setScroll(s => Math.max(0, s - 1));
        }
    });

    // Calculate visible logs based on scroll
    const visibleLogs = frozen ? logs.slice(Math.max(0, logs.length - 20 - scroll), logs.length - scroll) : logs.slice(-20);

    return (
        <Box flexDirection="column" width="100%" height="100%" backgroundColor={theme.background}>
            <Border title={`logs: ${nodeName} ${frozen ? '[FROZEN]' : ''}`} borderColor={theme.border} flexGrow={1}>
                <Box flexDirection="column" paddingX={1} flexGrow={1} overflowY="hidden">
                    {visibleLogs.map((log, i) => (
                        <Text key={i} color={theme.textDim}>{log}</Text>
                    ))}
                </Box>
            </Border>
            <Box marginTop={1}>
                <Text color={theme.textDim}>[f] freeze/unfreeze   [↑↓] scroll (when frozen)   [q] back</Text>
            </Box>
        </Box>
    );
}

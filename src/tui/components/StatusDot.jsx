import React from 'react';
import { Text } from 'ink';
import { getTheme } from '../theme/index.js';

export default function StatusDot({ status }) {
    const theme = getTheme();
    let char = '●';
    let color = theme.online;

    if (status === 'degraded' || status === 'reconnecting') {
        char = '⚠';
        color = theme.degraded;
    } else if (status === 'offline' || status === 'unreachable') {
        char = '✕';
        color = theme.offline;
    } else if (status === 'waiting') {
        char = '⟳';
        color = theme.textDim;
    }

    return <Text color={color}>{char}</Text>;
}

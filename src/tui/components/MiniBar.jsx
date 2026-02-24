import React from 'react';
import { Text } from 'ink';

import { getTheme } from '../theme/index.js';

export default function MiniBar({ percent }) {
    const theme = getTheme();
    const totalBlocks = 8;
    const filledBlocks = Math.round((percent / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;

    let color = theme.online;
    if (percent > 50 && percent <= 79) color = theme.degraded;
    else if (percent >= 80) color = theme.offline;

    const filledStr = '▓'.repeat(Math.max(0, filledBlocks));
    const emptyStr = '░'.repeat(Math.max(0, emptyBlocks));

    return (
        <Text color={color}>{filledStr}{emptyStr}</Text>
    );
}

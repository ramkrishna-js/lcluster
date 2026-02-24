import React from 'react';
import { Box, Text } from 'ink';
import { getTheme } from '../theme/index.js';

export default function KeyHints({ hints }) {
    const theme = getTheme();
    return (
        <Box marginTop={1}>
            <Text color={theme.textDim}>
                {hints.map((h, i) => (
                    <React.Fragment key={i}>
                        <Text color={theme.textDim}>[</Text>
                        <Text color={theme.text} bold>{h.key}</Text>
                        <Text color={theme.textDim}>] {h.label}  </Text>
                    </React.Fragment>
                ))}
            </Text>
        </Box>
    );
}

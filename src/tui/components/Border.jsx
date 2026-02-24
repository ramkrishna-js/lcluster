import React from 'react';
import { Box, Text } from 'ink';
import { getTheme } from '../theme/index.js';

export default function Border({ title, children, isSelected, flexDirection = 'column', width, height, flexGrow }) {
    const theme = getTheme();
    const color = isSelected ? theme.selectedBorder : theme.border;

    return (
        <Box
            borderStyle="round"
            borderColor={color}
            flexDirection={flexDirection}
            width={width}
            height={height}
            flexGrow={flexGrow}
            paddingX={1}
        >
            {title && (
                <Box marginTop={-1} marginLeft={1} marginBottom={1}>
                    <Text color={color}> {title} </Text>
                </Box>
            )}
            {children}
        </Box>
    );
}

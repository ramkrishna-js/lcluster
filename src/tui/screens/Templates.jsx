import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { getTheme } from '../theme/index.js';
import Border from '../components/Border.jsx';
import { listTemplates } from '../../templates/manager.js';

export default function Templates({ onBack }) {
    const theme = getTheme();
    const [templates] = useState(() => listTemplates());
    const [selectedIndex, setSelectedIndex] = useState(0);

    useInput((input, key) => {
        if (key.upArrow) setSelectedIndex(Math.max(0, selectedIndex - 1));
        if (key.downArrow) setSelectedIndex(Math.min(templates.length, selectedIndex + 1));
        if (input === 'q' || key.escape) onBack();
        // In full impl [enter] would open editor or delete
    });

    return (
        <Box flexDirection="column" width="100%" height="100%" backgroundColor={theme.background}>
            <Border title="templates" borderColor={theme.border} flexGrow={1}>
                <Box flexDirection="column" paddingX={1} flexGrow={1}>
                    {templates.map((t, i) => (
                        <Text key={t.name} color={selectedIndex === i ? theme.text : theme.textDim} bold={selectedIndex === i}>
                            {selectedIndex === i ? <Text color={theme.accent}>▶ </Text> : '  '}
                            {t.name.padEnd(20)} {t.builtin && <Text color={theme.textDim}>(built-in)</Text>}
                        </Text>
                    ))}
                    <Box marginTop={1}>
                        <Text color={selectedIndex === templates.length ? theme.text : theme.textDim} bold={selectedIndex === templates.length}>
                            {selectedIndex === templates.length ? <Text color={theme.accent}>▶ </Text> : '  '}
                            + Add new template
                        </Text>
                    </Box>
                </Box>
            </Border>
            <Box marginTop={1}>
                <Text color={theme.textDim}>[↑↓] navigate   [enter] select / edit   [d] delete (user only)   [q] back</Text>
            </Box>
        </Box>
    );
}

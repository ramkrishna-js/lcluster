import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { updateTheme, getTheme } from '../theme/index.js';
import Border from '../components/Border.jsx';

const themes = [
    { id: 'neon', name: '1. Cyberpunk Neon', desc: 'green glow, dark background' },
    { id: 'minimal', name: '2. Clean Minimal', desc: 'soft purple, modern and readable' },
    { id: 'amber', name: '3. Retro Amber', desc: 'old school CRT terminal feel' },
    { id: 'cyberpunk', name: '4. Cyberpunk', desc: 'neon pink and cyan highlights' },
    { id: 'hacker', name: '5. Hacker', desc: 'matrix style green on black' },
    { id: 'ocean', name: '6. Deep Ocean', desc: 'calming deep blues and seafoam' }
];

export default function ThemePicker({ onNext, updateConfig }) {
    const [selected, setSelected] = useState(0);

    useInput((input, key) => {
        if (key.upArrow) setSelected(Math.max(0, selected - 1));
        if (key.downArrow) setSelected(Math.min(themes.length - 1, selected + 1));
        if (key.return) {
            updateConfig({ theme: themes[selected].id });
            onNext();
        }
    });

    // Re-render theme preview automatically
    updateTheme(themes[selected].id);
    const theme = getTheme();

    return (
        <Box flexDirection="column" padding={1} backgroundColor={theme.background}>
            <Border title="choose your theme" borderColor={theme.border} padding={1}>
                <Box flexDirection="column" marginY={1} minHeight={5}>
                    {themes.map((t, i) => (
                        <Box key={t.id} marginX={2}>
                            {selected === i ? <Text color={theme.accent}>▶  </Text> : <Text>   </Text>}
                            <Text color={selected === i ? theme.text : theme.textDim} bold={selected === i}>
                                {t.name.padEnd(25)} — {t.desc}
                            </Text>
                        </Box>
                    ))}
                </Box>
                <Text color={theme.textDim}> You can change this later in settings.</Text>
            </Border>
            <Box marginTop={1}>
                <Text color={theme.textDim}>[↑↓] select   [enter] confirm</Text>
            </Box>
        </Box>
    );
}

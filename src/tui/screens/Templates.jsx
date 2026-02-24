import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { getTheme } from '../theme/index.js';
import Border from '../components/Border.jsx';
import { listTemplates, deleteTemplate, saveTemplate } from '../../templates/manager.js';
import TextInput from 'ink-text-input';

export default function Templates({ onBack }) {
    const theme = getTheme();
    const [templates, setTemplates] = useState(() => listTemplates());
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState('');
    const [error, setError] = useState('');

    const refresh = () => setTemplates(listTemplates());

    useInput((input, key) => {
        if (showCreate) {
            if (key.escape) {
                setShowCreate(false);
                setNewName('');
                setError('');
            }
            if (key.return) {
                if (!newName || newName.length < 2) {
                    setError('Name too short');
                    return;
                }
                const finalName = newName.endsWith('.yml') ? newName : newName + '.yml';
                if (templates.find(t => t.name === finalName)) {
                    setError('Template already exists');
                    return;
                }

                // Create default baseline
                const baseContent = `server:\n  port: 2333\n  address: 0.0.0.0\n\nlavalink:\n  server:\n    password: "youshallnotpass"\n    sources:\n      youtube: true\n`;
                saveTemplate(finalName, baseContent);
                setShowCreate(false);
                setNewName('');
                setError('');
                refresh();
                setSelectedIndex(templates.length); // point back to add new button usually
            }
            return;
        }

        if (key.upArrow) setSelectedIndex(Math.max(0, selectedIndex - 1));
        if (key.downArrow) setSelectedIndex(Math.min(templates.length, selectedIndex + 1));
        if (input === 'q' || key.escape) onBack();

        // Delete template
        if (input === 'd' && selectedIndex < templates.length) {
            const t = templates[selectedIndex];
            if (t.builtin) {
                setError('Cannot delete built-in template');
                setTimeout(() => setError(''), 2000);
            } else {
                deleteTemplate(t.name);
                setSelectedIndex(Math.max(0, selectedIndex - 1));
                refresh();
            }
        }

        // Add new
        if (key.return && selectedIndex === templates.length) {
            setShowCreate(true);
        }
    });

    return (
        <Box flexDirection="column" width="100%" height="100%" backgroundColor={theme.background}>
            <Border title="templates" borderColor={theme.border} flexGrow={1}>
                <Box flexDirection="column" paddingX={1} flexGrow={1}>
                    {templates.map((t, i) => (
                        <Text key={t.name} color={selectedIndex === i && !showCreate ? theme.text : theme.textDim} bold={selectedIndex === i && !showCreate}>
                            {selectedIndex === i && !showCreate ? <Text color={theme.accent}>▶ </Text> : '  '}
                            {t.name.padEnd(20)} {t.builtin && <Text color={theme.textDim}>(built-in)</Text>}
                        </Text>
                    ))}

                    {!showCreate && (
                        <Box marginTop={1}>
                            <Text color={selectedIndex === templates.length ? theme.text : theme.textDim} bold={selectedIndex === templates.length}>
                                {selectedIndex === templates.length ? <Text color={theme.accent}>▶ </Text> : '  '}
                                + Add new template
                            </Text>
                        </Box>
                    )}

                    {showCreate && (
                        <Box marginTop={1} flexDirection="column">
                            <Box>
                                <Text color={theme.accent}>▶ </Text>
                                <Text color={theme.text}>Name: </Text>
                                <TextInput value={newName} onChange={setNewName} focus={showCreate} />
                            </Box>
                            <Text color={theme.textDim}>Press [Enter] to create, [Esc] to cancel. Edit manually in ~/.lcluster/templates</Text>
                        </Box>
                    )}

                    {error && (
                        <Box marginTop={1}>
                            <Text color={theme.error}>⚠ {error}</Text>
                        </Box>
                    )}
                </Box>
            </Border>
            <Box marginTop={1}>
                {showCreate ? (
                    <Text color={theme.textDim}>[enter] create   [esc] cancel</Text>
                ) : (
                    <Text color={theme.textDim}>[↑↓] navigate   [enter] create new   [d] delete (user only)   [q] back</Text>
                )}
            </Box>
        </Box>
    );
}

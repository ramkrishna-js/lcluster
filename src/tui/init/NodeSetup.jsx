import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { getTheme } from '../theme/index.js';
import Border from '../components/Border.jsx';
import { listTemplates, getTemplate } from '../../templates/manager.js';
import { extractConfig } from '../../templates/validator.js';

const modes = ['process', 'docker'];

export default function NodeSetup({ onNext, systemContext, addInitialNode }) {
    const theme = getTheme();
    const [step, setStep] = useState('choice'); // choice, pick-template, settings, external
    const [choice, setChoice] = useState(0);

    const [templates] = useState(() => listTemplates());
    const [templateIdx, setTemplateIdx] = useState(0);

    const [nodeName, setNodeName] = useState('node-main');
    const [nodePort, setNodePort] = useState('2334');
    const [nodeHost, setNodeHost] = useState('localhost');
    const [nodePassword, setNodePassword] = useState('youshallnotpass');
    const [runMode, setRunMode] = useState(systemContext.docker.running ? 1 : 0);
    const [field, setField] = useState(0);

    useInput((input, key) => {
        if (step === 'choice') {
            if (key.upArrow) setChoice(Math.max(0, choice - 1));
            if (key.downArrow) setChoice(Math.min(3, choice + 1));
            if (key.return) {
                if (choice === 0) setStep('pick-template');
                else if (choice === 1) setStep('settings'); // Skip paste for simplicity in spec mock
                else if (choice === 2) {
                    setNodePort('2333');
                    setStep('external');
                }
                else if (choice === 3) onNext();
            }
        } else if (step === 'pick-template') {
            if (key.upArrow) setTemplateIdx(Math.max(0, templateIdx - 1));
            if (key.downArrow) setTemplateIdx(Math.min(templates.length - 1, templateIdx + 1));
            if (key.return) {
                const tpl = templates[templateIdx].name;
                const conf = extractConfig(getTemplate(tpl));
                if (conf?.port) setNodePort(String(conf.port));
                setStep('settings');
            }
        } else if (step === 'settings') {
            if (key.tab) setField((field + 1) % 3);
            if (field === 2) {
                if (key.leftArrow) setRunMode(0);
                if (key.rightArrow && systemContext.docker.running) setRunMode(1);
            }
            if (key.return) {
                addInitialNode({
                    name: nodeName,
                    port: parseInt(nodePort),
                    template: choice === 0 ? templates[templateIdx].name : 'custom.yml',
                    mode: modes[runMode]
                });
                onNext();
            }
        } else if (step === 'external') {
            if (key.tab) setField((field + 1) % 4);
            if (key.return) {
                addInitialNode({
                    name: nodeName,
                    host: nodeHost,
                    port: parseInt(nodePort),
                    password: nodePassword,
                    mode: 'external',
                    autoConnect: true
                });
                onNext();
            }
        }
    });

    return (
        <Box flexDirection="column" padding={1} backgroundColor={theme.background}>
            {step === 'choice' && (
                <Border title="add your first lavalink node">
                    <Box flexDirection="column" marginX={2} marginY={1}>
                        <Text color={theme.text}>How do you want to run it?</Text>
                        <Box flexDirection="column" marginTop={1}>
                            <Text>{choice === 0 ? <Text color={theme.accent}>▶ </Text> : '  '}1. Use a template     — lcluster spawns a fresh Lavalink</Text>
                            <Text>{choice === 1 ? <Text color={theme.accent}>▶ </Text> : '  '}2. Use my own config  — paste my application.yml</Text>
                            <Text>{choice === 2 ? <Text color={theme.accent}>▶ </Text> : '  '}3. External node      — connect to an already running one</Text>
                            <Text>{choice === 3 ? <Text color={theme.accent}>▶ </Text> : '  '}4. Skip for now       — I'll add nodes later</Text>
                        </Box>
                    </Box>
                </Border>
            )}

            {step === 'pick-template' && (
                <Border title="choose a template">
                    <Box flexDirection="column" marginX={2} marginY={1}>
                        {templates.map((t, i) => (
                            <Text key={t.name}>
                                {templateIdx === i ? <Text color={theme.accent}>▶ </Text> : '  '}
                                {t.name} {t.builtin && <Text color={theme.textDim}>(built-in)</Text>}
                            </Text>
                        ))}
                    </Box>
                </Border>
            )}

            {step === 'settings' && (
                <Border title="node settings">
                    <Box flexDirection="column" marginX={2} marginY={1}>
                        <Box>
                            <Text color={theme.textDim}>Node name  › </Text>
                            <TextInput value={nodeName} onChange={setNodeName} focus={field === 0} />
                        </Box>
                        <Box>
                            <Text color={theme.textDim}>Port       › </Text>
                            <TextInput value={nodePort} onChange={setNodePort} focus={field === 1} />
                        </Box>
                        <Box marginTop={1}>
                            <Text color={theme.textDim}>Run mode   </Text>
                            <Text color={field === 2 ? theme.text : theme.textDim}>
                                {runMode === 0 ? <Text color={theme.accent}>▶ [ process ]</Text> : '  [ process ]'}
                                {runMode === 1 ? <Text color={theme.accent}>  ▶ [ docker ]</Text> : (systemContext.docker.running ? '    [ docker ]' : <Text color={theme.textDim}>   (docker not available)</Text>)}
                            </Text>
                        </Box>
                    </Box>
                </Border>
            )}

            {step === 'external' && (
                <Border title="external node setup">
                    <Box flexDirection="column" marginX={2} marginY={1}>
                        <Box>
                            <Text color={theme.textDim}>Name       › </Text>
                            <TextInput value={nodeName} onChange={setNodeName} focus={field === 0} />
                        </Box>
                        <Box>
                            <Text color={theme.textDim}>Host       › </Text>
                            <TextInput value={nodeHost} onChange={setNodeHost} focus={field === 1} />
                        </Box>
                        <Box>
                            <Text color={theme.textDim}>Port       › </Text>
                            <TextInput value={nodePort} onChange={setNodePort} focus={field === 2} />
                        </Box>
                        <Box>
                            <Text color={theme.textDim}>Password   › </Text>
                            <TextInput value={nodePassword} onChange={setNodePassword} mask="*" focus={field === 3} />
                        </Box>
                        <Box marginTop={1} flexDirection="column">
                            <Text color={theme.textDim}>lcluster will connect to this node automatically.</Text>
                            <Text color={theme.textDim}>Make sure it is running before opening the dashboard.</Text>
                        </Box>
                    </Box>
                </Border>
            )}
        </Box>
    );
}

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import fetch from 'node-fetch';
import { getTheme } from '../theme/index.js';
import Border from '../components/Border.jsx';

export default function DiscordAlerts({ onNext, updateConfig }) {
    const theme = getTheme();
    const [step, setStep] = useState('choice'); // choice, webhook, test
    const [choice, setChoice] = useState(0); // 0 = Yes, 1 = No
    const [webhookUrl, setWebhookUrl] = useState('');
    const [testStatus, setTestStatus] = useState('');

    useInput(async (input, key) => {
        if (step === 'choice') {
            if (key.upArrow) setChoice(Math.max(0, choice - 1));
            if (key.downArrow) setChoice(Math.min(1, choice + 1));
            if (key.return) {
                if (choice === 0) {
                    setStep('webhook');
                } else {
                    updateConfig({
                        alerts: {
                            discord: { enabled: false, webhook: '' },
                            desktop: { enabled: true },
                            sound: { enabled: false },
                            thresholds: { cpu_warn: 90, idle_warn: false }
                        }
                    });
                    onNext();
                }
            }
        } else if (step === 'webhook') {
            if (key.return && webhookUrl.length > 10) {
                setStep('test');
                setTestStatus('Sending test message...');

                try {
                    const res = await fetch(webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            embeds: [{
                                title: 'ℹ️ lcluster Test',
                                description: 'Webhook configured successfully!',
                                color: 0x89B4FA
                            }]
                        })
                    });
                    if (res.ok) {
                        setTestStatus('Sending test message...  ✔ webhook works!');
                        setTimeout(() => {
                            updateConfig({
                                alerts: {
                                    discord: { enabled: true, webhook: webhookUrl },
                                    desktop: { enabled: true },
                                    sound: { enabled: false },
                                    thresholds: { cpu_warn: 90, idle_warn: false }
                                }
                            });
                            onNext();
                        }, 1500);
                    } else {
                        setTestStatus('Sending test message...  ✕ could not reach webhook. Check the URL.');
                        setTimeout(() => setStep('webhook'), 2000);
                    }
                } catch (e) {
                    setTestStatus('Sending test message...  ✕ could not reach webhook. Check the URL.');
                    setTimeout(() => setStep('webhook'), 2000);
                }
            } else if (key.escape) {
                setStep('choice');
            }
        }
    });

    return (
        <Box flexDirection="column" width="100%" height="100%" backgroundColor={theme.background}>
            {step === 'choice' && (
                <Border title="discord alerts (optional)" borderColor={theme.border}>
                    <Box flexDirection="column" marginX={2} marginY={1}>
                        <Text color={theme.text}>Want to get notified in Discord when a node goes down?</Text>
                        <Box flexDirection="column" marginTop={1}>
                            <Text>{choice === 0 ? <Text color={theme.accent}>▶ </Text> : '  '}Yes — paste a webhook URL</Text>
                            <Text>{choice === 1 ? <Text color={theme.accent}>▶ </Text> : '  '}No  — skip for now</Text>
                        </Box>
                        <Box marginTop={1}>
                            <Text color={theme.textDim}>You can add this later from the Settings screen.</Text>
                        </Box>
                    </Box>
                </Border>
            )}

            {(step === 'webhook' || step === 'test') && (
                <Border title="discord webhook" borderColor={theme.border}>
                    <Box flexDirection="column" marginX={2} marginY={1}>
                        <Box>
                            <Text color={theme.textDim}>Webhook URL  › </Text>
                            {step === 'webhook' ? (
                                <TextInput value={webhookUrl} onChange={setWebhookUrl} />
                            ) : (
                                <Text>{webhookUrl.substring(0, 30)}...</Text>
                            )}
                        </Box>

                        {step === 'test' ? (
                            <Box marginTop={1}>
                                <Text color={theme.text}>{testStatus}</Text>
                            </Box>
                        ) : (
                            <Box marginTop={1} flexDirection="column">
                                <Text color={theme.textDim}>How to get one:</Text>
                                <Text color={theme.textDim}>Discord Server → Settings → Integrations → Webhooks → New</Text>
                            </Box>
                        )}
                    </Box>
                </Border>
            )}
        </Box>
    );
}

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { getTheme } from '../theme/index.js';
import Border from '../components/Border.jsx';

export default function GatewaySetup({ onNext, updateConfig }) {
    const theme = getTheme();
    const [port, setPort] = useState('2333');
    const [password, setPassword] = useState('');
    const [field, setField] = useState(0); // 0=port, 1=password
    const [error, setError] = useState(null);

    useInput((input, key) => {
        if (key.return) {
            const p = parseInt(port);
            if (isNaN(p) || p < 1024 || p > 65535) {
                setError('Port must be between 1024 and 65535');
                return;
            }
            if (password.length === 0) {
                setError('Password cannot be empty');
                return;
            }
            updateConfig({ gateway: { port: p, password } });
            onNext();
        }
        if (key.tab) {
            setField(field === 0 ? 1 : 0);
        }
    });

    return (
        <Box flexDirection="column" padding={1} backgroundColor={theme.background}>
            <Border title="gateway setup" borderColor={theme.border}>
                <Box flexDirection="column" marginY={1} marginX={2}>
                    <Text color={theme.text}>This is the single address your Discord bot will connect to.</Text>
                    <Box marginTop={1} flexDirection="column">
                        <Box>
                            <Text color={theme.textDim}>Port      › </Text>
                            <TextInput value={port} onChange={setPort} focus={field === 0} />
                        </Box>
                        <Box>
                            <Text color={theme.textDim}>Password  › </Text>
                            <TextInput value={password} onChange={setPassword} focus={field === 1} mask="•" />
                        </Box>
                    </Box>
                    <Box marginTop={1}>
                        <Text color={theme.textDim}>Your bot will connect to:  <Text color={theme.accent}>localhost:{port || '2333'}</Text></Text>
                    </Box>
                    {error && <Text color={theme.offline}>{error}</Text>}
                </Box>
            </Border>
            <Box marginTop={1}>
                <Text color={theme.textDim}>[tab] next field   [enter] confirm</Text>
            </Box>
        </Box>
    );
}

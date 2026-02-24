import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { getTheme } from '../theme/index.js';
import Border from '../components/Border.jsx';
import { installSystemd } from '../../system/systemd.js';
import os from 'node:os';

export default function Done({ onDone, config, nodeConfig, systemContext }) {
    const theme = getTheme();
    const [askSystemd, setAskSystemd] = useState(
        systemContext.os === 'ubuntu' || systemContext.os === 'debian'
    );
    const [sysChoice, setSysChoice] = useState(0); // 0=yes, 1=no
    const [systemdInstalled, setSystemdInstalled] = useState(false);

    useInput((input, key) => {
        if (askSystemd) {
            if (key.upArrow) setSysChoice(0);
            if (key.downArrow) setSysChoice(1);
            if (key.return) {
                if (sysChoice === 0) {
                    const ok = installSystemd();
                    setSystemdInstalled(ok);
                }
                setAskSystemd(false);
            }
        } else {
            if (key.return) {
                onDone();
            }
        }
    });

    if (askSystemd) {
        return (
            <Box flexDirection="column" padding={1} backgroundColor={theme.background}>
                <Border title="auto startup">
                    <Box flexDirection="column" marginX={2} marginY={1}>
                        <Text color={theme.text}>We detected you are on Ubuntu/Debian.</Text>
                        <Text color={theme.text}>Want lcluster to start automatically on boot?</Text>
                        <Box marginTop={1} flexDirection="column">
                            <Text>{sysChoice === 0 ? <Text color={theme.accent}>▶ </Text> : '  '}Yes — install as systemd service</Text>
                            <Text>{sysChoice === 1 ? <Text color={theme.accent}>▶ </Text> : '  '}No  — I will start it manually</Text>
                        </Box>
                    </Box>
                </Border>
            </Box>
        );
    }

    return (
        <Box flexDirection="column" padding={1} backgroundColor={theme.background}>
            <Border title="all done!">
                <Box flexDirection="column" marginX={2} marginY={1}>
                    <Text color={theme.online}>✔ Theme saved             <Text color={theme.text}>{config.theme}</Text></Text>
                    <Text color={theme.online}>✔ Gateway configured      <Text color={theme.text}>localhost:{config.gateway?.port || 2333}</Text></Text>
                    {nodeConfig && (
                        <Text color={theme.online}>✔ Node created            <Text color={theme.text}>{nodeConfig.name} ({nodeConfig.mode})</Text></Text>
                    )}
                    {systemdInstalled && (
                        <Text color={theme.online}>✔ Systemd service         <Text color={theme.text}>installed</Text></Text>
                    )}

                    <Box flexDirection="column" marginTop={1}>
                        <Text color={theme.textDim}>Connect your bot to:</Text>
                        <Text color={theme.textDim}>host      → <Text color={theme.text}>localhost</Text></Text>
                        <Text color={theme.textDim}>port      → <Text color={theme.text}>{config.gateway?.port || 2333}</Text></Text>
                        <Text color={theme.textDim}>password  → <Text color={theme.text}>{config.gateway?.password || 'youshallnotpass'}</Text></Text>
                    </Box>
                    <Box marginTop={1}>
                        <Text color={theme.textDim}>Run <Text color={theme.text} bold>lcluster</Text> to open your dashboard.</Text>
                    </Box>
                </Box>
            </Border>
        </Box>
    );
}

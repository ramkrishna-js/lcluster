import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import yaml from 'js-yaml';
import { getTheme, updateTheme } from '../theme/index.js';
import Border from '../components/Border.jsx';
import TextInput from 'ink-text-input';

const themes = ['neon', 'minimal', 'amber', 'cyberpunk', 'hacker', 'ocean'];

export default function Settings({ onBack }) {
    const configPath = path.join(os.homedir(), '.lcluster', 'config.yml');
    const [config, setConfig] = useState(() => {
        if (fs.existsSync(configPath)) {
            try { return yaml.load(fs.readFileSync(configPath, 'utf8')) || {}; } catch { }
        }
        return {};
    });

    const [themeIdx, setThemeIdx] = useState(
        themes.indexOf(config.theme || 'neon') !== -1 ? themes.indexOf(config.theme || 'neon') : 0
    );

    const [portStr, setPortStr] = useState(String(config.gateway?.port || 2333));
    const [passStr, setPassStr] = useState(config.gateway?.password || 'youshallnotpass');

    const [discordUrl, setDiscordUrl] = useState(config.alerts?.discord?.webhook || '');
    const [discordEnabled, setDiscordEnabled] = useState(config.alerts?.discord?.enabled || false);
    const [desktopEnabled, setDesktopEnabled] = useState(config.alerts?.desktop?.enabled || false);
    const [soundEnabled, setSoundEnabled] = useState(config.alerts?.sound?.enabled || false);
    const [cpuWarn, setCpuWarn] = useState(String(config.alerts?.thresholds?.cpu_warn || 90));

    const [botEnabled, setBotEnabled] = useState(config.bot?.enabled || false);
    const [botToken, setBotToken] = useState(config.bot?.token || '');

    const [field, setField] = useState(0); // 0..9 

    const theme = getTheme();

    useInput((input, key) => {
        if (key.escape || (input === 'q' && field === 0)) {
            onBack();
        }
        if (key.upArrow) setField(Math.max(0, field - 1));
        if (key.downArrow) setField(Math.min(9, field + 1));

        if (field === 0) {
            if (key.leftArrow) {
                const newIdx = Math.max(0, themeIdx - 1);
                setThemeIdx(newIdx);
                updateTheme(themes[newIdx]);
            }
            if (key.rightArrow) {
                const newIdx = Math.min(themes.length - 1, themeIdx + 1);
                setThemeIdx(newIdx);
                updateTheme(themes[newIdx]);
            }
        }

        if (key.return) {
            if (field === 3) setDiscordEnabled(!discordEnabled);
            else if (field === 5) setDesktopEnabled(!desktopEnabled);
            else if (field === 6) setSoundEnabled(!soundEnabled);
            else if (field === 8) setBotEnabled(!botEnabled);
            else {
                // Save config
                const newConfig = {
                    ...config,
                    theme: themes[themeIdx],
                    gateway: {
                        port: parseInt(portStr),
                        password: passStr
                    },
                    alerts: {
                        discord: { enabled: discordEnabled, webhook: discordUrl },
                        desktop: { enabled: desktopEnabled },
                        sound: { enabled: soundEnabled },
                        thresholds: { cpu_warn: parseInt(cpuWarn) || 90, idle_warn: false }
                    },
                    bot: {
                        enabled: botEnabled,
                        token: botToken
                    }
                };
                fs.writeFileSync(configPath, yaml.dump(newConfig), 'utf8');
                onBack();
            }
        }
    });

    return (
        <Box flexDirection="column" width="100%" height="100%" backgroundColor={theme.background}>
            <Border title="settings" borderColor={theme.border} flexGrow={1}>
                <Box flexDirection="column" paddingX={1} marginY={1}>
                    <Text color={theme.textDim}>APPEARANCE</Text>
                    <Box marginBottom={1}>
                        <Text color={theme.textDim}>Theme          </Text>
                        <Text color={field === 0 ? theme.text : theme.textDim}>
                            {field === 0 && <Text color={theme.accent}>▶ </Text>}
                            {'< '} {themes[themeIdx].padEnd(8)} {' >'}
                        </Text>
                    </Box>
                    <Box>
                        <Text color={theme.textDim}>GATEWAY</Text>
                    </Box>
                    <Box>
                        <Text color={theme.textDim}>Port           </Text>
                        {field === 1 ? <Text color={theme.accent}>▶ </Text> : <Text>  </Text>}
                        <TextInput value={portStr} onChange={setPortStr} focus={field === 1} />
                    </Box>
                    <Box marginBottom={1}>
                        <Text color={theme.textDim}>Password       </Text>
                        {field === 2 ? <Text color={theme.accent}>▶ </Text> : <Text>  </Text>}
                        <TextInput value={passStr} onChange={setPassStr} focus={field === 2} mask="•" />
                    </Box>

                    <Box>
                        <Text color={theme.textDim}>ALERTS</Text>
                    </Box>
                    <Box>
                        <Text color={theme.textDim}>Discord        </Text>
                        {field === 3 ? <Text color={theme.accent}>▶ </Text> : <Text>  </Text>}
                        <Text color={discordEnabled ? theme.online : theme.textDim}>{discordEnabled ? '● enabled' : '○ disabled'}</Text>
                        <Text color={theme.textDim}>    webhook → </Text>
                        {field === 4 ? <Text color={theme.accent}>▶ </Text> : <Text>  </Text>}
                        <TextInput value={discordUrl} onChange={setDiscordUrl} focus={field === 4} />
                    </Box>
                    <Box>
                        <Text color={theme.textDim}>Desktop        </Text>
                        {field === 5 ? <Text color={theme.accent}>▶ </Text> : <Text>  </Text>}
                        <Text color={desktopEnabled ? theme.online : theme.textDim}>{desktopEnabled ? '● enabled' : '○ disabled'}</Text>
                    </Box>
                    <Box>
                        <Text color={theme.textDim}>Sound          </Text>
                        {field === 6 ? <Text color={theme.accent}>▶ </Text> : <Text>  </Text>}
                        <Text color={soundEnabled ? theme.online : theme.textDim}>{soundEnabled ? '● enabled' : '○ disabled'}</Text>
                    </Box>
                    <Box>
                        <Text color={theme.textDim}>CPU threshold  </Text>
                        {field === 7 ? <Text color={theme.accent}>▶ </Text> : <Text>  </Text>}
                        <TextInput value={cpuWarn} onChange={setCpuWarn} focus={field === 7} />
                        <Text color={theme.textDim}>%</Text>
                    </Box>

                    <Box marginTop={1}>
                        <Text color={theme.textDim}>CUSTOM BOT (v1.0.2)</Text>
                    </Box>
                    <Box>
                        <Text color={theme.textDim}>Active         </Text>
                        {field === 8 ? <Text color={theme.accent}>▶ </Text> : <Text>  </Text>}
                        <Text color={botEnabled ? theme.online : theme.textDim}>{botEnabled ? '● enabled' : '○ disabled'}</Text>
                    </Box>
                    <Box>
                        <Text color={theme.textDim}>Discord Token  </Text>
                        {field === 9 ? <Text color={theme.accent}>▶ </Text> : <Text>  </Text>}
                        <TextInput value={botToken} onChange={setBotToken} focus={field === 9} mask="•" />
                    </Box>
                </Box>
                <Box flexDirection="column" paddingX={1} marginTop={1}>
                    <Text color={theme.borderDim}>{'─'.repeat(45)}</Text>
                    <Box marginTop={1} flexDirection="column">
                        <Text color={theme.text} bold>lcluster v1.0.2-beta</Text>
                        <Text color={theme.textDim}>Built by <Text color={theme.text}>Ram Krishna</Text> & <Text color={theme.text}>Claude (Anthropic AI)</Text></Text>
                        <Text color={theme.textDim}>This project was designed and built with the help of AI.</Text>
                    </Box>
                </Box>
            </Border >
            <Box marginTop={1}>
                <Text color={theme.textDim}>[↑↓] fields   [←→] change theme   [enter] save   [q/esc] cancel</Text>
            </Box>
        </Box >
    );
}

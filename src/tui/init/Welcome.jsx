import React, { useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { detectSystem } from '../../system/detect.js';

export default function Welcome({ onNext, updateSystemContext }) {
    const [sys, setSys] = useState(null);

    useEffect(() => {
        detectSystem().then(res => {
            setSys(res);
            updateSystemContext(res);
        });
    }, []);

    useInput((input, key) => {
        if (key.return && sys) {
            if (!sys.port2333.available) {
                // Port taken, cannot block but ask them to change later. Actually spec says: 
                // "show error and ask user to choose a different port" -> this is handled in GatewaySetup.
            }
            onNext();
        }
    });

    return (
        <Box flexDirection="column" padding={1}>
            <Box borderStyle="double" paddingX={1} marginBottom={1}>
                <Text color="cyan">
                    ⬡ welcome to lcluster{'\n'}
                    the lavalink cluster manager
                </Text>
            </Box>

            <Text>Let's get you set up. This will only take a minute.</Text>
            <Box marginY={1}>
                {!sys ? <Text color="yellow">Checking your system...</Text> : (
                    <Box flexDirection="column">
                        <Text color="green">✔ Node.js {process.version}{' '.padEnd(16)} OK</Text>
                        {sys.java.found ?
                            <Text color="green">✔ Java {sys.java.version} detected{' '.padEnd(10)} OK</Text> :
                            <Text color="yellow">⚠ Java not found (Docker mode only)</Text>
                        }
                        {sys.docker.found && sys.docker.running ?
                            <Text color="green">✔ Docker detected{' '.padEnd(18)} OK</Text> :
                            <Text color="yellow">⚠ Docker not running (Process mode only)</Text>
                        }
                        {sys.port2333.available ?
                            <Text color="green">✔ Port 2333 available{' '.padEnd(14)} OK</Text> :
                            <Text color="red">✕ Port 2333 taken (Change in next step)</Text>
                        }
                    </Box>
                )}
            </Box>
            {sys && <Text color="gray">Press [enter] to continue</Text>}
        </Box>
    );
}

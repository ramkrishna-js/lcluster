import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { getTheme } from '../theme/index.js';
import Border from './Border.jsx';
import NodeCard from './NodeCard.jsx';

export default function NodeList({ nodes, onSelectNode, selectedIndex, setSelectedIndex }) {
    const theme = getTheme();
    const visibleCount = 3;
    const [scrollOffset, setScrollOffset] = useState(0);

    useEffect(() => {
        if (selectedIndex < scrollOffset) {
            setScrollOffset(selectedIndex);
        } else if (selectedIndex >= scrollOffset + visibleCount) {
            setScrollOffset(selectedIndex - visibleCount + 1);
        }
    }, [selectedIndex, scrollOffset, visibleCount]);

    useInput((input, key) => {
        if (key.upArrow) {
            setSelectedIndex(Math.max(0, selectedIndex - 1));
        }
        if (key.downArrow) {
            setSelectedIndex(Math.min(nodes.length - 1, selectedIndex + 1));
        }
        if (key.return) {
            if (nodes[selectedIndex]) {
                onSelectNode(nodes[selectedIndex]);
            }
        }
    });

    const visibleNodes = nodes.slice(scrollOffset, scrollOffset + visibleCount);
    const hiddenAbove = scrollOffset;
    const hiddenBelow = Math.max(0, nodes.length - (scrollOffset + visibleCount));

    return (
        <Border title={`nodes (${nodes.length}/10) ─────────────────────────────────────── [↑↓ scroll]`}>
            <Box flexDirection="column" minHeight={visibleCount * 3 + 2}>
                {hiddenAbove > 0 && (
                    <Box justifyContent="center">
                        <Text color={theme.textDim}>↑ {hiddenAbove} more nodes</Text>
                    </Box>
                )}

                {visibleNodes.map((node, i) => {
                    const actualIndex = scrollOffset + i;
                    return <NodeCard key={node.name} node={node} isSelected={actualIndex === selectedIndex} />;
                })}

                {hiddenBelow > 0 && (
                    <Box justifyContent="center" marginTop={1}>
                        <Text color={theme.textDim}>↓ {hiddenBelow} more nodes</Text>
                    </Box>
                )}
            </Box>
        </Border>
    );
}

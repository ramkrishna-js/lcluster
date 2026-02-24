import React from 'react';

export default function Tip({ children }) {
    return (
        <div style={{
            border: '1px solid #a6e3a1',
            borderLeft: '4px solid #a6e3a1',
            background: '#a6e3a111',
            borderRadius: 6,
            padding: '12px 16px',
            margin: '16px 0',
            fontSize: 14,
        }}>
            <strong style={{ color: '#a6e3a1' }}>✦ Tip</strong>
            <div style={{ marginTop: 6 }}>{children}</div>
        </div>
    )
}

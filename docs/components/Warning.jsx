import React from 'react';

export default function Warning({ children }) {
    return (
        <div style={{
            border: '1px solid #ff3366',
            borderLeft: '4px solid #ff3366',
            background: '#ff336611',
            borderRadius: 6,
            padding: '12px 16px',
            margin: '16px 0',
            fontSize: 14,
        }}>
            <strong style={{ color: '#ff3366' }}>⚠ Warning</strong>
            <div style={{ marginTop: 6 }}>{children}</div>
        </div>
    )
}

import React from 'react';

export default function Note({ children }) {
    return (
        <div style={{
            border: '1px solid #89b4fa',
            borderLeft: '4px solid #89b4fa',
            background: '#89b4fa11',
            borderRadius: 6,
            padding: '12px 16px',
            margin: '16px 0',
            fontSize: 14,
        }}>
            <strong style={{ color: '#89b4fa' }}>ℹ Note</strong>
            <div style={{ marginTop: 6 }}>{children}</div>
        </div>
    )
}

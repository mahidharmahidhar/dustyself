import React from 'react';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizes = {
    sm: { width: 32, height: 32, borderWidth: 2 },
    md: { width: 48, height: 48, borderWidth: 3 },
    lg: { width: 64, height: 64, borderWidth: 4 }
  }[size];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '32px'
      }}
    >
      {/* Spinner */}
      <div
        style={{
          width: `${sizes.width}px`,
          height: `${sizes.height}px`,
          borderRadius: '50%',
          border: `${sizes.borderWidth}px solid rgba(255, 99, 16, 0.2)`,
          borderTopColor: '#ff6310',
          animation: 'spin 0.8s linear infinite',
          boxShadow: '0 0 20px rgba(255, 99, 16, 0.1)'
        }}
      />

      {text && (
        <p
          style={{
            color: '#687279',
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '0.04em',
            margin: 0
          }}
        >
          {text}
        </p>
      )}
    </div>
  );
}

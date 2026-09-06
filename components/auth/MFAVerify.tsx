'use client';

import React, { useState } from 'react';

interface MFAVerifyProps {
  onVerify: (code: string) => Promise<boolean>;
  onUseBackupCode: (code: string) => Promise<boolean>;
  onCancel: () => void;
}

export function MFAVerify({ onVerify, onUseBackupCode, onCancel }: MFAVerifyProps) {
  const [code, setCode] = useState('');
  const [useBackup, setUseBackup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = useBackup
        ? await onUseBackupCode(code)
        : await onVerify(code);

      if (!success) {
        setError(useBackup ? 'Invalid backup code' : 'Invalid MFA code');
      }
    } catch {
      setError('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: 16,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 360,
        background: '#fff',
        borderRadius: 16,
        padding: 32,
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
            Two-Factor Authentication
          </h1>
          <p style={{ fontSize: 13, color: '#647985' }}>
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        {error && (
          <div style={{
            padding: '10px 12px',
            borderRadius: 8,
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: '#dc2626',
            fontSize: 13,
            marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
              {useBackup ? 'Backup Code' : 'MFA Code'}
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={useBackup ? 8 : 6}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                fontSize: 16,
                textAlign: 'center',
                letterSpacing: '0.4em',
                outline: 'none',
              }}
              placeholder={useBackup ? 'XXXXXXXX' : '000000'}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length === 0}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 8,
              background: '#0f172a',
              color: '#fff',
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button
            onClick={() => setUseBackup(!useBackup)}
            style={{
              background: 'none',
              border: 'none',
              color: '#0d9488',
              fontSize: 13,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {useBackup ? 'Use authenticator code' : 'Use a backup code'}
          </button>
        </div>

        <button
          onClick={onCancel}
          style={{
            display: 'block',
            margin: '16px auto 0',
            background: 'none',
            border: 'none',
            color: '#647985',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

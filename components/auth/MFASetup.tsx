'use client';

import React, { useState, useEffect } from 'react';
import { generateMFASecret, verifyTOTP, generateBackupCodes, generateQRCodeDataURL } from '@/lib/auth/mfa';

interface MFASetupProps {
  onComplete: (secret: string, backupCodes: string[]) => void;
  onCancel: () => void;
}

export function MFASetup({ onComplete, onCancel }: MFASetupProps) {
  const [step, setStep] = useState<'setup' | 'verify' | 'backup'>('setup');
  const [secret, setSecret] = useState('');
  const [otpauthUrl, setOtpauthUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [code, setCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const { secret, otpauthUrl } = generateMFASecret();
    setSecret(secret);
    setOtpauthUrl(otpauthUrl);
    generateQRCodeDataURL(otpauthUrl).then(setQrCode);
  }, []);

  const handleVerify = () => {
    if (verifyTOTP(secret, code)) {
      const codes = generateBackupCodes();
      setBackupCodes(codes);
      setStep('backup');
    } else {
      setError('Invalid code. Please try again.');
    }
  };

  return (
    <div style={{
      padding: 24,
      borderRadius: 12,
      border: '1px solid #e2e8f0',
      background: '#fff',
      maxWidth: 400,
      margin: '0 auto',
    }}>
      {step === 'setup' && (
        <>
          <h3 style={{ margin: '0 0 8px', fontSize: 16, color: '#0f172a' }}>Setup MFA</h3>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: '#647985' }}>
            Scan this QR code with your authenticator app
          </p>
          {qrCode && (
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <img src={qrCode} alt="MFA QR Code" style={{ width: 180, height: 180 }} />
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
              Or enter this secret manually:
            </label>
            <code style={{
              display: 'block',
              padding: '8px 12px',
              borderRadius: 6,
              background: '#f1f5f9',
              fontSize: 12,
              wordBreak: 'break-all',
              color: '#0f172a',
            }}>
              {secret}
            </code>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              maxLength={6}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                fontSize: 14,
                outline: 'none',
                textAlign: 'center',
                letterSpacing: '0.3em',
              }}
            />
            <button
              onClick={handleVerify}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                background: '#0f172a',
                color: '#fff',
                border: 'none',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Verify
            </button>
          </div>
          {error && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 8 }}>{error}</p>}
          <button onClick={onCancel} style={{ marginTop: 12, background: 'none', border: 'none', color: '#647985', cursor: 'pointer', fontSize: 13 }}>
            Cancel
          </button>
        </>
      )}

      {step === 'backup' && (
        <>
          <h3 style={{ margin: '0 0 8px', fontSize: 16, color: '#0f172a' }}>Save Backup Codes</h3>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: '#647985' }}>
            Store these codes in a safe place. Each can be used once if you lose access to your authenticator.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 8,
            padding: 12,
            borderRadius: 8,
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            marginBottom: 16,
          }}>
            {backupCodes.map((code, i) => (
              <code key={i} style={{ fontSize: 12, color: '#0f172a' }}>{code}</code>
            ))}
          </div>
          <button
            onClick={() => onComplete(secret, backupCodes)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: 8,
              background: '#0f172a',
              color: '#fff',
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            I've saved my codes
          </button>
        </>
      )}
    </div>
  );
}

import { generateSecret, generateURI, verifySync, generateSync } from 'otplib';
import QRCode from 'qrcode';
import type { MFASetupResponse } from './types';

export function generateMFASecret(): { secret: string; otpauthUrl: string } {
  const secret = generateSecret();
  const otpauthUrl = generateURI({
    secret,
    label: 'admin@clinic.demo',
    issuer: 'Dr. Ibrahim Clinic',
  });
  return { secret, otpauthUrl };
}

export function generateUserMFASecret(email: string, issuer: string = 'Dr. Ibrahim Clinic'): { secret: string; otpauthUrl: string } {
  const secret = generateSecret();
  const otpauthUrl = generateURI({ secret, label: email, issuer });
  return { secret, otpauthUrl };
}

export function verifyTOTP(secret: string, token: string): boolean {
  try {
    const result = verifySync({ secret, token });
    return result ? result.valid === true : false;
  } catch {
    return false;
  }
}

export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    codes.push(
      Array.from(bytes)
        .map((b: number) => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()
    );
  }
  return codes;
}

export async function generateQRCodeDataURL(otpauthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpauthUrl, { width: 200, margin: 1 });
}

export function generateMFASetupResponse(email: string): MFASetupResponse {
  const { secret, otpauthUrl } = generateUserMFASecret(email);
  const backupCodes = generateBackupCodes(10);
  return {
    secret,
    otpauthUrl,
    qrCodeDataUrl: '',
    backupCodes,
  };
}

export { generateSync };

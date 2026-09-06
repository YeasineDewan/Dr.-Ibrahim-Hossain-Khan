import bcrypt from 'bcryptjs';
import type { UserProfile } from './types';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePasswordStrength(password: string): { valid: boolean; score: number; feedback: string[] } {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('At least 8 characters');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include uppercase letters');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Include numbers');

  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push('Include special characters');

  return {
    valid: score >= 3,
    score,
    feedback: feedback.length > 0 ? feedback : ['Strong password'],
  };
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

export function sanitizeUser(user: UserProfile): Omit<UserProfile, 'permissions'> {
  const { permissions: _permissions, ...rest } = user;
  return rest;
}

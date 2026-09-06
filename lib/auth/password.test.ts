import { describe, it, expect } from 'vitest';
import { verifyPassword, validateEmail, validatePasswordStrength, hashPassword } from './password';

describe('Password Utils', () => {
  it('should validate email format', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('admin@clinic.demo')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('missing@domain')).toBe(false);
  });

  it('should validate password strength', () => {
    const weak = validatePasswordStrength('short');
    expect(weak.valid).toBe(false);
    expect(weak.score).toBeLessThan(3);

    const strong = validatePasswordStrength('SecurePass1!');
    expect(strong.valid).toBe(true);
    expect(strong.score).toBeGreaterThanOrEqual(3);
  });

  it('should hash and verify password', async () => {
    const password = 'MySecurePassword123!';
    const hash = await hashPassword(password);
    expect(hash).toBeTruthy();
    expect(hash).not.toBe(password);

    const valid = await verifyPassword(password, hash);
    expect(valid).toBe(true);

    const invalid = await verifyPassword('wrongpassword', hash);
    expect(invalid).toBe(false);
  });

  it('should reject empty password', async () => {
    const hash = await hashPassword('');
    const valid = await verifyPassword('', hash);
    expect(valid).toBe(true);
  });
});

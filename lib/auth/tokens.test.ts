import { describe, it, expect, vi } from 'vitest';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, generateTokens } from './tokens';
import type { UserProfile } from './types';

describe('JWT Tokens', () => {
  const mockUser: UserProfile = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    roles: ['Admin'],
    permissions: [],
    mfaEnabled: false,
    status: 'active',
    failedAttempts: 0,
  };

  it('should generate access token', () => {
    const token = generateAccessToken(mockUser);
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('should generate refresh token with jti', () => {
    const token = generateRefreshToken(mockUser, 'jti-123');
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
  });

  it('should verify valid access token', () => {
    const token = generateAccessToken(mockUser);
    const decoded = verifyAccessToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.sub).toBe('user-123');
    expect(decoded?.roles).toEqual(['Admin']);
  });

  it('should reject invalid access token', () => {
    const decoded = verifyAccessToken('invalid.token.here');
    expect(decoded).toBeNull();
  });

  it('should verify valid refresh token', () => {
    const token = generateRefreshToken(mockUser, 'jti-123');
    const decoded = verifyRefreshToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.sub).toBe('user-123');
    expect(decoded?.jti).toBe('jti-123');
  });

  it('should reject token with wrong type', () => {
    const accessToken = generateAccessToken(mockUser);
    const decoded = verifyRefreshToken(accessToken);
    expect(decoded).toBeNull();
  });

  it('should generate tokens pair', () => {
    const { tokens, jti } = generateTokens(mockUser);
    expect(tokens.accessToken).toBeTruthy();
    expect(tokens.refreshToken).toBeTruthy();
    expect(tokens.tokenType).toBe('Bearer');
    expect(tokens.expiresIn).toBe(900);
    expect(jti).toBeTruthy();
  });
});

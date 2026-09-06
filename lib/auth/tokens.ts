import jwt from 'jsonwebtoken';
import type { AuthTokens, UserProfile } from './types';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-in-production';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production';

const ACCESS_EXPIRY = '15m';
const REFRESH_EXPIRY = '7d';

export function generateAccessToken(user: UserProfile): string {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions,
    },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRY, issuer: 'clinic-admin' }
  );
}

export function generateRefreshToken(user: UserProfile, jti: string): string {
  return jwt.sign(
    {
      sub: user.id,
      jti,
      type: 'refresh',
    },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRY, issuer: 'clinic-admin' }
  );
}

export function verifyAccessToken(token: string): { sub: string; roles: string[]; permissions: { resource: string; action: string }[] } | null {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET, { issuer: 'clinic-admin' }) as any;
    return {
      sub: decoded.sub,
      roles: decoded.roles || [],
      permissions: decoded.permissions || [],
    };
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): { sub: string; jti: string } | null {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET, { issuer: 'clinic-admin' }) as any;
    if (decoded.type !== 'refresh') return null;
    return { sub: decoded.sub, jti: decoded.jti };
  } catch {
    return null;
  }
}

export function generateTokens(user: UserProfile): { tokens: AuthTokens; jti: string } {
  const jti = crypto.randomUUID();
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);
  return {
    tokens: {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60,
      tokenType: 'Bearer',
    },
    jti,
  };
}

export function getTokenExpiry(token: string): number | null {
  try {
    const decoded = jwt.decode(token) as any;
    if (decoded && decoded.exp) return decoded.exp * 1000;
    return null;
  } catch {
    return null;
  }
}

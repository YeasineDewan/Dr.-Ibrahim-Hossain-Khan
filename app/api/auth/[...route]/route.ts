import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, verifyRefreshToken, generateTokens } from '../../../../lib/auth/tokens';
import { hashPassword, verifyPassword, validateEmail, generateBackupCodes, sanitizeUser, validatePasswordStrength } from '../../../../lib/auth/password';
import { ROLES, ROLE_BY_LEGACY_NAME, getUserPermissions } from '../../../../lib/auth/rbac';
import type { UserProfile, LoginCredentials, MFASetupResponse } from '../../../../lib/auth/types';
import { TOTP, generateSecret, generateURI } from 'otplib';
import QRCode from 'qrcode';

const USERS_KEY = 'auth_users';
const SESSIONS_KEY = 'auth_sessions';
const BLACKLIST_KEY = 'auth_blacklist';

function getUsers(): UserProfile[] {
  if (typeof window === 'undefined') return [];
  const raw = sessionStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users: UserProfile[]) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSessions() {
  if (typeof window === 'undefined') return [];
  const raw = sessionStorage.getItem(SESSIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveSessions(sessions: any[]) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

function getBlacklist() {
  if (typeof window === 'undefined') return [];
  const raw = sessionStorage.getItem(BLACKLIST_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveBlacklist(blacklist: any[]) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(BLACKLIST_KEY, JSON.stringify(blacklist));
}

function seedDemoUser() {
  const users = getUsers();
  if (users.length === 0) {
    const demoUser: UserProfile = {
      id: 'user-demo-001',
      email: 'admin@clinic.demo',
      name: 'Dr. Ibrahim',
      roles: ['Admin'],
      permissions: [],
      mfaEnabled: false,
      status: 'active',
      failedAttempts: 0,
    };
    saveUsers([demoUser]);
  }
}

seedDemoUser();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body as { action: string };

  switch (action) {
    case 'login': {
      const { email, password, rememberMe, mfaCode } = body as LoginCredentials;
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
      }

      const users = getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      if (user.status === 'locked') {
        return NextResponse.json({ error: 'Account is locked. Contact administrator.' }, { status: 423 });
      }

      const valid = await verifyPassword(password, user.id + user.email);
      if (!valid) {
        user.failedAttempts += 1;
        if (user.failedAttempts >= 5) {
          user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
          user.status = 'locked';
        }
        saveUsers(users);
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      if (user.mfaEnabled) {
        if (!mfaCode) {
          return NextResponse.json({ error: 'MFA code required', mfaRequired: true }, { status: 200 });
        }
      }

      user.failedAttempts = 0;
      user.lastLogin = new Date().toISOString();
      saveUsers(users);

      const { tokens, jti } = generateTokens(user);
      const sessions = getSessions();
      sessions.push({
        id: jti,
        userId: user.id,
        device: 'Browser',
        ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: request.headers.get('user-agent') || 'Unknown',
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)).toISOString(),
      });
      saveSessions(sessions);

      const response = NextResponse.json({
        user: sanitizeUser(user),
        tokens,
        requiresMfa: user.mfaEnabled && !mfaCode,
      });
      response.cookies.set('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60,
      });
      response.cookies.set('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60,
      });

      return response;
    }

    case 'mfa-setup': {
      const mfaData: MFASetupResponse = {
        secret: 'DEMO_SECRET',
        otpauthUrl: 'otpauth://totp/Dr.Ibrahim Clinic?secret=DEMO_SECRET&issuer=Dr.Ibrahim',
        qrCodeDataUrl: '',
        backupCodes: generateBackupCodes(),
      };
      return NextResponse.json(mfaData);
    }

    case 'refresh': {
      const refreshToken = request.headers.get('x-refresh-token') || body.refreshToken;
      if (!refreshToken) {
        return NextResponse.json({ error: 'Refresh token required' }, { status: 401 });
      }

      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
      }

      const users = getUsers();
      const user = users.find(u => u.id === decoded.sub);
      if (!user || user.status !== 'active') {
        return NextResponse.json({ error: 'User not found or inactive' }, { status: 401 });
      }

      const { tokens, jti } = generateTokens(user);
      const sessions = getSessions();
      const sessionIndex = sessions.findIndex((s: { id: string }) => s.id === decoded.jti);
      if (sessionIndex >= 0) {
        sessions[sessionIndex].lastActive = new Date().toISOString();
        saveSessions(sessions);
      }

      const response = NextResponse.json({ tokens });
      response.cookies.set('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60,
      });
      return response;
    }

    case 'logout': {
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '');
      if (token) {
        const decoded = verifyAccessToken(token);
        if (decoded) {
          const blacklist = getBlacklist();
          blacklist.push({ sub: decoded.sub, exp: Date.now() + 15 * 60 * 1000 });
          saveBlacklist(blacklist);
        }
      }

      const response = NextResponse.json({ success: true });
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      return response;
    }

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const users = getUsers();
  const user = users.find(u => u.id === decoded.sub);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user: sanitizeUser(user) });
}

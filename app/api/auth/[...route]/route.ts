import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, verifyRefreshToken, generateTokens } from '../../../../lib/auth/tokens';
import { hashPassword, verifyPassword, validateEmail, sanitizeUser, validatePasswordStrength } from '../../../../lib/auth/password';
import { generateBackupCodes } from '../../../../lib/auth/mfa';
import { ROLES, ROLE_BY_LEGACY_NAME, getUserPermissions } from '../../../../lib/auth/rbac';
import type { UserProfile, LoginCredentials, MFASetupResponse } from '../../../../lib/auth/types';
import { TOTP, generateSecret, generateURI } from 'otplib';
import QRCode from 'qrcode';

declare global {
  var authUsers: UserProfile[] | undefined;
  var authSessions: any[] | undefined;
  var authBlacklist: any[] | undefined;
  var authCsrfTokens: Map<string, { createdAt: number }> | undefined;
}

function getUsers(): UserProfile[] {
  if (typeof globalThis.authUsers === 'undefined') {
    globalThis.authUsers = [];
  }
  return globalThis.authUsers;
}

function saveUsers(users: UserProfile[]) {
  globalThis.authUsers = users;
}

function getSessions() {
  if (typeof globalThis.authSessions === 'undefined') {
    globalThis.authSessions = [];
  }
  return globalThis.authSessions;
}

function saveSessions(sessions: any[]) {
  globalThis.authSessions = sessions;
}

function getBlacklist() {
  if (typeof globalThis.authBlacklist === 'undefined') {
    globalThis.authBlacklist = [];
  }
  return globalThis.authBlacklist;
}

function saveBlacklist(blacklist: any[]) {
  globalThis.authBlacklist = blacklist;
}

function getCsrfStore(): Map<string, { createdAt: number }> {
  if (typeof globalThis.authCsrfTokens === 'undefined') {
    globalThis.authCsrfTokens = new Map();
  }
  return globalThis.authCsrfTokens;
}

function generateCsrfToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function validateCsrfToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const store = getCsrfStore();
  const entry = store.get(token);
  if (!entry) return false;
  const age = Date.now() - entry.createdAt;
  if (age > 1000 * 60 * 60) {
    store.delete(token);
    return false;
  }
  return true;
}

function createCsrfCookie(token: string): NextResponse {
  const response = NextResponse.json({ csrfToken: token });
  response.cookies.set('csrf_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60,
    path: '/',
  });
  return response;
}

async function seedDemoUser() {
  const users = getUsers();
  if (users.length === 0) {
    const passwordHash = await hashPassword('admin123');
    const demoUser: UserProfile = {
      id: 'user-demo-001',
      email: 'admin@clinic.demo',
      name: 'Dr. Ibrahim',
      roles: ['admin'],
      permissions: getUserPermissions(['admin']),
      mfaEnabled: false,
      status: 'active',
      passwordHash,
      failedAttempts: 0,
    };
    saveUsers([demoUser]);
  }
}

seedDemoUser();

export async function GET(request: NextRequest) {
  const csrfToken = request.cookies.get('csrf_token')?.value;
  if (!validateCsrfToken(csrfToken)) {
    return NextResponse.json({ error: 'Invalid or missing CSRF token' }, { status: 403 });
  }

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

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') || '';
  let body: any = {};

  if (contentType.includes('application/json')) {
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
  } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await request.formData();
    body = Object.fromEntries(formData.entries());
  }

  const csrfToken = request.cookies.get('csrf_token')?.value;
  const { action } = body;

  const stateChangingActions = ['login', 'logout', 'mfa-setup', 'refresh', 'forgot-password', 'reset-password'];
  if (stateChangingActions.includes(action) && !validateCsrfToken(csrfToken)) {
    return NextResponse.json({ error: 'Invalid or missing CSRF token' }, { status: 403 });
  }

  if (action === 'csrf') {
    const token = generateCsrfToken();
    return createCsrfCookie(token);
  }

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

      const valid = await verifyPassword(password, user.passwordHash || '');
      if (!valid) {
        user.failedAttempts += 1;
        if (user.failedAttempts >= 5) {
          user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
          user.status = 'locked';
        }
        saveUsers(users);
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      if (user.mfaEnabled && !mfaCode) {
        return NextResponse.json({ error: 'MFA code required', mfaRequired: true }, { status: 200 });
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
      const email = body.email as string;
      const secret = generateSecret();
      const otpauthUrl = generateURI({ secret, label: email, issuer: 'Dr. Ibrahim Clinic' });
      const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl, { width: 200, margin: 1 });
      const backupCodes = generateBackupCodes(10);

      const mfaData: MFASetupResponse = {
        secret,
        otpauthUrl,
        qrCodeDataUrl,
        backupCodes,
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

      const sessions = getSessions();
      const sessionIndex = sessions.findIndex((s: { id: string }) => s.id === decoded.jti);
      if (sessionIndex >= 0) {
        sessions[sessionIndex].lastActive = new Date().toISOString();
        saveSessions(sessions);
      } else {
        return NextResponse.json({ error: 'Session not found' }, { status: 401 });
      }

      const users = getUsers();
      const user = users.find(u => u.id === decoded.sub);
      if (!user || user.status !== 'active') {
        return NextResponse.json({ error: 'User not found or inactive' }, { status: 401 });
      }

      const { tokens, jti } = generateTokens(user);
      const newSessions = getSessions();
      newSessions.push({
        id: jti,
        userId: user.id,
        device: 'Browser',
        ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: request.headers.get('user-agent') || 'Unknown',
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
      saveSessions(newSessions);

      const response = NextResponse.json({ tokens });
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
        maxAge: 7 * 24 * 60 * 60,
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

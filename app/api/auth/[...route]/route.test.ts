import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

function makeRequest(method: string, body: any = null, cookies: Record<string, string> = {}, headers: Record<string, string> = {}) {
  const url = 'http://localhost/api/auth';
  const init: RequestInit = { method, headers: new Headers(headers) };
  if (method === 'POST' && body !== null) {
    init.headers = new Headers({ ...headers, 'Content-Type': 'application/json' });
    init.body = JSON.stringify(body);
  }
  const req = new NextRequest(url, init);
  for (const [key, value] of Object.entries(cookies)) {
    req.cookies.set(key, value);
  }
  return req;
}

async function callPost(action: string, body: any = {}, csrfToken?: string, authHeader?: string) {
  const { POST } = await import('./route');
  const headers: Record<string, string> = {};
  if (authHeader) headers['Authorization'] = authHeader;
  const req = makeRequest('POST', { action, ...body }, csrfToken ? { csrf_token: csrfToken } : {}, headers);
  const res = await POST(req);
  const data = await res.json();
  return { response: res, data };
}

async function callGet(accessToken: string, csrfToken?: string) {
  const { GET } = await import('./route');
  const req = makeRequest('GET', null, csrfToken ? { csrf_token: csrfToken } : {}, { Authorization: `Bearer ${accessToken}` });
  const res = await GET(req);
  const data = await res.json();
  return { response: res, data };
}

describe('Auth API Routes', () => {
  beforeEach(async () => {
    const { hashPassword } = await import('../../../../lib/auth/password');
    const { getUserPermissions } = await import('../../../../lib/auth/rbac');

    (globalThis as any).authUsers = [{
      id: 'user-demo-001',
      email: 'admin@clinic.demo',
      name: 'Dr. Ibrahim',
      roles: ['admin'],
      permissions: getUserPermissions(['admin']),
      mfaEnabled: false,
      status: 'active',
      passwordHash: await hashPassword('admin123'),
      failedAttempts: 0,
    }];
    (globalThis as any).authSessions = [];
    (globalThis as any).authBlacklist = [];
    (globalThis as any).authCsrfTokens = new Map();
  });

  it('should generate CSRF token', async () => {
    const { response, data } = await callPost('csrf');
    expect(response.status).toBe(200);
    expect(data.csrfToken).toBeDefined();
    expect(typeof data.csrfToken).toBe('string');
    expect(data.csrfToken.length).toBeGreaterThan(0);
  });

  it('should reject login without CSRF token', async () => {
    const { response, data } = await callPost('login', {
      email: 'admin@clinic.demo',
      password: 'admin123',
    });
    expect(response.status).toBe(403);
    expect(data.error).toContain('CSRF');
  });

  it('should reject login with invalid credentials', async () => {
    const { data: csrfData } = await callPost('csrf');
    const csrfToken = csrfData.csrfToken;

    const { response, data } = await callPost('login', {
      email: 'admin@clinic.demo',
      password: 'wrongpassword',
    }, csrfToken);

    expect(response.status).toBe(401);
    expect(data.error).toContain('Invalid credentials');
  });

  it('should login with valid credentials and CSRF token', async () => {
    const { data: csrfData } = await callPost('csrf');
    const csrfToken = csrfData.csrfToken;

    const { response, data } = await callPost('login', {
      email: 'admin@clinic.demo',
      password: 'admin123',
    }, csrfToken);

    expect(response.status).toBe(200);
    expect(data.user).toBeDefined();
    expect(data.user.email).toBe('admin@clinic.demo');
    expect(data.tokens).toBeDefined();
    expect(data.tokens.accessToken).toBeDefined();
    expect(data.tokens.refreshToken).toBeDefined();
  });

  it('should lock account after multiple failed attempts', async () => {
    const { data: csrfData } = await callPost('csrf');
    const csrfToken = csrfData.csrfToken;

    for (let i = 0; i < 5; i++) {
      await callPost('login', {
        email: 'admin@clinic.demo',
        password: 'wrongpassword',
      }, csrfToken);
    }

    const { response, data } = await callPost('login', {
      email: 'admin@clinic.demo',
      password: 'admin123',
    }, csrfToken);

    expect(response.status).toBe(423);
    expect(data.error).toContain('locked');
  });

  it('should refresh access token with valid refresh token', async () => {
    const { data: csrfData } = await callPost('csrf');
    const csrfToken = csrfData.csrfToken;

    const { response: loginResponse, data: loginData } = await callPost('login', {
      email: 'admin@clinic.demo',
      password: 'admin123',
    }, csrfToken);

    expect(loginResponse.status).toBe(200);

    const refreshToken = loginData.tokens.refreshToken;
    const { response: refreshResponse, data: refreshData } = await callPost('refresh', {
      refreshToken,
    }, csrfToken);

    expect(refreshResponse.status).toBe(200);
    expect(refreshData.tokens).toBeDefined();
    expect(refreshData.tokens.accessToken).toBeDefined();
  });

  it('should logout and invalidate session', async () => {
    const { data: csrfData } = await callPost('csrf');
    const csrfToken = csrfData.csrfToken;

    const { response: loginResponse, data: loginData } = await callPost('login', {
      email: 'admin@clinic.demo',
      password: 'admin123',
    }, csrfToken);

    expect(loginResponse.status).toBe(200);

    const accessToken = loginData.tokens.accessToken;
    const { response: logoutResponse, data: logoutData } = await callPost('logout', {}, csrfToken, `Bearer ${accessToken}`);

    expect(logoutResponse.status).toBe(200);
    expect(logoutData.success).toBe(true);
  });

  it('should return user profile with valid token', async () => {
    const { data: csrfData } = await callPost('csrf');
    const csrfToken = csrfData.csrfToken;

    const { response: loginResponse, data: loginData } = await callPost('login', {
      email: 'admin@clinic.demo',
      password: 'admin123',
    }, csrfToken);

    expect(loginResponse.status).toBe(200);

    const accessToken = loginData.tokens.accessToken;
    const { response: profileResponse, data: profileData } = await callGet(accessToken, csrfToken);

    expect(profileResponse.status).toBe(200);
    expect(profileData.user).toBeDefined();
    expect(profileData.user.email).toBe('admin@clinic.demo');
  });
});
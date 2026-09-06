import { describe, it, expect, beforeEach } from 'vitest';

const API_URL = 'http://localhost:3000/api/auth/[...route]';

async function postAction(action: string, body: any = {}, csrfToken?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (csrfToken) {
    headers['Cookie'] = `csrf_token=${csrfToken}`;
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ action, ...body }),
  });

  const data = await response.json();
  return { response, data };
}

async function getAuth(token: string) {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return { response, data };
}

describe('Auth API Routes', () => {
  beforeEach(async () => {
    const { response } = await postAction('csrf');
    expect(response.status).toBe(200);
  });

  it('should generate CSRF token', async () => {
    const { response, data } = await postAction('csrf');
    expect(response.status).toBe(200);
    expect(data.csrfToken).toBeDefined();
    expect(typeof data.csrfToken).toBe('string');
    expect(data.csrfToken.length).toBeGreaterThan(0);
  });

  it('should reject login without CSRF token', async () => {
    const { response, data } = await postAction('login', {
      email: 'admin@clinic.demo',
      password: 'admin123',
    });
    expect(response.status).toBe(403);
    expect(data.error).toContain('CSRF');
  });

  it('should reject login with invalid credentials', async () => {
    const { response: csrfResponse, data: csrfData } = await postAction('csrf');
    const csrfToken = csrfData.csrfToken;

    const { response, data } = await postAction('login', {
      email: 'admin@clinic.demo',
      password: 'wrongpassword',
      csrfToken,
    });

    expect(response.status).toBe(401);
    expect(data.error).toContain('Invalid credentials');
  });

  it('should login with valid credentials and CSRF token', async () => {
    const { response: csrfResponse, data: csrfData } = await postAction('csrf');
    const csrfToken = csrfData.csrfToken;

    const { response, data } = await postAction('login', {
      email: 'admin@clinic.demo',
      password: 'admin123',
      csrfToken,
    });

    expect(response.status).toBe(200);
    expect(data.user).toBeDefined();
    expect(data.user.email).toBe('admin@clinic.demo');
    expect(data.tokens).toBeDefined();
    expect(data.tokens.accessToken).toBeDefined();
    expect(data.tokens.refreshToken).toBeDefined();
  });

  it('should lock account after multiple failed attempts', async () => {
    const { response: csrfResponse, data: csrfData } = await postAction('csrf');
    const csrfToken = csrfData.csrfToken;

    for (let i = 0; i < 5; i++) {
      await postAction('login', {
        email: 'admin@clinic.demo',
        password: 'wrongpassword',
        csrfToken,
      });
    }

    const { response, data } = await postAction('login', {
      email: 'admin@clinic.demo',
      password: 'admin123',
      csrfToken,
    });

    expect(response.status).toBe(423);
    expect(data.error).toContain('locked');
  });

  it('should refresh access token with valid refresh token', async () => {
    const { response: csrfResponse, data: csrfData } = await postAction('csrf');
    const csrfToken = csrfData.csrfToken;

    const { response: loginResponse, data: loginData } = await postAction('login', {
      email: 'admin@clinic.demo',
      password: 'admin123',
      csrfToken,
    });

    expect(loginResponse.status).toBe(200);

    const refreshToken = loginData.tokens.refreshToken;
    const { response: refreshResponse, data: refreshData } = await postAction('refresh', {
      refreshToken,
      csrfToken,
    });

    expect(refreshResponse.status).toBe(200);
    expect(refreshData.tokens).toBeDefined();
    expect(refreshData.tokens.accessToken).toBeDefined();
  });

  it('should logout and invalidate session', async () => {
    const { response: csrfResponse, data: csrfData } = await postAction('csrf');
    const csrfToken = csrfData.csrfToken;

    const { response: loginResponse, data: loginData } = await postAction('login', {
      email: 'admin@clinic.demo',
      password: 'admin123',
      csrfToken,
    });

    expect(loginResponse.status).toBe(200);

    const accessToken = loginData.tokens.accessToken;
    const { response: logoutResponse, data: logoutData } = await postAction('logout', {
      csrfToken,
    }, accessToken);

    expect(logoutResponse.status).toBe(200);
    expect(logoutData.success).toBe(true);
  });

  it('should return user profile with valid token', async () => {
    const { response: csrfResponse, data: csrfData } = await postAction('csrf');
    const csrfToken = csrfData.csrfToken;

    const { response: loginResponse, data: loginData } = await postAction('login', {
      email: 'admin@clinic.demo',
      password: 'admin123',
      csrfToken,
    });

    expect(loginResponse.status).toBe(200);

    const accessToken = loginData.tokens.accessToken;
    const { response: profileResponse, data: profileData } = await getAuth(accessToken);

    expect(profileResponse.status).toBe(200);
    expect(profileData.user).toBeDefined();
    expect(profileData.user.email).toBe('admin@clinic.demo');
  });
});

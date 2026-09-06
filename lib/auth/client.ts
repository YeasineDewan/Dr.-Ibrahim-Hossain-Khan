import { useState, useEffect, useCallback, useRef } from 'react';
import type { UserProfile, AuthTokens } from './types';

const AUTH_USER_KEY = 'auth_user';
const AUTH_TOKENS_KEY = 'auth_tokens';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_USER_KEY);
      const storedTokens = localStorage.getItem(AUTH_TOKENS_KEY);
      if (storedUser && storedTokens) {
        setUser(JSON.parse(storedUser));
        setTokens(JSON.parse(storedTokens));
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    const response = await fetch('/api/auth/[...route]', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password, rememberMe }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    if (data.requiresMfa) return { requiresMfa: true };
    setUser(data.user);
    setTokens(data.tokens);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    localStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(data.tokens));
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    const token = tokens?.accessToken;
    if (token) {
      await fetch('/api/auth/[...route]', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'logout' }),
      });
    }
    setUser(null);
    setTokens(null);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKENS_KEY);
  }, [tokens]);

  const refreshTokens = useCallback(async () => {
    if (!tokens?.refreshToken) return false;
    try {
      const response = await fetch('/api/auth/[...route]', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-refresh-token': tokens.refreshToken,
        },
        body: JSON.stringify({ action: 'refresh' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setTokens(data.tokens);
      localStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(data.tokens));
      return true;
    } catch {
      logout();
      return false;
    }
  }, [tokens, logout]);

  const isAuthenticated = !!user && !!tokens;

  return {
    user,
    tokens,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshTokens,
  };
}

export function usePasswordValidation() {
  return {
    validateEmail: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    validatePasswordStrength: (password: string) => {
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
      return { valid: score >= 3, score, feedback: feedback.length > 0 ? feedback : ['Strong password'] };
    },
    verifyPassword: async (password: string, hash: string) => {
      const bcrypt = await import('bcryptjs');
      return bcrypt.compare(password, hash);
    },
  };
}

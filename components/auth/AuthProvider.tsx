'use client';

import React, { useState, createContext, useContext, useCallback, useEffect } from 'react';
import type { UserProfile, AuthTokens } from '@/lib/auth/types';

interface AuthContextValue {
  user: UserProfile | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success?: boolean; requiresMfa?: boolean }>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('auth_user');
      const storedTokens = localStorage.getItem('auth_tokens');
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
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    if (data.requiresMfa) {
      return { requiresMfa: true };
    }

    setUser(data.user);
    setTokens(data.tokens);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    localStorage.setItem('auth_tokens', JSON.stringify(data.tokens));
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    if (tokens?.accessToken) {
      await fetch('/api/auth/[...route]', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        body: JSON.stringify({ action: 'logout' }),
      });
    }
    setUser(null);
    setTokens(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_tokens');
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
      localStorage.setItem('auth_tokens', JSON.stringify(data.tokens));
      return true;
    } catch {
      logout();
      return false;
    }
  }, [tokens, logout]);

  return (
    <AuthContext.Provider value={{ user, tokens, isAuthenticated: !!user && !!tokens, loading, login, logout, refreshTokens }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

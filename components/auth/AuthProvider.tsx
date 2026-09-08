'use client';

import React, { useState, createContext, useContext, useCallback, useEffect, useMemo } from 'react';
import type { UserProfile, AuthTokens } from '@/lib/auth/types';
import { createClient } from '@/utils/supabase/client';

interface AuthContextValue {
  user: UserProfile | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success?: boolean; requiresMfa?: boolean }>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  reinitialize: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function profileFromUser(user: { id: string; email?: string | undefined; user_metadata?: Record<string, unknown>; app_metadata?: Record<string, unknown> }): UserProfile {
  const metadata = user.user_metadata ?? {};
  const appMetadata = user.app_metadata ?? {};
  const role = typeof appMetadata.role === 'string' ? appMetadata.role : 'patient';
  const roles = Array.isArray(appMetadata.roles) ? appMetadata.roles.filter((item): item is string => typeof item === 'string') : [role];
  return {
    id: user.id,
    email: user.email ?? '',
    name: typeof metadata.full_name === 'string' ? metadata.full_name : user.email?.split('@')[0] ?? 'Patient',
    roles,
    permissions: roles.some(item => item === 'admin' || item === 'doctor') ? [{ resource: '*', action: 'admin' }] : [{ resource: 'appointments', action: 'read' }],
    mfaEnabled: false,
    status: 'active',
    lastLogin: new Date().toISOString(),
    failedAttempts: 0,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((session: { access_token: string; refresh_token: string; expires_in?: number; user: Parameters<typeof profileFromUser>[0] } | null) => {
    if (!session) {
      setUser(null);
      setTokens(null);
      return;
    }
    setUser(profileFromUser(session.user));
    setTokens({ accessToken: session.access_token, refreshToken: session.refresh_token, expiresIn: session.expires_in ?? 3600, tokenType: 'Bearer' });
  }, []);

  const reinitialize = useCallback(() => {
    setLoading(true);
    void supabase.auth.getSession().then(({ data }) => applySession(data.session as Parameters<typeof applySession>[0])).finally(() => setLoading(false));
  }, [applySession, supabase]);

  useEffect(() => {
    reinitialize();
    const { data } = supabase.auth.onAuthStateChange((_event, session) => applySession(session as Parameters<typeof applySession>[0]));
    return () => data.subscription.unsubscribe();
  }, [applySession, reinitialize, supabase]);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw new Error(error.message.toLowerCase().includes('invalid') ? 'Invalid email or password' : error.message);
    applySession(data.session as Parameters<typeof applySession>[0]);
    return { success: true };
  }, [applySession, supabase]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTokens(null);
  }, [supabase]);

  const refreshTokens = useCallback(async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error || !data.session) {
      await logout();
      return false;
    }
    applySession(data.session as Parameters<typeof applySession>[0]);
    return true;
  }, [applySession, logout, supabase]);

  return <AuthContext.Provider value={{ user, tokens, isAuthenticated: !!user && !!tokens, loading, login, logout, refreshTokens, reinitialize }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

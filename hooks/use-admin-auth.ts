'use client';

import { useEffect, useState } from 'react';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

interface UseAdminAuthReturn {
  user: AdminUser | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const STORAGE_KEY = 'dr_ibrahim_admin_auth';

function getStoredAuth(): { user: AdminUser; accessToken: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

function storeAuth(data: { user: AdminUser; accessToken: string }): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clearStoredAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored?.user) {
      setUser(stored.user);
    }
    setLoading(false);
  }, []);

  const isAdmin = user?.roles?.includes('admin') || user?.roles?.includes('super-admin') || false;

  const signIn = async (email: string, password: string) => {
    try {
      // Step 1: Get CSRF token (API sets csrf_token cookie)
      const csrfRes = await fetch('/api/auth/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'csrf' }),
      });

      if (!csrfRes.ok) {
        const err = await csrfRes.json();
        console.error('[signIn] CSRF request failed:', err);
        return { error: { message: err.error || 'CSRF token request failed' } };
      }

      // Step 2: Authenticate with credentials (cookie is auto-sent via credentials: 'include')
      const loginRes = await fetch('/api/auth/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'login', email, password }),
      });

      const data = await loginRes.json();

      if (!loginRes.ok || data.error) {
        console.error('[signIn] Login failed:', data);
        return { error: { message: data.error || `HTTP ${loginRes.status}` } };
      }

      if (data.requiresMfa) {
        return { error: { message: 'MFA code required', mfaRequired: true } };
      }

      // Store user data for session persistence + token for API calls
      const userData: AdminUser = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        roles: data.user.roles || [],
      };

      storeAuth({ user: userData, accessToken: data.tokens.accessToken });
      setUser(userData);

      // Notify any listeners that auth state changed (for cross-tab sync)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, bubbles: false, cancelable: false }));
      }

      return { error: null };
    } catch (error: any) {
      console.error('[signIn] Caught error:', error);
      return { error: { message: error.message || 'Login failed' } };
    }
  };

  const signOut = async () => {
    const stored = getStoredAuth();
    if (stored?.accessToken) {
      try {
        await fetch('/api/auth/route', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${stored.accessToken}`,
          },
          credentials: 'include',
          body: JSON.stringify({ action: 'logout' }),
        });
      } catch {
        // Ignore network errors on logout
      }
    }
    clearStoredAuth();
    setUser(null);
  };

  return { user, loading, isAdmin, signIn, signOut };
}

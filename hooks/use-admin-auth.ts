'use client';

import { createClient } from '@/utils/supabase/client';
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
    const supabase = createClient();
    let active = true;

    const loadAdminSession = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!active) return;
      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', authUser.id)
        .maybeSingle();
      const metadataRole = authUser.user_metadata?.role;
      const role = profile?.role || metadataRole;

      if (!active) return;
      if (role === 'admin' || role === 'doctor' || role === 'super-admin') {
        setUser({
          id: authUser.id,
          email: authUser.email ?? '',
          name: profile?.full_name || authUser.user_metadata?.name || 'Doctor',
          roles: [role],
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    loadAdminSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadAdminSession();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = Boolean(
    user?.roles?.some(role => ['admin', 'doctor', 'super-admin'].includes(role))
  );

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error || !data.user) {
        return { error: { message: error?.message || 'Invalid email or password' } };
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', data.user.id)
        .maybeSingle();
      const role = profile?.role || data.user.user_metadata?.role;

      if (profileError && !data.user.user_metadata?.role) {
        return { error: { message: 'Unable to verify admin access. Please try again.' } };
      }
      if (!role || !['admin', 'doctor', 'super-admin'].includes(role)) {
        await supabase.auth.signOut();
        return { error: { message: 'This account does not have doctor admin access.' } };
      }

      const userData: AdminUser = {
        id: data.user.id,
        email: data.user.email ?? email,
        name: profile?.full_name || data.user.user_metadata?.name || 'Doctor',
        roles: [role],
      };
      setUser(userData);
      return { error: null };
    } catch (error) {
      return { error: { message: error instanceof Error ? error.message : 'Login failed' } };
    }
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearStoredAuth();
    setUser(null);
  };

  return { user, loading, isAdmin, signIn, signOut };
}

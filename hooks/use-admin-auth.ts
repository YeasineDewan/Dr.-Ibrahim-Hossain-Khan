'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
}

interface UseAdminAuthReturn {
  user: AdminUser | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('email', authUser.email)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              name: profile.name,
              roles: profile.roles || [],
              permissions: profile.permissions || [],
            });
          }
        }
      } catch (error) {
        console.error('Error fetching admin user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              name: profile.name,
              roles: profile.roles || [],
              permissions: profile.permissions || [],
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = user?.roles?.includes('admin') || user?.roles?.includes('super-admin') || false;

  const signIn = async (email: string, password: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    if (data.user) {
      let profile = null;
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('email', data.user.email)
        .single();
      profile = profileData;

      // Fall back to auth user metadata if no profile row exists
      const fallback: AdminUser = {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || data.user.email!,
        roles: profile?.roles || data.user.user_metadata?.roles || [],
        permissions: profile?.permissions || data.user.user_metadata?.permissions || [],
      };

      setUser(fallback);
    }

    return { error: null };
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  };

  return {
    user,
    loading,
    isAdmin,
    signIn,
    signOut,
  };
}

import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export interface AdminAuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    roles: string[];
  };
  error?: string;
  status?: number;
}

export async function requireAdminAuth(): Promise<AdminAuthResult> {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return {
        success: false,
        error: 'Unauthorized - no active session',
        status: 401,
      };
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, email, name, roles')
      .eq('email', session.user.email)
      .single();

    if (profileError || !profile) {
      return {
        success: false,
        error: 'User profile not found',
        status: 403,
      };
    }

    const roles = profile.roles || [];
    const isAdmin = roles.includes('admin') || roles.includes('super-admin');

    if (!isAdmin) {
      return {
        success: false,
        error: 'Forbidden - admin access required',
        status: 403,
      };
    }

    return {
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        roles,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: 'Authentication error',
      status: 500,
    };
  }
}

export async function requireAnyRole(allowedRoles: string[]): Promise<AdminAuthResult> {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return {
        success: false,
        error: 'Unauthorized - no active session',
        status: 401,
      };
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, email, name, roles')
      .eq('email', session.user.email)
      .single();

    if (profileError || !profile) {
      return {
        success: false,
        error: 'User profile not found',
        status: 403,
      };
    }

    const roles = profile.roles || [];
    const hasRole = allowedRoles.some(role => roles.includes(role));

    if (!hasRole) {
      return {
        success: false,
        error: `Forbidden - requires one of: ${allowedRoles.join(', ')}`,
        status: 403,
      };
    }

    return {
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        roles,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: 'Authentication error',
      status: 500,
    };
  }
}

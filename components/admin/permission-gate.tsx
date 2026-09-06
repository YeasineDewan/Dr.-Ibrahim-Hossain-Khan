'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';
import {
  getUserPermissions,
  isSuperUser,
  type PermissionCheck,
  type Resource,
  type PermissionAction,
} from '@/lib/auth/rbac';
import type { UserProfile } from '@/lib/auth/types';

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: PermissionCheck[];
  login: (email: string, password: string, mfaCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  requestMfaSetup: () => Promise<void>;
  verifyMfa: (code: string) => Promise<void>;
  disableMfa: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: UserProfile | null;
}) {
  const [user, setUser] = useState<UserProfile | null>(initialUser);
  const [permissions, setPermissions] = useState<PermissionCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setPermissions(getUserPermissions(user));
    } else {
      setPermissions([]);
    }
    setIsLoading(false);
  }, [user]);

  const login = async (email: string, password: string, mfaCode?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/[...route]', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password, mfaCode }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.requiresMfa) {
        throw new Error('MFA_REQUIRED');
      }

      const userProfile: UserProfile = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        roles: data.user.roles || [],
        permissions: getUserPermissions(data.user),
        mfaEnabled: data.user.mfaEnabled || false,
        status: 'active',
        failedAttempts: 0,
      };

      setUser(userProfile);
      setPermissions(getUserPermissions(userProfile));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/[...route]', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
    } catch {
      // ignore
    }
    setUser(null);
    setPermissions([]);
  };

  const requestMfaSetup = async () => {
    if (!user?.email) return;
    const response = await fetch('/api/auth/[...route]', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mfa-setup', email: user.email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
  };

  const verifyMfa = async (code: string) => {
    if (!user) return;
    const response = await fetch('/api/auth/[...route]', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify-mfa', code, userId: user.id }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    setUser({ ...user, mfaEnabled: true });
  };

  const disableMfa = async () => {
    if (!user) return;
    const response = await fetch('/api/auth/[...route]', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'disable-mfa', userId: user.id }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    setUser({ ...user, mfaEnabled: false });
  };

  const refreshSession = async () => {
    try {
      const response = await fetch('/api/auth/[...route]', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh' }),
        credentials: 'include',
      });
      if (!response.ok) return false;
      const data = await response.json();
      if (data.user) {
        const userProfile: UserProfile = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          roles: data.user.roles || [],
          permissions: getUserPermissions(data.user),
          mfaEnabled: data.user.mfaEnabled || false,
          status: 'active',
          failedAttempts: 0,
        };
        setUser(userProfile);
        setPermissions(getUserPermissions(userProfile));
      }
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        permissions,
        login,
        logout,
        requestMfaSetup,
        verifyMfa,
        disableMfa,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function usePermission(resource: Resource, action: PermissionAction = 'read'): boolean {
  const { permissions, user } = useAuth();

  if (user && isSuperUser(user)) return true;

  return permissions.some(
    (p) => p.resource === '*' || (p.resource === resource && p.action === action)
  );
}

export function usePermissions(): PermissionCheck[] {
  const { permissions } = useAuth();
  return permissions;
}

export function useHasAnyPermission(checks: PermissionCheck[]): boolean {
  const { permissions, user } = useAuth();

  if (user && isSuperUser(user)) return true;

  return checks.some((c) =>
    permissions.some((p) => p.resource === '*' || (p.resource === c.resource && p.action === c.action))
  );
}

export function useHasAllPermissions(checks: PermissionCheck[]): boolean {
  const { permissions, user } = useAuth();

  if (user && isSuperUser(user)) return true;

  return checks.every((c) =>
    permissions.some((p) => p.resource === '*' || (p.resource === c.resource && p.action === c.action))
  );
}

export function Can({
  resource,
  action,
  fallback = null,
  children,
}: {
  resource: Resource;
  action: PermissionAction;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const hasPermission = usePermission(resource, action);
  if (hasPermission) return <>{children}</>;
  return <>{fallback}</>;
}

export function Cannot({
  resource,
  action,
  children,
}: {
  resource: Resource;
  action: PermissionAction;
  children: React.ReactNode;
}) {
  const hasPermission = usePermission(resource, action);
  if (!hasPermission) return <>{children}</>;
  return null;
}

export function RoleGate({ requiredRoles, children }: { requiredRoles: string[]; children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user || !requiredRoles.some((r) => user.roles?.includes(r))) {
    return null;
  }
  return <>{children}</>;
}

export function AnyPermissionGate({
  checks,
  fallback = null,
  children,
}: {
  checks: PermissionCheck[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const hasPermission = useHasAnyPermission(checks);
  if (hasPermission) return <>{children}</>;
  return <>{fallback}</>;
}

export function AllPermissionGate({
  checks,
  fallback = null,
  children,
}: {
  checks: PermissionCheck[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const hasPermission = useHasAllPermissions(checks);
  if (hasPermission) return <>{children}</>;
  return <>{fallback}</>;
}

export function PermissionDenied({ message = 'Insufficient permissions' }: { message?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 24,
        color: '#dc2626',
      }}
    >
      <ShieldCheck size={32} />
      <span style={{ fontSize: 14, fontWeight: 600 }}>{message}</span>
    </div>
  );
}

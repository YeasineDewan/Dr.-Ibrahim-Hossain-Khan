'use client';

import React, { createContext, useContext, useMemo, useCallback } from 'react';
import type { Permission } from './types';

export type PermissionAction = 'read' | 'write' | 'admin' | 'delete';

const ROLE_HIERARCHY: Record<string, { permissions: Permission[]; inherits?: string[] }> = {
  SuperAdmin: {
    permissions: [{ resource: '*', action: 'admin' }],
  },
  Admin: {
    permissions: [
      { resource: 'dashboard', action: 'read' },
      { resource: 'appointments', action: 'write' },
      { resource: 'patients', action: 'write' },
      { resource: 'prescriptions', action: 'write' },
      { resource: 'reports', action: 'read' },
      { resource: 'settings', action: 'admin' },
      { resource: 'users', action: 'write' },
    ],
    inherits: ['Physician', 'Receptionist'],
  },
  Physician: {
    permissions: [
      { resource: 'dashboard', action: 'read' },
      { resource: 'appointments', action: 'read' },
      { resource: 'patients', action: 'read' },
      { resource: 'prescriptions', action: 'write' },
      { resource: 'follow-ups', action: 'read' },
    ],
    inherits: ['Viewer'],
  },
  Receptionist: {
    permissions: [
      { resource: 'dashboard', action: 'read' },
      { resource: 'appointments', action: 'write' },
      { resource: 'patients', action: 'read' },
      { resource: 'notifications', action: 'read' },
    ],
    inherits: ['Viewer'],
  },
  Viewer: {
    permissions: [
      { resource: 'dashboard', action: 'read' },
    ],
  },
};

interface PermissionContextValue {
  roles: string[];
  permissions: Permission[];
  hasPermission: (resource: string, action: PermissionAction) => boolean;
  hasAnyPermission: (checks: { resource: string; action: PermissionAction }[]) => boolean;
}

const PermissionContext = createContext<PermissionContextValue | null>(null);

function resolvePermissions(roles: string[]): Permission[] {
  const resolved = new Map<string, Permission>();
  const seen = new Set<string>();

  function addRole(roleName: string) {
    if (seen.has(roleName)) return;
    seen.add(roleName);

    const role = ROLE_HIERARCHY[roleName];
    if (!role) return;

    if (role.inherits) {
      role.inherits.forEach(addRole);
    }

    for (const perm of role.permissions) {
      const key = `${perm.resource}:${perm.action}`;
      if (perm.resource === '*') {
        resolved.set('*:admin', perm);
      } else {
        resolved.set(key, perm);
      }
    }
  }

  for (const role of roles) {
    addRole(role);
  }

  return Array.from(resolved.values());
}

export function PermissionProvider({
  roles = ['Viewer'],
  children,
}: {
  roles?: string[];
  children: React.ReactNode;
}) {
  const permissions = useMemo(() => resolvePermissions(roles), [roles]);

  const hasPermission = useCallback(
    (resource: string, action: PermissionAction) => {
      if (permissions.some((p) => p.resource === '*' && p.action === 'admin')) return true;
      return permissions.some((p) => p.resource === resource && p.action === action);
    },
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (checks: { resource: string; action: PermissionAction }[]) => {
      return checks.some((c) => hasPermission(c.resource, c.action));
    },
    [hasPermission]
  );

  const value = useMemo(
    () => ({
      roles,
      permissions,
      hasPermission,
      hasAnyPermission,
    }),
    [roles, permissions, hasPermission, hasAnyPermission]
  );

  return (
    <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>
  );
}

export function usePermissions() {
  const ctx = useContext(PermissionContext);
  if (!ctx) throw new Error('usePermissions must be used within PermissionProvider');
  return ctx;
}

interface CanProps {
  resource: string;
  action: PermissionAction;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Can({ resource, action, fallback = null, children }: CanProps) {
  const { hasPermission } = usePermissions();
  if (hasPermission(resource, action)) return <>{children}</>;
  return <>{fallback}</>;
}

interface CanNotProps {
  resource: string;
  action: PermissionAction;
  children: React.ReactNode;
}

export function CanNot({ resource, action, children }: CanNotProps) {
  const { hasPermission } = usePermissions();
  if (!hasPermission(resource, action)) return <>{children}</>;
  return null;
}

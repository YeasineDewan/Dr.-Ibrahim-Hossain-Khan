'use client';

import React from 'react';
import { usePermission, useAuth } from '../admin/permission-gate';

interface AdminGuardProps {
  resource: string;
  action: 'read' | 'write' | 'admin' | 'delete';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminGuard({ resource, action, children, fallback }: AdminGuardProps) {
  const hasPermission = usePermission(resource, action);

  if (!hasPermission) {
    if (fallback) return <>{fallback}</>;
    return (
      <div style={{
        padding: 16,
        borderRadius: 8,
        background: 'rgba(239,68,68,0.04)',
        border: '1px solid rgba(239,68,68,0.15)',
        color: '#dc2626',
        fontSize: 13,
        textAlign: 'center',
      }}>
        Insufficient permissions to access this resource
      </div>
    );
  }

  return <>{children}</>;
}

interface AdminSectionProps {
  requiredRoles?: string[];
  children: React.ReactNode;
}

export function AdminSection({ requiredRoles, children }: AdminSectionProps) {
  const { user } = useAuth();

  if (requiredRoles && user && !requiredRoles.some((r) => user.roles?.includes(r))) {
    return null;
  }

  return <>{children}</>;
}

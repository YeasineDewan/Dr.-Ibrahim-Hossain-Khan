import { describe, it, expect } from 'vitest';
import { hasPermission, hasAnyPermission, hasAllPermissions, getUserPermissions, isSuperUser, filterNavigableItems } from './rbac';
import type { UserProfile } from './types';

describe('RBAC', () => {
  const adminUser: UserProfile = {
    id: 'admin-1',
    email: 'admin@example.com',
    name: 'Admin User',
    roles: ['admin'],
    permissions: [],
    mfaEnabled: false,
    status: 'active',
    failedAttempts: 0,
  };

  const physicianUser: UserProfile = {
    id: 'physician-1',
    email: 'physician@example.com',
    name: 'Dr. Smith',
    roles: ['physician'],
    permissions: [],
    mfaEnabled: false,
    status: 'active',
    failedAttempts: 0,
  };

  const viewerUser: UserProfile = {
    id: 'viewer-1',
    email: 'viewer@example.com',
    name: 'Viewer User',
    roles: ['viewer'],
    permissions: [],
    mfaEnabled: false,
    status: 'active',
    failedAttempts: 0,
  };

  it('should identify super user', () => {
    expect(isSuperUser(adminUser)).toBe(true);
    expect(isSuperUser(physicianUser)).toBe(false);
    expect(isSuperUser(viewerUser)).toBe(false);
  });

  it('should grant admin all permissions', () => {
    expect(hasPermission(adminUser, 'any-resource', 'any-action')).toBe(true);
  });

  it('should grant physician read access to dashboard', () => {
    expect(hasPermission(physicianUser, 'dashboard', 'read')).toBe(true);
  });

  it('should deny physician write access to appointments', () => {
    expect(hasPermission(physicianUser, 'appointments', 'write')).toBe(false);
  });

  it('should grant viewer read access to dashboard', () => {
    expect(hasPermission(viewerUser, 'dashboard', 'read')).toBe(true);
  });

  it('should deny viewer access to other resources', () => {
    expect(hasPermission(viewerUser, 'appointments', 'read')).toBe(false);
    expect(hasPermission(viewerUser, 'patients', 'read')).toBe(false);
  });

  it('should check any permission', () => {
    expect(hasAnyPermission(physicianUser, [
      { resource: 'dashboard', action: 'read' },
      { resource: 'appointments', action: 'write' },
    ])).toBe(true);

    expect(hasAnyPermission(physicianUser, [
      { resource: 'appointments', action: 'write' },
      { resource: 'patients', action: 'write' },
    ])).toBe(false);
  });

  it('should check all permissions', () => {
    expect(hasAllPermissions(physicianUser, [
      { resource: 'dashboard', action: 'read' },
      { resource: 'appointments', action: 'read' },
    ])).toBe(true);

    expect(hasAllPermissions(physicianUser, [
      { resource: 'dashboard', action: 'read' },
      { resource: 'appointments', action: 'write' },
    ])).toBe(false);
  });

  it('should return permissions for user roles', () => {
    const adminPerms = getUserPermissions(adminUser);
    expect(adminPerms.some((p) => p.resource === 'dashboard' && p.action === 'read')).toBe(true);
    expect(adminPerms.some((p) => p.resource === 'appointments' && p.action === 'write')).toBe(true);

    const physicianPerms = getUserPermissions(physicianUser);
    expect(physicianPerms.some((p) => p.resource === 'dashboard' && p.action === 'read')).toBe(true);
    expect(physicianPerms.some((p) => p.resource === 'prescriptions' && p.action === 'write')).toBe(true);
  });

  it('should filter navigable items based on permissions', () => {
    const items = ['Dashboard', 'Appointments', 'Patients', 'Settings'];
    const filtered = filterNavigableItems(items, physicianUser);
    expect(filtered).toContain('Dashboard');
    expect(filtered).toContain('Appointments');
    expect(filtered).not.toContain('Settings');
  });

  it('should return all items for super user', () => {
    const items = ['Dashboard', 'Appointments', 'Patients', 'Settings'];
    const filtered = filterNavigableItems(items, adminUser);
    expect(filtered).toEqual(items);
  });
});

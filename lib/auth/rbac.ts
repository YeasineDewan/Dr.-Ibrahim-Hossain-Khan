import type { Permission, PermissionAction, UserProfile } from './types';

export type { PermissionAction, Permission };
export type PermissionCheck = Permission;
export type Resource = string;

export interface RoleDefinition {
  id: string;
  name: string;
  nameBn?: string;
  description?: string;
  permissions: Permission[];
  inherits?: string[];
}

export const ROLES: Record<string, RoleDefinition> = {
  'super-admin': {
    id: 'super-admin',
    name: 'Super Admin',
    permissions: [{ resource: '*', action: 'admin' }],
  },
  admin: {
    id: 'admin',
    name: 'Admin',
    permissions: [
      { resource: 'dashboard', action: 'read' },
      { resource: 'analytics', action: 'read' },
      { resource: 'audit', action: 'read' },
      { resource: 'appointments', action: 'write' },
      { resource: 'calendar', action: 'write' },
      { resource: 'patients', action: 'write' },
      { resource: 'prescriptions', action: 'write' },
      { resource: 'followups', action: 'read' },
      { resource: 'chambers', action: 'read' },
      { resource: 'services', action: 'admin' },
      { resource: 'gallery', action: 'admin' },
      { resource: 'videos', action: 'admin' },
      { resource: 'reviews', action: 'admin' },
      { resource: 'reports', action: 'read' },
      { resource: 'notifications', action: 'read' },
      { resource: 'users', action: 'admin' },
      { resource: 'settings', action: 'admin' },
    ],
    inherits: ['physician', 'front-desk'],
  },
  physician: {
    id: 'physician',
    name: 'Physician',
    permissions: [
      { resource: 'dashboard', action: 'read' },
      { resource: 'analytics', action: 'read' },
      { resource: 'appointments', action: 'read' },
      { resource: 'calendar', action: 'read' },
      { resource: 'patients', action: 'read' },
      { resource: 'prescriptions', action: 'write' },
      { resource: 'followups', action: 'read' },
      { resource: 'reports', action: 'read' },
    ],
    inherits: ['viewer'],
  },
  'front-desk': {
    id: 'front-desk',
    name: 'Front Desk',
    permissions: [
      { resource: 'dashboard', action: 'read' },
      { resource: 'appointments', action: 'write' },
      { resource: 'calendar', action: 'write' },
      { resource: 'patients', action: 'read' },
      { resource: 'notifications', action: 'read' },
    ],
    inherits: ['viewer'],
  },
  nurse: {
    id: 'nurse',
    name: 'Nurse',
    permissions: [
      { resource: 'dashboard', action: 'read' },
      { resource: 'appointments', action: 'read' },
      { resource: 'patients', action: 'read' },
      { resource: 'notifications', action: 'read' },
    ],
    inherits: ['viewer'],
  },
  pharmacist: {
    id: 'pharmacist',
    name: 'Pharmacist',
    permissions: [
      { resource: 'dashboard', action: 'read' },
      { resource: 'prescriptions', action: 'read' },
      { resource: 'patients', action: 'read' },
    ],
    inherits: ['viewer'],
  },
  manager: {
    id: 'manager',
    name: 'Manager',
    permissions: [
      { resource: 'dashboard', action: 'read' },
      { resource: 'analytics', action: 'read' },
      { resource: 'reports', action: 'read' },
      { resource: 'settings', action: 'read' },
      { resource: 'users', action: 'read' },
    ],
    inherits: ['viewer'],
  },
  viewer: {
    id: 'viewer',
    name: 'Viewer',
    permissions: [
      { resource: 'dashboard', action: 'read' },
    ],
  },
};

export const ROLE_BY_LEGACY_NAME: Record<string, string> = {
  superadmin: 'super-admin',
  'super-admin': 'super-admin',
  admin: 'admin',
  physician: 'physician',
  doctor: 'physician',
  'front-desk': 'front-desk',
  receptionist: 'front-desk',
  nurse: 'nurse',
  pharmacist: 'pharmacist',
  manager: 'manager',
  viewer: 'viewer',
};

const SUPER_ROLES = new Set(['admin', 'super-admin']);

export function isSuperUser(user: UserProfile | string[]): boolean {
  if (typeof user === 'string') return SUPER_ROLES.has(user);
  if (Array.isArray(user)) return user.some((r) => SUPER_ROLES.has(r));
  return user.roles.some((r) => SUPER_ROLES.has(r));
}

export function getUserPermissions(user: UserProfile | string[]): Permission[] {
  const roles: string[] = Array.isArray(user) ? user : user.roles;
  const resolved = new Map<string, Permission>();
  const seen = new Set<string>();

  function addRole(roleId: string) {
    if (seen.has(roleId)) return;
    seen.add(roleId);

    const role = ROLES[roleId];
    if (!role) return;

    if (role.inherits) {
      role.inherits.forEach(addRole);
    }

    for (const perm of role.permissions) {
      const key = `${perm.resource}:${perm.action}`;
      if (!resolved.has(key)) {
        resolved.set(key, perm);
      }
    }
  }

  for (const role of roles) {
    addRole(role);
  }

  return Array.from(resolved.values());
}

export function hasPermission(
  user: UserProfile | string[],
  resource: string,
  action: PermissionAction
): boolean {
  if (isSuperUser(user)) return true;
  const permissions = getUserPermissions(user);
  return permissions.some(
    (p) => p.resource === '*' || (p.resource === resource && p.action === action)
  );
}

export function hasAnyPermission(
  user: UserProfile | string[],
  checks: Permission[]
): boolean {
  if (isSuperUser(user)) return true;
  const permissions = getUserPermissions(user);
  return checks.some((c) =>
    permissions.some((p) => p.resource === '*' || (p.resource === c.resource && p.action === c.action))
  );
}

export function hasAllPermissions(
  user: UserProfile | string[],
  checks: Permission[]
): boolean {
  if (isSuperUser(user)) return true;
  return checks.every((c) => hasPermission(user, c.resource, c.action));
}

export function filterNavigableItems(
  items: string[],
  user: UserProfile | null
): string[] {
  if (!user) return items;
  if (isSuperUser(user)) return items;

  const permissions = getUserPermissions(user);
  return items.filter((item) => {
    const nav = NAV_RESOURCE_MAP[item];
    if (!nav) return true;
    return permissions.some(
      (p) => p.resource === '*' || (p.resource === nav.resource && p.action === nav.action)
    );
  });
}

export const NAV_RESOURCE_MAP: Record<string, { resource: string; action: PermissionAction }> = {
  Dashboard: { resource: 'dashboard', action: 'read' },
  Analytics: { resource: 'analytics', action: 'read' },
  'Activity log': { resource: 'audit', action: 'read' },
  Appointments: { resource: 'appointments', action: 'read' },
  Calendar: { resource: 'calendar', action: 'read' },
  Patients: { resource: 'patients', action: 'read' },
  Prescriptions: { resource: 'prescriptions', action: 'read' },
  'Follow-ups': { resource: 'followups', action: 'read' },
  Chambers: { resource: 'chambers', action: 'read' },
  'Services & CMS': { resource: 'services', action: 'read' },
  Gallery: { resource: 'gallery', action: 'read' },
  Videos: { resource: 'videos', action: 'read' },
  Reviews: { resource: 'reviews', action: 'read' },
  Reports: { resource: 'reports', action: 'read' },
  Notifications: { resource: 'notifications', action: 'read' },
  'Users & roles': { resource: 'users', action: 'admin' },
  Settings: { resource: 'settings', action: 'read' },
};

export function createDemoUser(roleId: string, email: string, name: string): UserProfile {
  const role = ROLES[roleId];
  const permissions: Permission[] = role ? getUserPermissions([roleId]) : [];
  return {
    id: `user-${roleId}-${Math.random().toString(36).slice(2, 8)}`,
    email,
    name,
    roles: [roleId],
    permissions: permissions as Permission[],
    mfaEnabled: false,
    status: 'active',
    failedAttempts: 0,
  };
}

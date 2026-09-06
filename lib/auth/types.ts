export type PermissionAction = 'read' | 'write' | 'admin' | 'delete';

export interface Permission {
  resource: string;
  action: PermissionAction;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: Permission[];
  mfaEnabled: boolean;
  status: 'active' | 'locked' | 'pending';
  lastLogin?: string;
  failedAttempts: number;
  lockedUntil?: string;
  passwordHash?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  mfaCode?: string;
}

export interface MFASetupResponse {
  secret: string;
  otpauthUrl: string;
  qrCodeDataUrl: string;
  backupCodes: string[];
}

export interface SessionInfo {
  id: string;
  userId: string;
  device: string;
  ip: string;
  userAgent: string;
  createdAt: string;
  lastActive: string;
  expiresAt: string;
}

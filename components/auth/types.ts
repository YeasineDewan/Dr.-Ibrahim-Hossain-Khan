export interface Permission {
  resource: string;
  action: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: Permission[];
  status?: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  mfaCode?: string;
}

export interface MFASetupResponse {
  secret: string;
  qrCodeDataUrl: string;
  backupCodes: string[];
}

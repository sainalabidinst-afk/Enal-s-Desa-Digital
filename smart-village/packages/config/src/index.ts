export const APP_CONFIG = {
  name: 'Smart Village Platform',
  version: '0.1.0',
  description: 'Platform digital terpadu untuk Pemerintah Desa dan masyarakat',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

export const ROLES = {
  ADMIN: 'admin',
  KEPALA_DESA: 'kepala_desa',
  STAFF: 'staff',
  RT: 'rt',
  RW: 'rw',
  POLISI: 'polisi',
  BABINSA: 'babinsa',
  WARGA: 'warga',
} as const;

export const PERMISSIONS = {
  CITIZEN_CREATE: 'citizen:create',
  CITIZEN_READ: 'citizen:read',
  CITIZEN_UPDATE: 'citizen:update',
  CITIZEN_DELETE: 'citizen:delete',
  LETTER_CREATE: 'letter:create',
  LETTER_READ: 'letter:read',
  LETTER_UPDATE: 'letter:update',
  LETTER_DELETE: 'letter:delete',
  COMPLAINT_CREATE: 'complaint:create',
  COMPLAINT_READ: 'complaint:read',
  COMPLAINT_UPDATE: 'complaint:update',
  COMPLAINT_DELETE: 'complaint:delete',
} as const;

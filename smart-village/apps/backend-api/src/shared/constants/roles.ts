export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN_DESA: 'ADMIN_DESA',
  KEPALA_DESA: 'KEPALA_DESA',
  SEKRETARIS: 'SEKRETARIS',
  KASI: 'KASI',
  KAUR: 'KAUR',
  RT: 'RT',
  RW: 'RW',
  OPERATOR: 'OPERATOR',
  POLISI: 'POLISI',
  BABINSA: 'BABINSA',
  BPD: 'BPD',
  WARGA: 'WARGA',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

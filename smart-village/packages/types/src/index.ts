export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  photo?: string;
  role: {
    name: string;
    slug: string;
  };
  village?: {
    name: string;
  };
}

export interface Citizen {
  id: string;
  nik: string;
  name: string;
  placeOfBirth: string;
  dateOfBirth: string;
  gender: 'LAKI_LAKI' | 'PEREMPUAN';
  address: string;
  rt: string;
  rw: string;
  hamlet?: string;
  religion: string;
  maritalStatus: string;
  occupation?: string;
  education?: string;
  isAlive: boolean;
  familyCard?: {
    nkk: string;
    headName: string;
  };
}

export interface FamilyCard {
  id: string;
  nkk: string;
  headName: string;
  address: string;
  rt: string;
  rw: string;
  hamlet?: string;
  _count?: {
    citizens: number;
  };
}

export interface Letter {
  id: string;
  letterNumber: string;
  subject: string;
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'SIGNED' | 'CANCELLED';
  priority?: string;
  validUntil?: string;
  pdfUrl?: string;
  citizen: {
    name: string;
    nik: string;
  };
  letterType: {
    name: string;
    code: string;
  };
  submitter: {
    name: string;
  };
  createdAt: string;
}

export interface LetterType {
  id: string;
  code: string;
  name: string;
  requiresApproval: boolean;
}

export interface DashboardStats {
  totalCitizens: number;
  totalLetters: number;
  totalComplaints: number;
  pendingLetters: number;
  pendingComplaints: number;
  totalAssets: number;
  citizens: Array<{ gender: string; _count: { id: number } }>;
  letters: Array<{ status: string; _count: { id: number } }>;
  complaints: Array<{ status: string; _count: { id: number } }>;
}
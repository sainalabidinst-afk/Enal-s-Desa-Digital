export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  nik?: string;
  photo?: string;
  isActive: boolean;
  isVerified: boolean;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  slug: string;
  resource: string;
  action: string;
}

export interface Citizen {
  id: string;
  nik: string;
  nkk: string;
  name: string;
  placeOfBirth: string;
  dateOfBirth: string;
  gender: 'LAKI_LAKI' | 'PEREMPUAN';
  bloodType?: string;
  address: string;
  rt: string;
  rw: string;
  village: string;
  district: string;
  city: string;
  province: string;
  postalCode?: string;
  religion: string;
  maritalStatus: string;
  occupation?: string;
  nationality: string;
  fatherName?: string;
  motherName?: string;
  spouseName?: string;
  familyStatus: string;
  photo?: string;
  qrCode?: string;
  isAlive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LetterType {
  id: string;
  code: string;
  name: string;
  description?: string;
  template?: string;
  requirements?: string;
  validityDays?: number;
  isActive: boolean;
  requiresApproval: boolean;
  approvalFlow?: string;
}

export interface Letter {
  id: string;
  letterNumber: string;
  citizenId: string;
  letterTypeId: string;
  subject: string;
  content: string;
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'SIGNED' | 'PRINTED' | 'EXPIRED' | 'CANCELLED';
  priority: string;
  validUntil?: string;
  signedAt?: string;
  signedBy?: string;
  signature?: string;
  qrCode?: string;
  pdfUrl?: string;
  notes?: string;
  submittedBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Complaint {
  id: string;
  trackingNumber: string;
  category: 'INFRASTRUCTURE' | 'SECURITY' | 'SANITATION' | 'WATER' | 'ELECTRICITY' | 'HEALTH' | 'EDUCATION' | 'SOCIAL' | 'ENVIRONMENT' | 'OTHER';
  subject: string;
  description: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
  priority: string;
  photos: string[];
  videos: string[];
  assignedTo?: string;
  reporterName: string;
  reporterPhone: string;
  reporterEmail?: string;
  isAnonymous: boolean;
  resolution?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  submittedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

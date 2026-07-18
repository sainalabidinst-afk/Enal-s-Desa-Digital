export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
};

export const LETTER_STATUSES = [
  'PENDING',
  'IN_REVIEW',
  'APPROVED',
  'REJECTED',
  'SIGNED',
  'PRINTED',
  'EXPIRED',
  'CANCELLED',
] as const;

export const COMPLAINT_STATUSES = [
  'PENDING',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
  'REJECTED',
] as const;

export const COMPLAINT_CATEGORIES = [
  'INFRASTRUCTURE',
  'SECURITY',
  'SANITATION',
  'WATER',
  'ELECTRICITY',
  'HEALTH',
  'EDUCATION',
  'SOCIAL',
  'ENVIRONMENT',
  'OTHER',
] as const;

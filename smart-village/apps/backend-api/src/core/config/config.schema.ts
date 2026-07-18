import { z } from 'zod';

export const configSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  API_PREFIX: z.string().default('api/v1'),

  // Database
  DATABASE_URL: z.string().url(),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Redis
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),

  // MinIO
  MINIO_ENDPOINT: z.string().default('localhost'),
  MINIO_PORT: z.coerce.number().default(9000),
  MINIO_ACCESS_KEY: z.string().min(8, 'MINIO_ACCESS_KEY must be at least 8 characters'),
  MINIO_SECRET_KEY: z.string().min(8, 'MINIO_SECRET_KEY must be at least 8 characters'),
  MINIO_BUCKET: z.string().default('smart-village'),
  MINIO_USE_SSL: z.coerce.boolean().default(false),

  // SMTP / Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),

  // Firebase Cloud Messaging
  FCM_SERVER_KEY: z.string().optional(),

  // WhatsApp Gateway
  WHATSAPP_API_URL: z.string().optional(),
  WHATSAPP_API_KEY: z.string().optional(),

  // Feature Flags (defaults)
  ENABLE_AI: z.coerce.boolean().default(false),
  ENABLE_POLICE: z.coerce.boolean().default(false),
  ENABLE_GIS: z.coerce.boolean().default(false),
  ENABLE_UMKM: z.coerce.boolean().default(false),
  ENABLE_FINANCE: z.coerce.boolean().default(false),

  // Rate Limiting
  RATE_LIMIT_LOGIN: z.coerce.number().default(10),
  RATE_LIMIT_API: z.coerce.number().default(100),
  RATE_LIMIT_IMPORT: z.coerce.number().default(5),
  RATE_LIMIT_UPLOAD: z.coerce.number().default(20),

  // File Upload
  MAX_FILE_SIZE: z.coerce.number().default(10 * 1024 * 1024), // 10MB
  ALLOWED_MIME_TYPES: z.string().default('image/jpeg,image/png,image/webp,application/pdf'),

  // CORS
  CORS_ORIGINS: z.string().default('http://localhost:3000'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug', 'verbose']).default('info'),
  LOG_FORMAT: z.enum(['json', 'combined', 'dev']).default('json'),
});

export type Config = z.infer<typeof configSchema>;
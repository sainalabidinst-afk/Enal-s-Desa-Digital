# Smart Village

Aplikasi Smart Village berbasis Web dan Mobile untuk Pemerintah Desa dan Polsek.

> **"Bangun aplikasi yang selesai, bukan platform yang sempurna."**

Target: **1 desa berhasil** dalam 2-3 bulan.

## Status Milestones

### ✅ Milestone 1 — Backend Foundation
COMPLETE - Auth, User, Dashboard, Citizen, Family Card, Letter Service

### ✅ Milestone 2 — Frontend MVP  
COMPLETE - Login, Dashboard, Citizen List, Letter List

### 🎯 Milestone 3 — End-to-End Validation
Belum dimulai - Testing, Performance, Backup/Restore, Deployment Trial

### 🎯 Milestone 4 — Internal Beta (v0.4.0-beta)
Menunggu Milestone 3 selesai

## Arsitektur

```
smart-village/
├── apps/
│   ├── web-admin/       # Web Admin (Next.js)
│   ├── mobile-warga/    # Mobile Warga (Expo)
│   └── mobile-petugas/  # Mobile Petugas (Expo)
├── packages/
│   ├── ui/              # UI Components (shadcn/ui)
│   ├── types/           # TypeScript types
│   ├── api-client/      # API Client
│   └── utils/           # Utility functions
└── prisma/
    └── schema.prisma    # Database schema (10-15 tabel inti)
```

## Modul Aplikasi

### Web Admin & Mobile Petugas
- Dashboard
- Master Data: Penduduk, KK, RT/RW, Dusun
- Pelayanan: Surat, Pengaduan
- Inventaris
- Laporan
- Pengguna & Hak Akses
- Pengaturan

### Mobile Warga
- Login
- Profil
- Ajukan Surat
- Cek Status Surat
- Pengaduan
- Berita
- Agenda
- Notifikasi

## Database (10-15 tabel inti)

- users
- roles
- citizens
- family_cards
- letters
- complaints
- assets
- news
- events
- notifications
- audit_logs

## Tech Stack

- **Backend**: NestJS, Prisma, PostgreSQL
- **Web**: Next.js, TailwindCSS, TypeScript
- **Mobile**: React Native + Expo (TypeScript)

## Development

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Roadmap MVP (6 Sprint)

- **Sprint 1**: Login, User Management, Dashboard
- **Sprint 2**: Data Penduduk, Kartu Keluarga
- **Sprint 3**: Pelayanan Surat
- **Sprint 4**: Pengaduan Masyarakat
- **Sprint 5**: Inventaris Aset
- **Sprint 6**: Berita, Agenda, Laporan

## License

Proprietary

## API Documentation

All endpoints follow RESTful pattern with consistent response format:

```json
{
  "success": true,
  "message": "Operation completed",
  "data": {},
  "meta": {}
}
```

### Auth Endpoints
- `POST /api/v1/auth/login` - Login with email/phone + password
- `POST /api/v1/auth/refresh` - Refresh access token

### Citizen Endpoints
- `GET /api/v1/citizens` - List citizens (pagination, search, filter)
- `GET /api/v1/citizens/:id` - Get citizen by ID
- `GET /api/v1/citizens/stats` - Get citizen statistics
- `POST /api/v1/citizens` - Create citizen
- `PATCH /api/v1/citizens/:id` - Update citizen
- `DELETE /api/v1/citizens/:id` - Soft delete citizen

### Family Card Endpoints
- `GET /api/v1/family-cards` - List family cards
- `GET /api/v1/family-cards/:id` - Get family card by ID
- `GET /api/v1/family-cards/nkk/:nkk` - Get by NKK
- `POST /api/v1/family-cards` - Create family card
- `PATCH /api/v1/family-cards/:id` - Update family card
- `DELETE /api/v1/family-cards/:id` - Soft delete

### Letter Endpoints
- `GET /api/v1/letters` - List letters (pagination, search, filter by status)
- `GET /api/v1/letters/:id` - Get letter by ID
- `GET /api/v1/letters/types` - List letter types
- `POST /api/v1/letters` - Submit letter
- `PATCH /api/v1/letters/:id` - Update letter/status
- `DELETE /api/v1/letters/:id` - Soft delete

### Complaint Endpoints
- `GET /api/v1/complaints` - List complaints
- `GET /api/v1/complaints/:id` - Get complaint by ID
- `POST /api/v1/complaints` - Submit complaint
- `PATCH /api/v1/complaints/:id` - Update complaint status
- `DELETE /api/v1/complaints/:id` - Soft delete

### Asset Endpoints
- `GET /api/v1/assets` - List assets

### Dashboard Endpoints
- `GET /api/v1/dashboard` - Overview statistics
- `GET /api/v1/dashboard/stats` - Detailed statistics

Swagger UI available at: `http://localhost:3001/api/docs`

## Frontend MVP

```
apps/web-admin/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   └── (dashboard)/
│       ├── dashboard/page.tsx
│       ├── citizens/page.tsx
│       └── letters/page.tsx
├── components/
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
└── lib/
    ├── api-client.ts
    ├── actions/
    │   └── auth.ts
    └── utils.ts
```

Run frontend: `npm run dev` (di `apps/web-admin`)

## Docker Deployment

```bash
# Build and run all services
docker compose up --build

# Or with npm
npm run docker:up

# Stop
docker compose down
```

Containers:
- `smartvillage-postgres` (PostgreSQL 16)
- `smartvillage-backend` (NestJS API on :3001)
- `smartvillage-frontend` (Next.js on :3000)
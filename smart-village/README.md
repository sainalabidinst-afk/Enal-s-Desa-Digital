# Smart Village Platform

Platform digital terpadu untuk Pemerintah Desa, Polsek, dan masyarakat dalam satu ekosistem yang aman, modular, dan siap dikembangkan dalam jangka panjang.

## Arsitektur

```
smart-village/
├── apps/                    # Aplikasi frontend dan backend
│   ├── web-admin/          # Web Admin (Next.js 15)
│   ├── mobile-warga/       # Mobile Warga (Expo)
│   ├── mobile-petugas/     # Mobile Petugas (Expo)
│   ├── backend-api/        # Backend API (NestJS)
│   ├── ai-service/         # AI Service (FastAPI/Node)
│   └── gateway/            # API Gateway
├── packages/               # Shared packages
│   ├── ui/                 # UI Components (shadcn/ui)
│   ├── types/              # TypeScript types
│   ├── api-client/         # API Client
│   ├── auth/               # Auth utilities
│   ├── config/             # Config utilities
│   ├── eslint/             # ESLint config
│   ├── tsconfig/           # TypeScript config
│   ├── utils/              # Utility functions
│   └── shared/             # Shared code
├── services/               # Microservices
│   ├── auth/
│   ├── citizen/
│   ├── letter/
│   ├── complaint/
│   ├── asset/
│   ├── gis/
│   ├── notification/
│   ├── dashboard/
│   ├── police/
│   ├── analytics/
│   └── ai/
└── docs/                   # Dokumentasi
```

## Tech Stack

- **Frontend Web**: Next.js 15, React 19, TypeScript, TailwindCSS, shadcn/ui, TanStack Query, Zustand
- **Mobile**: React Native + Expo (TypeScript)
- **Backend**: NestJS, Prisma ORM, PostgreSQL, Redis, MinIO
- **Authentication**: JWT + Refresh Token, **RBAC (Permission-based access)**
  - `@RequirePermissions(...)` menggunakan `req.user.role.permissions[*].slug`
- **Notification**: Firebase Cloud Messaging, Email, WhatsApp Gateway
- **GIS**: Leaflet, OpenStreetMap
- **AI**: OpenAI API, Ollama, RAG
- **Infrastructure**: Docker, GitHub Actions, Turborepo


## Development

```bash
# Install dependencies
npm install

# Run all apps in development
npm run dev

# Build all apps
npm run build

# Run lint
npm run lint

# Format code
npm run format
```

## Roadmap

- **Phase 1 (MVP)**: Login, Data Penduduk, Pelayanan Surat, Pengaduan, Dashboard
- **Phase 2**: Inventaris Aset, GIS, E-Office, Absensi
- **Phase 3**: Integrasi Polsek (Patroli, Panic Button, Manajemen Kasus)
- **Phase 4**: Posyandu, UMKM, Pertanian, APBDes, BUMDes
- **Phase 5**: AI Assistant, Smart CCTV, Analytics, Decision Support

## License

Proprietary

# Smart Village

Aplikasi Smart Village berbasis Web dan Mobile untuk Pemerintah Desa dan Polsek.

> **"Bangun aplikasi yang selesai, bukan platform yang sempurna."**

Target: **1 desa berhasil** dalam 2-3 bulan.

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
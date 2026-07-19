# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-07-19

### Added
- Letter Service module
- CRUD endpoints for letters: `GET/POST/PATCH/DELETE /api/v1/letters`
- Master letter types: SK Domisili, SK Usaha, SK Tidak Mampu, SK Lahir, SK Kematian, SK SKCK, SK Nikah, SK Ahli Waris
- Letter status management: PENDING, IN_REVIEW, APPROVED, REJECTED, SIGNED, CANCELLED
- Automatic letter number generation
- Letter types endpoint: `GET /api/v1/letters/types`

## [0.4.0-beta] - 2026-07-19

### Added
- Frontend MVP (Next.js) with authentication flow
- Login page at `/login`
- Dashboard with KPI cards
- Citizens list page at `/citizens`
- Letters list page at `/letters`
- Badge UI component
- API integration with JWT refresh handling
- End-to-end testing checklist (TESTING.md)

## [0.2.0]

### Added
- Citizen Management module
- Family Card Management module
- CRUD endpoints for citizens: `GET/POST/PATCH/DELETE /api/v1/citizens`
- CRUD endpoints for family cards: `GET/POST/PATCH/DELETE /api/v1/family-cards`
- Citizen statistics endpoint
- NIK validation (16 digits)
- Pagination, search, filter, sorting on list endpoints
- Soft delete for all business tables

### Changed
- Simplified database schema from 50+ tables to 11 core tables
- Removed unused dependencies (Redis, Socket.io, MinIO, Leaflet, Twilio, Firebase)

## [0.1.0] - 2026-07-19

### Added
- Authentication module with JWT + Refresh Token
- Login endpoint: `POST /api/v1/auth/login`
- Refresh token endpoint: `POST /api/v1/auth/refresh`
- User Management module
- Dashboard module with overview and statistics
- RBAC with roles: Super Admin, Kepala Desa, Sekretaris Desa, Operator Desa, Warga
- Audit Log interceptor
- Swagger API documentation
- Unit tests for Auth and User services
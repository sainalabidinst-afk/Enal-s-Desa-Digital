# End-to-End Testing Checklist

## Test Scenario 1: Authentication Flow

- [ ] Login dengan email/phone + password
- [ ] Token JWT disimpan di localStorage
- [ ] Refresh token otomatis saat expired
- [ ] Logout berhasil
- [ ] Session tetap valid setelah reload

### Test Accounts
- Super Admin: `admin@smartvillage.go.id` / `admin123`
- Operator: `operator@desa.id` / `operator123` (buat saat seed)

## Test Scenario 2: Citizen CRUD

- [ ] List penduduk dengan pagination
- [ ] Search penduduk by nama/NIK
- [ ] Tambah penduduk baru
- [ ] Edit penduduk
- [ ] Soft delete penduduk
- [ ] Validasi NIK 16 digit

## Test Scenario 3: Letter Flow

- [ ] Pilih penduduk sebagai pemohon
- [ ] Buat surat baru
- [ ] Nomor surat auto-generate
- [ ] Status berubah: PENDING → APPROVED → SIGNED
- [ ] List surat dengan filter status

## Test Scenario 4: Permission Check

- [ ] Super Admin: akses penuh
- [ ] Operator Desa: CRUD citizen & letter
- [ ] Kepala Desa: read-only + approve letter
- [ ] Warga: hanya create letter & complaint

## Test Scenario 5: Data Persistence

- [ ] Refresh browser
- [ ] Data tetap ada
- [ ] Session tidak hilang

## Bug Tracking

| ID | Bug | Severity | Status |
|----|-----|----------|--------|
| BUG-001 | TBD | - | - |

## Launch Criteria

- [ ] Semua test scenario penting lolos
- [ ] Tidak ada bug critical
- [ ] README lengkap
- [ ] CHANGELOG terupdate
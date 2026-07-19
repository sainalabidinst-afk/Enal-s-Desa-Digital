import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

function generateNIK(index: number): string {
  return `320101${String(index).padStart(6, '0')}0001`;
}

function generateNKK(index: number): string {
  return `320101${String(index).padStart(6, '0')}0001`;
}

function getRandomName(): string {
  const names = ['Budi', 'Siti', 'Ahmad', 'Rina', 'Joko', 'Dewi', 'Agus', 'Fitri', 'Hendra', 'Lina', 'Eka', 'Maya', 'Danang', 'Sari', 'Rudi', 'Yuli', 'Andi', 'Nina', 'Wahyu', 'Rosa'];
  return names[Math.floor(Math.random() * names.length)] + ' ' + names[Math.floor(Math.random() * names.length)];
}

function getRandomGender() {
  return Math.random() > 0.5 ? 'LAKI_LAKI' : 'PEREMPUAN';
}

function getRandomReligion() {
  const religions = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Budha', 'Konghucu'];
  return religions[Math.floor(Math.random() * religions.length)];
}

function getRandomMaritalStatus() {
  const statuses = ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function getRandomEducation() {
  const educations = ['SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2'];
  return educations[Math.floor(Math.random() * educations.length)];
}

function getRandomOccupation() {
  const occupations = ['Petani', 'Pedagang', 'PNS', 'Swasta', 'TNI/Polri', 'Wiraswasta', 'Buruh', 'Pelajar'];
  return occupations[Math.floor(Math.random() * occupations.length)];
}

async function main() {
  console.log('🌱 Seeding database...');

  const permissions = [
    { name: 'Read User', slug: 'user.read', resource: 'user', action: 'read' },
    { name: 'Create User', slug: 'user.create', resource: 'user', action: 'create' },
    { name: 'Update User', slug: 'user.update', resource: 'user', action: 'update' },
    { name: 'Delete User', slug: 'user.delete', resource: 'user', action: 'delete' },
    { name: 'Read Role', slug: 'role.read', resource: 'role', action: 'read' },
    { name: 'Read Citizen', slug: 'citizen.read', resource: 'citizen', action: 'read' },
    { name: 'Create Citizen', slug: 'citizen.create', resource: 'citizen', action: 'create' },
    { name: 'Update Citizen', slug: 'citizen.update', resource: 'citizen', action: 'update' },
    { name: 'Delete Citizen', slug: 'citizen.delete', resource: 'citizen', action: 'delete' },
    { name: 'Read Family', slug: 'family.read', resource: 'family', action: 'read' },
    { name: 'Create Family', slug: 'family.create', resource: 'family', action: 'create' },
    { name: 'Update Family', slug: 'family.update', resource: 'family', action: 'update' },
    { name: 'Read Letter', slug: 'letter.read', resource: 'letter', action: 'read' },
    { name: 'Create Letter', slug: 'letter.create', resource: 'letter', action: 'create' },
    { name: 'Update Letter', slug: 'letter.update', resource: 'letter', action: 'update' },
    { name: 'Approve Letter', slug: 'letter.approve', resource: 'letter', action: 'approve' },
    { name: 'Read Complaint', slug: 'complaint.read', resource: 'complaint', action: 'read' },
    { name: 'Create Complaint', slug: 'complaint.create', resource: 'complaint', action: 'create' },
    { name: 'Resolve Complaint', slug: 'complaint.resolve', resource: 'complaint', action: 'resolve' },
    { name: 'Read Asset', slug: 'asset.read', resource: 'asset', action: 'read' },
    { name: 'Create Asset', slug: 'asset.create', resource: 'asset', action: 'create' },
    { name: 'Update Asset', slug: 'asset.update', resource: 'asset', action: 'update' },
    { name: 'Read News', slug: 'news.read', resource: 'news', action: 'read' },
    { name: 'Create News', slug: 'news.create', resource: 'news', action: 'create' },
    { name: 'Read Event', slug: 'event.read', resource: 'event', action: 'read' },
    { name: 'Create Event', slug: 'event.create', resource: 'event', action: 'create' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { slug: perm.slug },
      update: { name: perm.name, resource: perm.resource, action: perm.action },
      create: perm,
    });
  }
  console.log(`✅ ${permissions.length} permissions created`);

  const roles = [
    { name: 'Super Admin', slug: 'super_admin', level: 100, description: 'Full access' },
    { name: 'Kepala Desa', slug: 'kepala_desa', level: 90, description: 'Village head' },
    { name: 'Sekretaris Desa', slug: 'sekretaris_desa', level: 80, description: 'Village secretary' },
    { name: 'Operator Desa', slug: 'operator_desa', level: 60, description: 'Village operator' },
    { name: 'Warga', slug: 'warga', level: 10, description: 'Citizen' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      update: { name: role.name, level: role.level, description: role.description },
      create: { ...role, isSystem: true },
    });
  }
  console.log(`✅ ${roles.length} roles created`);

  const allPerms = await prisma.permission.findMany();
  const superAdmin = await prisma.role.findUnique({ where: { slug: 'super_admin' } });
  const kepalaDesa = await prisma.role.findUnique({ where: { slug: 'kepala_desa' } });
  const sekretaris = await prisma.role.findUnique({ where: { slug: 'sekretaris_desa' } });
  const operator = await prisma.role.findUnique({ where: { slug: 'operator_desa' } });
  const warga = await prisma.role.findUnique({ where: { slug: 'warga' } });

  for (const perm of allPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdmin!.id, permissionId: perm.id } },
      update: {},
      create: { roleId: superAdmin!.id, permissionId: perm.id },
    });
  }

  const assignPermsToRole = async (roleId: string, permSlugs: string[]) => {
    for (const slug of permSlugs) {
      const perm = allPerms.find((p) => p.slug === slug);
      if (perm) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId, permissionId: perm.id } },
          update: {},
          create: { roleId, permissionId: perm.id },
        });
      }
    }
  };

  const villageId = 'default-village-id';
  const citizienPerms = allPerms.filter((p) => p.slug.startsWith('user.') || p.slug.startsWith('role.read'));
  const citizienPermIds = citizienPerms.map((p) => p.id);
  
  await assignPermsToRole(kepalaDesa!.id, allPerms.filter((p) => !p.slug.startsWith('role.')).map((p) => p.slug));
  await assignPermsToRole(sekretaris!.id, ['citizen.create', 'citizen.read', 'citizen.update', 'family.create', 'family.read', 'family.update', 'letter.create', 'letter.read', 'letter.update', 'letter.approve', 'complaint.create', 'complaint.read', 'complaint.resolve'].flatMap((slug) => [slug]));
  await assignPermsToRole(operator!.id, ['user.read', 'user.create', 'user.update', 'citizen.create', 'citizen.read', 'citizen.update', 'citizen.delete', 'family.create', 'family.read', 'family.update', 'letter.create', 'letter.read', 'letter.update', 'complaint.create', 'complaint.read', 'asset.create', 'asset.read', 'asset.update']);
  await assignPermsToRole(warga!.id, ['letter.create', 'letter.read', 'complaint.create', 'news.read', 'event.read']);

  console.log('✅ Role permissions assigned');

  const password = await argon2.hash('admin123');
  await prisma.user.upsert({
    where: { email: 'admin@smartvillage.go.id' },
    update: {},
    create: {
      email: 'admin@smartvillage.go.id',
      name: 'Super Admin',
      password,
      roleId: superAdmin!.id,
      isVerified: true,
    },
  });
  console.log('✅ Super admin created (admin@smartvillage.go.id / admin123)');

  const village = await prisma.village.upsert({
    where: { code: 'DESA001' },
    update: {},
    create: {
      code: 'DESA001',
      name: 'Desa Contoh',
      district: 'Kecamatan Contoh',
      city: 'Kota Contoh',
      province: 'Provinsi Contoh',
      headName: 'Kepala Desa',
    },
  });

  for (let i = 1; i <= 30; i++) {
    const nkk = generateNKK(i);
    const existingKK = await prisma.familyCard.findFirst({ where: { nkk, deletedAt: null } });
    if (existingKK) continue;

    await prisma.familyCard.create({
      data: {
        nkk,
        headName: getRandomName(),
        address: `Jl. Desa No. ${i}`,
        rt: '001',
        rw: '001',
        villageId: village.id,
      },
    });
  }
  console.log('✅ 30 family cards created');

  for (let i = 1; i <= 100; i++) {
    const nik = generateNIK(i);
    const existing = await prisma.citizen.findFirst({ where: { nik, deletedAt: null } });
    if (existing) continue;

    const birthYear = 1950 + Math.floor(Math.random() * 50);
    const birthMonth = Math.floor(Math.random() * 12) + 1;
    const birthDay = Math.floor(Math.random() * 28) + 1;

    await prisma.citizen.create({
      data: {
        nik,
        name: getRandomName(),
        placeOfBirth: 'Kota Lahir',
        dateOfBirth: new Date(birthYear, birthMonth, birthDay),
        gender: getRandomGender() as any,
        address: `Jl. Desa No. ${i}`,
        rt: '001',
        rw: '001',
        religion: getRandomReligion(),
        maritalStatus: getRandomMaritalStatus(),
        occupation: getRandomOccupation(),
        education: getRandomEducation(),
        villageId: village.id,
      },
    });
  }
  console.log('✅ 100 citizens created');

  await prisma.letterType.upsert({
    where: { code: 'SK_DOMISILI' },
    update: { name: 'Surat Keterangan Domisili' },
    create: { code: 'SK_DOMISILI', name: 'Surat Keterangan Domisili', requiresApproval: true },
  });

  const letterTypes = [
    { code: 'SK_USAHA', name: 'Surat Keterangan Usaha', requiresApproval: true },
    { code: 'SK_TIDAK_MAMPU', name: 'Surat Keterangan Tidak Mampu', requiresApproval: true },
    { code: 'SK_LAHIR', name: 'Surat Keterangan Kelahiran', requiresApproval: true },
    { code: 'SK_KEMATIAN', name: 'Surat Keterangan Kematian', requiresApproval: true },
    { code: 'SK_SKCK', name: 'Surat Pengantar SKCK', requiresApproval: true },
    { code: 'SK_NIKAH', name: 'Surat Keterangan Nikah', requiresApproval: true },
    { code: 'SK_AHLI_WARIS', name: 'Surat Ahli Waris', requiresApproval: true },
  ];

  for (const lt of letterTypes) {
    await prisma.letterType.upsert({
      where: { code: lt.code },
      update: { name: lt.name },
      create: lt,
    });
  }
  console.log(`✅ ${letterTypes.length + 1} letter types created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
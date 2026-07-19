import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

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

  const assignPermsToRole = async (role: { id: string }, permSlugs: string[]) => {
    for (const slug of permSlugs) {
      const perm = allPerms.find((p) => p.slug === slug);
      if (perm) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
          update: {},
          create: { roleId: role.id, permissionId: perm.id },
        });
      }
    }
  };

  await assignPermsToRole(kepalaDesa!, ['user.read', 'user.create', 'user.update', 'role.read', 'citizen.*', 'family.*', 'letter.*', 'complaint.*', 'asset.*', 'news.*', 'event.*']);
  await assignPermsToRole(sekretaris!, ['citizen.read', 'citizen.create', 'citizen.update', 'family.*', 'letter.*', 'complaint.*']);
  await assignPermsToRole(operator!, ['user.read', 'user.create', 'user.update', 'citizen.*', 'family.*', 'letter.*', 'complaint.*', 'asset.*']);
  await assignPermsToRole(warga!, ['letter.create', 'letter.read', 'complaint.create', 'news.read', 'event.read']);

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

  await prisma.letterType.upsert({
    where: { code: 'SK_DOMISILI' },
    update: { name: 'Surat Keterangan Domisili' },
    create: { code: 'SK_DOMISILI', name: 'Surat Keterangan Domisili', requiresApproval: true },
  });

  console.log('\n🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
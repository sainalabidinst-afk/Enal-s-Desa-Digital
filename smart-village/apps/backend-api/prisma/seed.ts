import { PrismaClient, Gender } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ============================================================
  // CREATE PERMISSIONS
  // ============================================================
  const permissions = [
    // Tenant
    { name: 'Read Tenant', slug: 'tenant.read', resource: 'tenant', action: 'read' },
    { name: 'Create Tenant', slug: 'tenant.create', resource: 'tenant', action: 'create' },
    { name: 'Update Tenant', slug: 'tenant.update', resource: 'tenant', action: 'update' },
    { name: 'Delete Tenant', slug: 'tenant.delete', resource: 'tenant', action: 'delete' },

    // User Management
    { name: 'Read User', slug: 'user.read', resource: 'user', action: 'read' },
    { name: 'Create User', slug: 'user.create', resource: 'user', action: 'create' },
    { name: 'Update User', slug: 'user.update', resource: 'user', action: 'update' },
    { name: 'Delete User', slug: 'user.delete', resource: 'user', action: 'delete' },

    // Role Management
    { name: 'Read Role', slug: 'role.read', resource: 'role', action: 'read' },
    { name: 'Create Role', slug: 'role.create', resource: 'role', action: 'create' },
    { name: 'Update Role', slug: 'role.update', resource: 'role', action: 'update' },
    { name: 'Delete Role', slug: 'role.delete', resource: 'role', action: 'delete' },

    // Citizen
    { name: 'Read Citizen', slug: 'citizen.read', resource: 'citizen', action: 'read' },
    { name: 'Create Citizen', slug: 'citizen.create', resource: 'citizen', action: 'create' },
    { name: 'Update Citizen', slug: 'citizen.update', resource: 'citizen', action: 'update' },
    { name: 'Delete Citizen', slug: 'citizen.delete', resource: 'citizen', action: 'delete' },
    { name: 'Import Citizen', slug: 'citizen.import', resource: 'citizen', action: 'import' },
    { name: 'Export Citizen', slug: 'citizen.export', resource: 'citizen', action: 'export' },

    // Family Card
    { name: 'Read Family', slug: 'family.read', resource: 'family', action: 'read' },
    { name: 'Create Family', slug: 'family.create', resource: 'family', action: 'create' },
    { name: 'Update Family', slug: 'family.update', resource: 'family', action: 'update' },
    { name: 'Delete Family', slug: 'family.delete', resource: 'family', action: 'delete' },

    // Letter
    { name: 'Read Letter', slug: 'letter.read', resource: 'letter', action: 'read' },
    { name: 'Create Letter', slug: 'letter.create', resource: 'letter', action: 'create' },
    { name: 'Update Letter', slug: 'letter.update', resource: 'letter', action: 'update' },
    { name: 'Delete Letter', slug: 'letter.delete', resource: 'letter', action: 'delete' },
    { name: 'Approve Letter', slug: 'letter.approve', resource: 'letter', action: 'approve' },
    { name: 'Sign Letter', slug: 'letter.sign', resource: 'letter', action: 'sign' },
    { name: 'Verify Letter', slug: 'letter.verify', resource: 'letter', action: 'verify' },
    { name: 'Print Letter', slug: 'letter.print', resource: 'letter', action: 'print' },

    // Complaint
    { name: 'Read Complaint', slug: 'complaint.read', resource: 'complaint', action: 'read' },
    { name: 'Create Complaint', slug: 'complaint.create', resource: 'complaint', action: 'create' },
    { name: 'Update Complaint', slug: 'complaint.update', resource: 'complaint', action: 'update' },
    { name: 'Resolve Complaint', slug: 'complaint.resolve', resource: 'complaint', action: 'resolve' },
    { name: 'Assign Complaint', slug: 'complaint.assign', resource: 'complaint', action: 'assign' },

    // Asset
    { name: 'Read Asset', slug: 'asset.read', resource: 'asset', action: 'read' },
    { name: 'Create Asset', slug: 'asset.create', resource: 'asset', action: 'create' },
    { name: 'Update Asset', slug: 'asset.update', resource: 'asset', action: 'update' },
    { name: 'Delete Asset', slug: 'asset.delete', resource: 'asset', action: 'delete' },
    { name: 'Maintain Asset', slug: 'asset.maintenance', resource: 'asset', action: 'maintenance' },

    // Project
    { name: 'Read Project', slug: 'project.read', resource: 'project', action: 'read' },
    { name: 'Create Project', slug: 'project.create', resource: 'project', action: 'create' },
    { name: 'Update Project', slug: 'project.update', resource: 'project', action: 'update' },
    { name: 'Delete Project', slug: 'project.delete', resource: 'project', action: 'delete' },

    // Dashboard
    { name: 'Read Dashboard', slug: 'dashboard.read', resource: 'dashboard', action: 'read' },
    { name: 'Export Dashboard', slug: 'dashboard.export', resource: 'dashboard', action: 'export' },

    // Report
    { name: 'Generate Report', slug: 'report.generate', resource: 'report', action: 'generate' },
    { name: 'Export Report', slug: 'report.export', resource: 'report', action: 'export' },

    // Notification
    { name: 'Send Notification', slug: 'notification.send', resource: 'notification', action: 'send' },
    { name: 'Read Notification', slug: 'notification.read', resource: 'notification', action: 'read' },

    // Settings
    { name: 'Read Settings', slug: 'settings.read', resource: 'settings', action: 'read' },
    { name: 'Update Settings', slug: 'settings.update', resource: 'settings', action: 'update' },

    // Police
    { name: 'Read Case', slug: 'case.read', resource: 'case', action: 'read' },
    { name: 'Create Case', slug: 'case.create', resource: 'case', action: 'create' },
    { name: 'Update Case', slug: 'case.update', resource: 'case', action: 'update' },
    { name: 'Read Patrol', slug: 'patrol.read', resource: 'patrol', action: 'read' },
    { name: 'Create Patrol', slug: 'patrol.create', resource: 'patrol', action: 'create' },
    { name: 'Respond Panic', slug: 'panic.respond', resource: 'panic', action: 'respond' },

    // Finance
    { name: 'Read Budget', slug: 'budget.read', resource: 'budget', action: 'read' },
    { name: 'Create Budget', slug: 'budget.create', resource: 'budget', action: 'create' },
    { name: 'Approve Budget', slug: 'budget.approve', resource: 'budget', action: 'approve' },
    { name: 'Read Transaction', slug: 'transaction.read', resource: 'transaction', action: 'read' },
    { name: 'Create Transaction', slug: 'transaction.create', resource: 'transaction', action: 'create' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { slug: perm.slug },
      update: { name: perm.name, resource: perm.resource, action: perm.action },
      create: perm,
    });
  }
  console.log(`✅ ${permissions.length} permissions created`);

  // ============================================================
  // CREATE ROLES
  // ============================================================
  const roles = [
    { name: 'Super Admin', slug: 'super_admin', level: 100, description: 'Full system access' },
    { name: 'Kepala Desa', slug: 'kepala_desa', level: 90, description: 'Kepala Desa - village head' },
    { name: 'Sekretaris Desa', slug: 'sekretaris_desa', level: 80, description: 'Sekretaris Desa' },
    { name: 'Kasi Pemerintahan', slug: 'kasi_pemerintahan', level: 70, description: 'Kepala Seksi Pemerintahan' },
    { name: 'Kasi Kesejahteraan', slug: 'kasi_kesejahteraan', level: 70, description: 'Kepala Seksi Kesejahteraan' },
    { name: 'Kasi Pembangunan', slug: 'kasi_pembangunan', level: 70, description: 'Kepala Seksi Pembangunan' },
    { name: 'Operator Desa', slug: 'operator_desa', level: 60, description: 'Operator data desa' },
    { name: 'RT', slug: 'rt', level: 40, description: 'Rukun Tetangga' },
    { name: 'RW', slug: 'rw', level: 45, description: 'Rukun Warga' },
    { name: 'Kapolsek', slug: 'kapolsek', level: 90, description: 'Kepala Polsek' },
    { name: 'Kanit Reskrim', slug: 'kanit_reskrim', level: 75, description: 'Kepala Unit Reserse Kriminal' },
    { name: 'Petugas Patroli', slug: 'petugas_patroli', level: 60, description: 'Petugas patroli polsek' },
    { name: 'Warga', slug: 'warga', level: 10, description: 'Masyarakat/warga desa' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      update: { name: role.name, level: role.level, description: role.description },
      create: { ...role, isSystem: true },
    });
  }
  console.log(`✅ ${roles.length} roles created`);

  // ============================================================
  // ASSIGN PERMISSIONS TO ROLES
  // ============================================================
  const superAdmin = await prisma.role.findUnique({ where: { slug: 'super_admin' } });
  const kepalaDesa = await prisma.role.findUnique({ where: { slug: 'kepala_desa' } });
  const sekretaris = await prisma.role.findUnique({ where: { slug: 'sekretaris_desa' } });
  const operator = await prisma.role.findUnique({ where: { slug: 'operator_desa' } });
  const rt = await prisma.role.findUnique({ where: { slug: 'rt' } });
  const rw = await prisma.role.findUnique({ where: { slug: 'rw' } });
  const kapolsek = await prisma.role.findUnique({ where: { slug: 'kapolsek' } });
  const warga = await prisma.role.findUnique({ where: { slug: 'warga' } });

  // Super Admin: ALL permissions
  const allPerms = await prisma.permission.findMany();
  for (const perm of allPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdmin!.id, permissionId: perm.id } },
      update: {},
      create: { roleId: superAdmin!.id, permissionId: perm.id },
    });
  }

  // Kepala Desa: READ + critical actions
  const kepalaDesaPerms = allPerms.filter((p) =>
    !p.slug.includes('delete') &&
    !p.slug.startsWith('role.') &&
    !p.slug.startsWith('tenant.'),
  );
  for (const perm of kepalaDesaPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: kepalaDesa!.id, permissionId: perm.id } },
      update: {},
      create: { roleId: kepalaDesa!.id, permissionId: perm.id },
    });
  }

  // Sekretaris: focus on letter + citizen
  const sekretarisPerms = allPerms.filter((p) =>
    p.slug.startsWith('citizen.') ||
    p.slug.startsWith('family.') ||
    p.slug.startsWith('letter.') ||
    p.slug.startsWith('dashboard.') ||
    p.slug === 'notification.read' ||
    p.slug === 'settings.read',
  );
  for (const perm of sekretarisPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: sekretaris!.id, permissionId: perm.id } },
      update: {},
      create: { roleId: sekretaris!.id, permissionId: perm.id },
    });
  }

  // Operator: CRUD citizen + family
  const operatorPerms = allPerms.filter((p) =>
    p.slug.startsWith('citizen.') ||
    p.slug.startsWith('family.') ||
    p.slug === 'notification.read',
  );
  for (const perm of operatorPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: operator!.id, permissionId: perm.id } },
      update: {},
      create: { roleId: operator!.id, permissionId: perm.id },
    });
  }

  // RT: read citizen + letter approve
  const rtPerms = allPerms.filter((p) =>
    p.slug === 'citizen.read' ||
    p.slug === 'letter.read' ||
    p.slug === 'letter.approve' ||
    p.slug === 'complaint.read',
  );
  for (const perm of rtPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: rt!.id, permissionId: perm.id } },
      update: {},
      create: { roleId: rt!.id, permissionId: perm.id },
    });
  }

  // RW: read citizen + letter approve
  const rwPerms = allPerms.filter((p) =>
    p.slug === 'citizen.read' ||
    p.slug === 'letter.read' ||
    p.slug === 'letter.approve' ||
    p.slug === 'complaint.read' ||
    p.slug === 'complaint.create',
  );
  for (const perm of rwPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: rw!.id, permissionId: perm.id } },
      update: {},
      create: { roleId: rw!.id, permissionId: perm.id },
    });
  }

  // Kapolsek: police-related permissions
  const kapolsekPerms = allPerms.filter((p) =>
    p.slug.startsWith('case.') ||
    p.slug.startsWith('patrol.') ||
    p.slug.startsWith('panic.') ||
    p.slug === 'dashboard.read' ||
    p.slug === 'report.generate' ||
    p.slug === 'complaint.read' ||
    p.slug === 'notification.read' ||
    p.slug === 'citizen.read',
  );
  for (const perm of kapolsekPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: kapolsek!.id, permissionId: perm.id } },
      update: {},
      create: { roleId: kapolsek!.id, permissionId: perm.id },
    });
  }

  console.log('✅ Role-permission assignments created');

  // ============================================================
  // CREATE DEFAULT SUPER ADMIN
  // ============================================================
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
  console.log('✅ Default super admin created (admin@smartvillage.go.id / admin123)');

  // ============================================================
  // CREATE FEATURE FLAGS
  // ============================================================
  const featureFlags = [
    { code: 'ENABLE_AI', name: 'AI Features', isEnabled: false },
    { code: 'ENABLE_POLICE', name: 'Police Module', isEnabled: false },
    { code: 'ENABLE_GIS', name: 'GIS & Maps', isEnabled: false },
    { code: 'ENABLE_UMKM', name: 'UMKM Module', isEnabled: false },
    { code: 'ENABLE_FINANCE', name: 'Finance Module', isEnabled: false },
    { code: 'ENABLE_IMPORT_EXCEL', name: 'Import Excel', isEnabled: true },
    { code: 'ENABLE_EXPORT_PDF', name: 'Export PDF', isEnabled: true },
  ];

  for (const flag of featureFlags) {
    await prisma.featureFlag.upsert({
      where: { code: flag.code },
      update: { name: flag.name, isEnabled: flag.isEnabled },
      create: flag,
    });
  }
  console.log(`✅ ${featureFlags.length} feature flags created`);

  // ============================================================
  // CREATE WORKFLOW DEFINITIONS
  // ============================================================
  const workflowDefs = [
    {
      code: 'SURAT_DOMISILI',
      name: 'Surat Keterangan Domisili',
      description: 'Approval workflow untuk surat domisili',
      resource: 'letter',
      stages: [
        { sequence: 1, name: 'Verifikasi RT', roleSlug: 'rt', action: 'APPROVE', isFinal: false },
        { sequence: 2, name: 'Verifikasi RW', roleSlug: 'rw', action: 'APPROVE', isFinal: false },
        { sequence: 3, name: 'Approval Desa', roleSlug: 'operator_desa', action: 'APPROVE', isFinal: true },
      ],
    },
    {
      code: 'SURAT_USAHA',
      name: 'Surat Keterangan Usaha',
      description: 'Approval workflow untuk surat keterangan usaha',
      resource: 'letter',
      stages: [
        { sequence: 1, name: 'Verifikasi RT', roleSlug: 'rt', action: 'APPROVE', isFinal: false },
        { sequence: 2, name: 'Verifikasi RW', roleSlug: 'rw', action: 'APPROVE', isFinal: false },
        { sequence: 3, name: 'Approval Desa', roleSlug: 'operator_desa', action: 'APPROVE', isFinal: true },
      ],
    },
    {
      code: 'SURAT_TIDAK_MAMPU',
      name: 'Surat Keterangan Tidak Mampu',
      description: 'Approval workflow untuk surat tidak mampu',
      resource: 'letter',
      stages: [
        { sequence: 1, name: 'Verifikasi RT', roleSlug: 'rt', action: 'APPROVE', isFinal: false },
        { sequence: 2, name: 'Verifikasi RW', roleSlug: 'rw', action: 'APPROVE', isFinal: false },
        { sequence: 3, name: 'Approval Desa', roleSlug: 'sekretaris_desa', action: 'APPROVE', isFinal: true },
      ],
    },
    {
      code: 'SURAT_SKCK',
      name: 'Surat Pengantar SKCK',
      description: 'Approval workflow untuk surat pengantar SKCK (melibatkan Polsek)',
      resource: 'letter',
      stages: [
        { sequence: 1, name: 'Verifikasi RT', roleSlug: 'rt', action: 'APPROVE', isFinal: false },
        { sequence: 2, name: 'Verifikasi RW', roleSlug: 'rw', action: 'APPROVE', isFinal: false },
        { sequence: 3, name: 'Approval Desa', roleSlug: 'operator_desa', action: 'APPROVE', isFinal: false },
        { sequence: 4, name: 'Verifikasi Polsek', roleSlug: 'kanit_reskrim', action: 'APPROVE', isFinal: true },
      ],
    },
    {
      code: 'BOOKING_BALAI',
      name: 'Booking Balai Desa',
      description: 'Approval workflow untuk booking balai desa',
      resource: 'booking',
      stages: [
        { sequence: 1, name: 'Approval Desa', roleSlug: 'operator_desa', action: 'APPROVE', isFinal: true },
      ],
    },
  ];

  for (const def of workflowDefs) {
    const { stages, ...definitionData } = def;
    await prisma.workflowDefinition.upsert({
      where: { code: def.code },
      update: {
        name: def.name,
        description: def.description,
        resource: def.resource,
        isActive: true,
      },
      create: {
        ...definitionData,
        isActive: true,
      },
    });

    // Create stages
    const createdDef = await prisma.workflowDefinition.findUnique({ where: { code: def.code } });
    for (const stage of stages) {
      await prisma.workflowStage.upsert({
        where: {
          id: `${createdDef!.id}_stage_${stage.sequence}`,
        },
        update: {
          name: stage.name,
          roleSlug: stage.roleSlug,
          action: stage.action,
          isFinal: stage.isFinal,
        },
        create: {
          workflowId: createdDef!.id,
          sequence: stage.sequence,
          name: stage.name,
          roleSlug: stage.roleSlug,
          action: stage.action,
          isFinal: stage.isFinal,
        },
      });
    }
  }
  console.log(`✅ ${workflowDefs.length} workflow definitions created`);

  // ============================================================
  // CREATE LETTER TYPES
  // ============================================================
  const letterTypes = [
    { code: 'SK_DOMISILI', name: 'Surat Keterangan Domisili', requiresApproval: true, workflowCode: 'SURAT_DOMISILI', validityDays: 90 },
    { code: 'SK_USAHA', name: 'Surat Keterangan Usaha', requiresApproval: true, workflowCode: 'SURAT_USAHA', validityDays: 365 },
    { code: 'SK_TIDAK_MAMPU', name: 'Surat Keterangan Tidak Mampu', requiresApproval: true, workflowCode: 'SURAT_TIDAK_MAMPU', validityDays: 90 },
    { code: 'SK_LAHIR', name: 'Surat Keterangan Kelahiran', requiresApproval: true, workflowCode: 'SURAT_DOMISILI', validityDays: null },
    { code: 'SK_KEMATIAN', name: 'Surat Keterangan Kematian', requiresApproval: true, workflowCode: 'SURAT_DOMISILI', validityDays: null },
    { code: 'SK_SKCK', name: 'Surat Pengantar SKCK', requiresApproval: true, workflowCode: 'SURAT_SKCK', validityDays: 30 },
    { code: 'SK_NIKAH', name: 'Surat Keterangan Nikah', requiresApproval: true, workflowCode: 'SURAT_DOMISILI', validityDays: null },
    { code: 'SK_AHLI_WARIS', name: 'Surat Keterangan Ahli Waris', requiresApproval: true, workflowCode: 'SURAT_DOMISILI', validityDays: null },
  ];

  for (const lt of letterTypes) {
    await prisma.letterType.upsert({
      where: { code: lt.code },
      update: {
        name: lt.name,
        requiresApproval: lt.requiresApproval,
        workflowCode: lt.workflowCode,
        validityDays: lt.validityDays,
      },
      create: lt,
    });
  }
  console.log(`✅ ${letterTypes.length} letter types created`);

  // ============================================================
  // CREATE NOTIFICATION TEMPLATES
  // ============================================================
  const notifTemplates = [
    { code: 'LETTER_SUBMITTED', title: 'Surat Diajukan', body: 'Surat {{letterType}} atas nama {{citizenName}} telah diajukan dan menunggu verifikasi.', channel: 'IN_APP', variables: '["letterType","citizenName"]' },
    { code: 'LETTER_APPROVED', title: 'Surat Disetujui', body: 'Surat {{letterType}} Anda telah disetujui. Silakan ambil di kantor desa.', channel: 'IN_APP', variables: '["letterType"]' },
    { code: 'LETTER_REJECTED', title: 'Surat Ditolak', body: 'Surat {{letterType}} Anda ditolak. Alasan: {{reason}}.', channel: 'IN_APP', variables: '["letterType","reason"]' },
    { code: 'COMPLAINT_RECEIVED', title: 'Pengaduan Diterima', body: 'Pengaduan Anda dengan nomor {{trackingNumber}} telah diterima dan akan diproses.', channel: 'IN_APP', variables: '["trackingNumber"]' },
    { code: 'COMPLAINT_RESOLVED', title: 'Pengaduan Selesai', body: 'Pengaduan Anda dengan nomor {{trackingNumber}} telah selesai diproses.', channel: 'IN_APP', variables: '["trackingNumber"]' },
    { code: 'PANIC_BUTTON', title: '⚠️ Darurat!', body: 'Panic button ditekan di {{location}}. Segera tangani!', channel: 'IN_APP', variables: '["location"]' },
    { code: 'BOOKING_CONFIRMED', title: 'Booking Disetujui', body: 'Booking balai desa pada {{date}} telah disetujui.', channel: 'IN_APP', variables: '["date"]' },
    { code: 'PATROL_REMINDER', title: 'Pengingat Patroli', body: 'Jangan lupa patroli hari ini. Scan QR di pos-pos patroli.', channel: 'IN_APP', variables: '[]' },
  ];

  for (const tmpl of notifTemplates) {
    await prisma.notificationTemplate.upsert({
      where: { code: tmpl.code },
      update: { title: tmpl.title, body: tmpl.body, channel: tmpl.channel, variables: tmpl.variables },
      create: tmpl,
    });
  }
  console.log(`✅ ${notifTemplates.length} notification templates created`);

  console.log('\n🎉 Seed completed successfully!');
  console.log('   Default login: admin@smartvillage.go.id / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
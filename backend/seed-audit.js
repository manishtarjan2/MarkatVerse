import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.auditLog.create({
    data: {
      action: 'SYSTEM_START',
      resource: 'SecurityModule',
      details: 'Audit logging system initialized successfully.',
      ipAddress: '127.0.0.1',
    },
  });

  await prisma.auditLog.create({
    data: {
      action: 'LOGIN',
      resource: 'User',
      details: 'Super Admin authenticated successfully.',
      ipAddress: '192.168.1.45',
    },
  });

  console.log('Successfully inserted mock audit logs.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding admin staff...');
  
  await prisma.user.upsert({
    where: { email: 'super@markatverse.com' },
    update: { role: 'super_admin' },
    create: { email: 'super@markatverse.com', name: 'Super Admin Staff', password: 'hash', role: 'super_admin', phone: '11111' }
  });

  await prisma.user.upsert({
    where: { email: 'catalog@markatverse.com' },
    update: { role: 'catalog_admin' },
    create: { email: 'catalog@markatverse.com', name: 'Catalog Admin Staff', password: 'hash', role: 'catalog_admin', phone: '22222' }
  });

  await prisma.user.upsert({
    where: { email: 'catalog2@markatverse.com' },
    update: { role: 'catalog_admin' },
    create: { email: 'catalog2@markatverse.com', name: 'Catalog Admin Staff 2', password: 'hash', role: 'catalog_admin', phone: '22223' }
  });

  await prisma.user.upsert({
    where: { email: 'onboarding@markatverse.com' },
    update: { role: 'onboarding_admin' },
    create: { email: 'onboarding@markatverse.com', name: 'Onboarding Admin Staff', password: 'hash', role: 'onboarding_admin', phone: '33333' }
  });

  await prisma.user.upsert({
    where: { email: 'support@markatverse.com' },
    update: { role: 'support_admin' },
    create: { email: 'support@markatverse.com', name: 'Support Admin Staff', password: 'hash', role: 'support_admin', phone: '44444' }
  });

  await prisma.user.upsert({
    where: { email: 'support2@markatverse.com' },
    update: { role: 'support_admin' },
    create: { email: 'support2@markatverse.com', name: 'Support Admin Staff 2', password: 'hash', role: 'support_admin', phone: '44445' }
  });

  await prisma.user.upsert({
    where: { email: 'support3@markatverse.com' },
    update: { role: 'support_admin' },
    create: { email: 'support3@markatverse.com', name: 'Support Admin Staff 3', password: 'hash', role: 'support_admin', phone: '44446' }
  });

  console.log('Seeded successfully!');
}
main().catch(console.error).finally(() => prisma.$disconnect());

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up dummy data...');
  
  const dummyEmails = [
    'super@markatverse.com',
    'catalog@markatverse.com',
    'catalog2@markatverse.com',
    'onboarding@markatverse.com',
    'support@markatverse.com',
    'support2@markatverse.com',
    'support3@markatverse.com'
  ];

  await prisma.user.deleteMany({
    where: {
      email: {
        in: dummyEmails
      }
    }
  });

  console.log('Upserting super admin manishtarjan2@gmail.com...');
  const hashedPassword = await bcrypt.hash('Manish@9798', 10);
  
  await prisma.user.upsert({
    where: { email: 'manishtarjan2@gmail.com' },
    update: { 
      role: 'super_admin',
      password: hashedPassword
    },
    create: { 
      email: 'manishtarjan2@gmail.com', 
      name: 'Super Admin', 
      password: hashedPassword, 
      role: 'super_admin', 
      phone: '1234567890', 
      markatId: 'ADM-MANISH' 
    }
  });
  
  // Just in case they meant the mk one from the screenshot
  await prisma.user.updateMany({
    where: { email: 'manishtarjan9798.mk@gmail.com' },
    data: { role: 'super_admin' }
  });

  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());

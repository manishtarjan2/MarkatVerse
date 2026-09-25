const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Ensuring ONLY manishtarjan2@gmail.com is super_admin...');
  
  // Find all users who are currently super_admin
  const superAdmins = await prisma.user.findMany({
    where: { role: 'super_admin' }
  });

  for (const admin of superAdmins) {
    if (admin.email !== 'manishtarjan2@gmail.com') {
      console.log(`Demoting ${admin.email} from super_admin to SELLER...`);
      await prisma.user.update({
        where: { id: admin.id },
        data: { role: 'SELLER' }
      });
    }
  }

  // Also specifically target the .mk account just in case it has a different role but needs to be explicitly a seller
  console.log('Targeting manishtarjan9798.mk@gmail.com directly...');
  try {
    await prisma.user.updateMany({
      where: { 
        email: {
          in: ['manishtarjan9798.mk@gmail.com', 'maniddhterjan9798.mk@gmail.com']
        }
      },
      data: { role: 'SELLER' }
    });
  } catch(e) {
    console.error(e);
  }

  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());

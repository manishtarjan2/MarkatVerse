const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const usersToDelete = await prisma.user.findMany({
    where: {
      OR: [
        { name: { startsWith: 'test' } },
        { email: { startsWith: 'test' } },
        { email: { startsWith: 'manish9798.mk' } }
      ]
    }
  });

  console.log(`Found ${usersToDelete.length} users to delete.`);
  
  for (const u of usersToDelete) {
    if (u.email === 'manishtarjan2@gmail.com') continue; // Don't delete main admin
    await prisma.user.delete({ where: { id: u.id } });
    console.log(`Deleted user: ${u.name} (${u.email})`);
  }

  console.log('Cleanup finished.');
}

main().catch(console.error).finally(() => prisma.$disconnect());

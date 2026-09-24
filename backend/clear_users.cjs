const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Deleting all businesses...');
  await prisma.business.deleteMany({});
  console.log('Deleting all users...');
  await prisma.user.deleteMany({});
  console.log('Database successfully cleared of old users and businesses.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing all service queues and related data...');

  const staffResult = await prisma.serviceStaff.deleteMany();
  console.log(`Deleted ${staffResult.count} staff members.`);

  const resourceResult = await prisma.serviceResource.deleteMany();
  console.log(`Deleted ${resourceResult.count} resources.`);

  const queueResult = await prisma.serviceQueue.deleteMany();
  console.log(`Deleted ${queueResult.count} service queues.`);

  console.log('All service queues cleared successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

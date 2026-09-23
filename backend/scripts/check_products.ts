import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const deletedProducts = await prisma.product.deleteMany({
    where: { OR: [{ sellerId: null }, { sellerId: { isSet: false } }] }
  });
  
  const deletedQueues = await prisma.serviceQueue.deleteMany({
    where: { OR: [{ sellerId: null }, { sellerId: { isSet: false } }] }
  });

  console.log(`Deleted ${deletedProducts.count} dummy products.`);
  console.log(`Deleted ${deletedQueues.count} dummy service queues.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

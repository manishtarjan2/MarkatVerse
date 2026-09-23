import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dummyProducts = await prisma.product.findMany({
    where: {
      name: {
        contains: 'Dummy',
        mode: 'insensitive'
      }
    }
  });

  console.log(`Found ${dummyProducts.length} dummy products.`);
  
  if (dummyProducts.length > 0) {
    const res = await prisma.product.deleteMany({
      where: {
        name: {
          contains: 'Dummy',
          mode: 'insensitive'
        }
      }
    });
    console.log(`Deleted ${res.count} products.`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

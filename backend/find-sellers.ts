import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sellers = await prisma.user.findMany({
    where: { role: 'SELLER' },
    select: { id: true, name: true, email: true, phone: true }
  });

  console.log(JSON.stringify(sellers, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

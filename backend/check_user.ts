import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findFirst({
    where: { email: 'manishtarjan9798.mk@gmail.com' },
    include: { business: true }
  });
  console.log(JSON.stringify(user, null, 2));
}
main().finally(() => prisma.$disconnect());

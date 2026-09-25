const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.user.updateMany({ 
    where: { email: 'manish2@gmail.com' },
    data: { email: 'manishtarjan2@gmail.com' }
  });
  console.log('Email successfully updated to manishtarjan2@gmail.com');
}
main().finally(()=>prisma.$disconnect());

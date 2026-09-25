const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.user.updateMany({ 
    where: { email: 'manishtarjan2@gmail.com' },
    data: { phone: '9199640374' }
  });
  console.log('Phone number successfully updated to 9199640374');
}
main().finally(()=>prisma.$disconnect());

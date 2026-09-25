const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.user.updateMany({ 
    where: { email: 'manishtarjan2@gmail.com' },
    data: { markatId: 'MV-ADM-000001' }
  });
  console.log('Super Admin ID updated to MV-ADM-000001');
}
main().finally(()=>prisma.$disconnect());

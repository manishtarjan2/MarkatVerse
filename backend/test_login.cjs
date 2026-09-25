const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findFirst({ where: { email: 'manish2@gmail.com' }});
  const isMatch = await bcrypt.compare('Manish@9798', user.password);
  console.log('Password match?', isMatch);
}
main().finally(()=>prisma.$disconnect());

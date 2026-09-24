const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const identifier = '6206133688';
  const passwordInput = 'admin123';

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { phone: identifier },
        { markatId: identifier }
      ]
    },
    include: { business: true }
  });

  if (!user) {
    console.log('User NOT FOUND in database for identifier:', identifier);
    return;
  }
  
  console.log('User found:', user.email, 'Role:', user.role);
  
  const isMatch = await bcrypt.compare(passwordInput, user.password);
  console.log('Password match?', isMatch);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

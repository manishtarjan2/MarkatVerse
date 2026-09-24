const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const phone = '6206133688';
  const email = 'manishtarjan9798.mk@gmail.com';
  
  // Set a strict known password
  const password = await bcrypt.hash('admin123', 10);
  
  // Update the user to have this password and ensure the role is ADMIN
  const user = await prisma.user.updateMany({
    where: {
      OR: [
        { email: email },
        { phone: phone }
      ]
    },
    data: {
      role: 'ADMIN',
      password: password
    }
  });

  console.log(`Updated ${user.count} users to Super Admin with password "admin123"`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

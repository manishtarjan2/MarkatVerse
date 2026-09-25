const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Deleting all users to ensure complete reset...');

  // Delete everything to be absolutely sure
  await prisma.serviceBooking.deleteMany({});
  await prisma.serviceStaff.deleteMany({});
  await prisma.serviceResource.deleteMany({});
  await prisma.serviceQueue.deleteMany({});
  await prisma.ledgerTransaction.deleteMany({});
  await prisma.withdrawalRequest.deleteMany({});
  await prisma.wallet.deleteMany({});
  await prisma.bankAccount.deleteMany({});
  await prisma.businessFeature.deleteMany({});
  await prisma.business.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.listing.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.user.deleteMany({}); // Delete EVERY user unconditionally

  console.log('Creating EXACTLY ONE SUPERADMIN: manish2@gmail.com');
  const hashedPassword = await bcrypt.hash('Manish@9798', 10);
  
  await prisma.user.create({ 
    data: {
      email: 'manish2@gmail.com', 
      name: 'Super Admin', 
      password: hashedPassword, 
      role: 'super_admin', 
      phone: '6206133688', 
      markatId: 'MV-SUPERADMIN' 
    }
  });

  console.log('Done! Now manish2@gmail.com is the ONLY user in the database.');
}

main().catch(console.error).finally(() => prisma.$disconnect());

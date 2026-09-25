const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Initiating total database wipe of all users/sellers and their data...');

  // 1. Get all users EXCEPT manishtarjan2@gmail.com
  const usersToDelete = await prisma.user.findMany({
    where: {
      email: {
        not: 'manishtarjan2@gmail.com'
      }
    }
  });

  const userIds = usersToDelete.map(u => u.id);
  console.log(`Found ${userIds.length} users/sellers/admins to delete.`);

  if (userIds.length === 0) {
    console.log('No other users found. Database is already clean!');
    return;
  }

  // 2. Delete Service related
  console.log('Deleting Service data...');
  await prisma.serviceBooking.deleteMany({});
  await prisma.serviceStaff.deleteMany({});
  await prisma.serviceResource.deleteMany({});
  await prisma.serviceQueue.deleteMany({});

  // 3. Delete Business/Wallet related
  console.log('Deleting Business/Wallet data...');
  await prisma.ledgerTransaction.deleteMany({});
  await prisma.withdrawalRequest.deleteMany({});
  await prisma.wallet.deleteMany({});
  await prisma.bankAccount.deleteMany({});
  await prisma.businessFeature.deleteMany({});
  await prisma.business.deleteMany({});

  // 4. Delete Marketplace related
  console.log('Deleting Products and Leads...');
  await prisma.lead.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.listing.deleteMany({});

  // 5. Delete Orders
  console.log('Deleting Orders...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});

  // 6. Delete Users
  console.log(`Executing final purge on ${userIds.length} users...`);
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      id: {
        in: userIds
      }
    }
  });

  console.log(`Successfully purged ${deletedUsers.count} dummy/old users from the database!`);
  console.log('Only manishtarjan2@gmail.com remains as the Super Admin.');
}

main().catch(console.error).finally(() => prisma.$disconnect());

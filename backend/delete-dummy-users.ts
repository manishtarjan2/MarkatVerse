import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const emails = [
    'seller@gmail.com',
    'dummy.seller@example.com'
  ];

  for (const email of emails) {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (user) {
      const id = user.id;
      console.log(`Found user: ${user.name} (${email}) with id ${id}`);
      
      // 1. Delete ServiceQueues and related
      const queues = await prisma.serviceQueue.findMany({ where: { sellerId: id } });
      const queueIds = queues.map((q: any) => q.id);
      if (queueIds.length > 0) {
        await prisma.serviceBooking.deleteMany({ where: { queueId: { in: queueIds } } });
        await prisma.serviceStaff.deleteMany({ where: { queueId: { in: queueIds } } });
        await prisma.serviceResource.deleteMany({ where: { queueId: { in: queueIds } } });
        await prisma.serviceQueue.deleteMany({ where: { sellerId: id } });
      }

      // 2. Delete Businesses and related
      const businesses = await prisma.business.findMany({ where: { userId: id } });
      const businessIds = businesses.map((b: any) => b.id);
      if (businessIds.length > 0) {
        const wallets = await prisma.wallet.findMany({ where: { businessId: { in: businessIds } } });
        const walletIds = wallets.map((w: any) => w.id);
        if (walletIds.length > 0) {
          await prisma.ledgerTransaction.deleteMany({ where: { walletId: { in: walletIds } } });
          await prisma.withdrawalRequest.deleteMany({ where: { walletId: { in: walletIds } } });
          await prisma.wallet.deleteMany({ where: { businessId: { in: businessIds } } });
        }
        
        const bankAccounts = await prisma.bankAccount.findMany({ where: { businessId: { in: businessIds } } });
        const bankAccountIds = bankAccounts.map((ba: any) => ba.id);
        if (bankAccountIds.length > 0) {
          await prisma.withdrawalRequest.deleteMany({ where: { bankAccountId: { in: bankAccountIds } } });
          await prisma.bankAccount.deleteMany({ where: { businessId: { in: businessIds } } });
        }

        await prisma.businessFeature.deleteMany({ where: { businessId: { in: businessIds } } });
        await prisma.business.deleteMany({ where: { userId: id } });
      }

      // 3. Delete Leads
      await prisma.lead.deleteMany({ where: { OR: [{ buyerId: id }, { sellerId: id }] } });

      // 4. Delete Products
      await prisma.product.deleteMany({ where: { sellerId: id } });

      // 5. Delete Listings
      await prisma.listing.deleteMany({ where: { sellerId: id } });

      // Delete the user itself
      await prisma.user.delete({ where: { id } });
      console.log(`Successfully deleted user: ${email}`);
    } else {
      console.log(`User not found: ${email}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

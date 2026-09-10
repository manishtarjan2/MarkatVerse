const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const qs = await prisma.serviceQueue.findMany({orderBy: {createdAt: 'desc'}});
  const seen = new Set();
  for (const q of qs) {
    if (q.sellerId && seen.has(q.sellerId)) {
      await prisma.serviceBooking.deleteMany({where: {queueId: q.id}});
      await prisma.serviceQueue.delete({where: {id: q.id}});
      console.log('Deleted duplicate queue:', q.id);
    } else if (q.sellerId) {
      seen.add(q.sellerId);
    }
  }
  console.log('Done');
}
main().catch(console.error).finally(() => prisma.$disconnect());

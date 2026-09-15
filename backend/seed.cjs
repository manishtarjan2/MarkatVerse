const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.sector.count();
  if (count > 0) { console.log('Already seeded'); return; }
  const bType = await prisma.businessType.create({
    data: { mainType: 'B2C', name: 'General', description: 'General Business' }
  });
  await prisma.sector.createMany({
    data: [
      { name: 'b2b', description: 'B2B Wholesale Portal', businessTypeId: bType.id, isActive: true },
      { name: 'home', description: 'Home Services', businessTypeId: bType.id, isActive: true },
      { name: 'salon', description: 'Salon & Beauty', businessTypeId: bType.id, isActive: true },
      { name: 'events', description: 'Event Organizers', businessTypeId: bType.id, isActive: true },
      { name: 'transport', description: 'Transport & Rentals', businessTypeId: bType.id, isActive: true },
    ]
  });
  console.log('Seeded sectors');
}
main().catch(console.error).finally(() => prisma.$disconnect());

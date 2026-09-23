import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing bookings and orders...');
  
  // Clear all service bookings
  const bookingResult = await prisma.serviceBooking.deleteMany();
  console.log(`Deleted ${bookingResult.count} service bookings.`);

  // Clear all order items
  const orderItemResult = await prisma.orderItem.deleteMany();
  console.log(`Deleted ${orderItemResult.count} order items.`);

  // Clear all orders
  const orderResult = await prisma.order.deleteMany();
  console.log(`Deleted ${orderResult.count} orders.`);

  console.log('Database cleared of all bookings and orders successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

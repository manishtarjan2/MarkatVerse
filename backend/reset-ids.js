import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetIds() {
  console.log('Resetting all Counter sequences...');
  await prisma.counter.deleteMany({});
  
  // Create or get counter helper
  async function getNextId(type, prefix, base) {
    const counter = await prisma.counter.upsert({
      where: { id: type },
      update: { seq: { increment: 1 } },
      create: { id: type, seq: 1 },
    });
    return `${prefix}${base + counter.seq}`;
  }

  console.log('Resetting Users...');
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
  for (const user of users) {
    const markatId = await getNextId('User', 'MV-', 10000000);
    await prisma.user.update({
      where: { id: user.id },
      data: { markatId }
    });
  }
  console.log(`Updated ${users.length} Users`);

  console.log('Resetting Businesses...');
  const businesses = await prisma.business.findMany({ orderBy: { createdAt: 'asc' } });
  for (const biz of businesses) {
    const businessCode = await getNextId('Business', 'BUS-', 1000);
    await prisma.business.update({
      where: { id: biz.id },
      data: { businessCode }
    });
  }
  console.log(`Updated ${businesses.length} Businesses`);

  console.log('Resetting Staff...');
  const staffs = await prisma.serviceStaff.findMany({ orderBy: { createdAt: 'asc' } });
  for (const staff of staffs) {
    const staffCode = await getNextId('Staff', 'STAFF-', 2000);
    await prisma.serviceStaff.update({
      where: { id: staff.id },
      data: { staffCode }
    });
  }
  console.log(`Updated ${staffs.length} Staff`);

  console.log('Resetting Orders...');
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'asc' } });
  for (const order of orders) {
    const orderNumber = await getNextId('Order', 'ORD-', 50000);
    await prisma.order.update({
      where: { id: order.id },
      data: { orderNumber }
    });
  }
  console.log(`Updated ${orders.length} Orders`);

  console.log('Resetting ServiceBookings (Tokens & Appointments)...');
  const bookings = await prisma.serviceBooking.findMany({ orderBy: { joinedAt: 'asc' } });
  for (const bk of bookings) {
    let bookingNumber;
    if (bk.bookingMode === 'TOKEN') {
      bookingNumber = await getNextId('Token', 'TOKEN-', 3000);
    } else {
      bookingNumber = await getNextId('Booking', 'BOOK-', 8000);
    }
    await prisma.serviceBooking.update({
      where: { id: bk.id },
      data: { bookingNumber }
    });
  }
  console.log(`Updated ${bookings.length} Bookings/Tokens`);

  console.log('Resetting AuditLogs...');
  const audits = await prisma.auditLog.findMany({ orderBy: { createdAt: 'asc' } });
  for (const audit of audits) {
    const logId = await getNextId('AuditLog', 'AUD-', 10000);
    await prisma.auditLog.update({
      where: { id: audit.id },
      data: { logId }
    });
  }
  console.log(`Updated ${audits.length} Audit Logs`);

  console.log('All IDs have been successfully reset to match the proper sequences!');
  await prisma.$disconnect();
}

resetIds().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});

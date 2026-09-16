import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding dummy data...');

  // 1. Create a Dummy Seller User
  const dummySeller = await prisma.user.upsert({
    where: { email: 'dummy.seller@example.com' },
    update: {},
    create: {
      name: 'Dummy Doctor/Seller',
      email: 'dummy.seller@example.com',
      password: 'password', // Unhashed for simplicity in dummy script
      role: 'BUSINESS',
      phone: '1112223334'
    }
  });

  // 2. Create Dummy Category if needed
  const cat = await prisma.category.findFirst();

  // 3. Create Dummy Products
  await prisma.product.create({
    data: {
      name: 'Dummy Product 1',
      price: 99.99,
      sellerId: dummySeller.id,
      sellerName: dummySeller.name,
      categoryName: cat?.name || 'Test Category',
      status: 'ACTIVE'
    }
  });

  await prisma.product.create({
    data: {
      name: 'Dummy Product 2',
      price: 149.50,
      sellerId: dummySeller.id,
      sellerName: dummySeller.name,
      categoryName: cat?.name || 'Test Category',
      status: 'SUSPENDED'
    }
  });

  // 4. Create Dummy Service Queue (Doctor)
  await prisma.serviceQueue.create({
    data: {
      shopName: 'Dummy Doctor Clinic',
      avgMinutes: 15,
      pricePerHour: 50,
      sellerId: dummySeller.id,
      isOpen: true,
      status: 'ACTIVE'
    }
  });

  console.log('Dummy data seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

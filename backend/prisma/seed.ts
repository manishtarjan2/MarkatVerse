import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(process.cwd(), 'data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  for (const item of data) {
    await prisma.product.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        price: parseFloat(item.price),
        originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : null,
        discount: item.discount,
        rating: String(item.rating),
        reviews: item.reviews,
        sellerName: item.seller,
        location: item.location,
        categoryName: item.category,
        badge: item.badge,
        badgeColor: item.badgeColor,
        image: item.image,
        isB2B: item.category === 'B2B' || item.category === 'Wholesale',
        moq: (item.category === 'B2B' || item.category === 'Wholesale') ? 50 : 1
      },
      create: {
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : null,
        discount: item.discount,
        rating: String(item.rating),
        reviews: item.reviews,
        sellerName: item.seller,
        location: item.location,
        categoryName: item.category,
        badge: item.badge,
        badgeColor: item.badgeColor,
        image: item.image,
        isB2B: item.category === 'B2B' || item.category === 'Wholesale',
        moq: (item.category === 'B2B' || item.category === 'Wholesale') ? 50 : 1
      }
    });
  }
  console.log('Seeded database successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.product.create({
      data: {
        id: data.id,
        name: data.name,
        price: parseFloat(data.price),
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
        description: data.description,
        categoryName: data.category,
        sellerName: data.seller || 'MarkatVerse Seller',
        location: data.location || 'India',
        rating: data.rating || "0.0",
        reviews: data.reviews || "0",
        discount: data.discount,
        badge: data.badge,
        badgeColor: data.badgeColor,
        image: data.image
      }
    });
  }

  async findAll() {
    const products = await this.prisma.product.findMany();
    return products;
  }

  async findOne(id: string) {
    const p = await this.prisma.product.findUnique({ where: { id } });
    return p;
  }

  async update(id: string, data: any) {
    const p = await this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price ? parseFloat(data.price) : undefined,
        description: data.description,
        categoryName: data.category,
        image: data.image
      }
    });
    return p;
  }

  async remove(id: string) {
    await this.prisma.product.delete({ where: { id } });
    return { success: true };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        price: parseFloat(data.price),
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
        description: data.description || null,
        categoryName: data.category || data.categoryName || null,
        sellerId: data.sellerId || null,
        sellerName: data.seller || data.sellerName || 'MarkatVerse Seller',
        location: data.location || 'India',
        rating: data.rating || '0.0',
        reviews: data.reviews || '0',
        discount: data.discount || null,
        badge: data.badge || null,
        badgeColor: data.badgeColor || null,
        subcategory: data.subcategory || null,
        parameters: data.parameters || null,
        image: data.image || (data.images && data.images.length > 0 ? data.images[0] : null),
        images: data.images || (data.image ? [data.image] : []),
        isB2B: data.isB2B || false,
        moq: data.moq ? parseInt(data.moq) : 1,
        stock: data.stock ? parseInt(data.stock) : 0,
        sku: data.sku || null,
      },
    });
    return this.mapProduct(product);
  }

  async findAll() {
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return products.map(this.mapProduct);
  }

  async findOne(id: string) {
    const p = await this.prisma.product.findUnique({ where: { id } });
    return p ? this.mapProduct(p) : null;
  }

  async update(id: string, data: any) {
    const p = await this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price ? parseFloat(data.price) : undefined,
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : undefined,
        description: data.description,
        categoryName: data.category || data.categoryName,
        sellerId: data.sellerId,
        sellerName: data.seller || data.sellerName,
        discount: data.discount !== undefined ? data.discount : undefined,
        badge: data.badge !== undefined ? data.badge : undefined,
        badgeColor: data.badgeColor !== undefined ? data.badgeColor : undefined,
        subcategory: data.subcategory !== undefined ? data.subcategory : undefined,
        parameters: data.parameters !== undefined ? data.parameters : undefined,
        image: data.image !== undefined ? data.image : undefined,
        images: data.images !== undefined ? data.images : undefined,
        isB2B: data.isB2B,
        moq: data.moq ? parseInt(data.moq) : undefined,
        stock: data.stock ? parseInt(data.stock) : undefined,
      },
    });
    return this.mapProduct(p);
  }

  async remove(id: string) {
    await this.prisma.product.delete({ where: { id } });
    return { success: true };
  }

  // Maps DB field names to frontend-expected field names
  private mapProduct(p: any) {
    return {
      ...p,
      seller: p.sellerName,
      sellerId: p.sellerId,
      category: p.categoryName,
      images: p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []),
    };
  }
}

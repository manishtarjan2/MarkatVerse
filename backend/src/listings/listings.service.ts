import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async getAllListings(filters: { sectorId?: string, businessTypeId?: string, status?: string }) {
    return this.prisma.listing.findMany({
      where: filters,
      include: {
        seller: { select: { id: true, name: true } },
        businessType: true,
        sector: true,
        category: true,
      }
    });
  }

  async getListingById(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        seller: { select: { id: true, name: true } },
        businessType: true,
        sector: true,
        category: true,
      }
    });
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  async createListing(data: any) {
    return this.prisma.listing.create({
      data: {
        title: data.title,
        description: data.description,
        sellerId: data.sellerId,
        businessTypeId: data.businessTypeId,
        sectorId: data.sectorId,
        categoryId: data.categoryId,
        attributes: data.attributes,
        pricingConfig: data.pricingConfig,
        availability: data.availability,
        media: data.media
      }
    });
  }

  async updateListing(id: string, data: any) {
    return this.prisma.listing.update({
      where: { id },
      data
    });
  }

  async deleteListing(id: string) {
    return this.prisma.listing.delete({
      where: { id }
    });
  }
}

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
let ListingsService = class ListingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllListings(filters) {
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
    async getListingById(id) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: {
                seller: { select: { id: true, name: true } },
                businessType: true,
                sector: true,
                category: true,
            }
        });
        if (!listing)
            throw new NotFoundException('Listing not found');
        return listing;
    }
    async createListing(data) {
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
    async updateListing(id, data) {
        return this.prisma.listing.update({
            where: { id },
            data
        });
    }
    async deleteListing(id) {
        return this.prisma.listing.delete({
            where: { id }
        });
    }
};
ListingsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ListingsService);
export { ListingsService };
//# sourceMappingURL=listings.service.js.map
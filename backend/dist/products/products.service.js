var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { calculateDistance } from '../utils/geo.js';
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
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
                options: data.options || null,
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
    async findAll(location, lat, lng, radius) {
        let products = await this.prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
        });
        if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
            let effectiveRadius = radius;
            if (effectiveRadius === undefined || isNaN(effectiveRadius)) {
                const settings = await this.prisma.configuration.findFirst({
                    where: { type: 'SYSTEM_SETTINGS', name: 'global' },
                });
                effectiveRadius = settings?.data?.searchRadius ?? 50;
            }
            const withDistances = products.map(p => {
                let dist = Infinity;
                if (p.latitude !== null && p.longitude !== null) {
                    dist = calculateDistance(lat, lng, p.latitude, p.longitude);
                }
                return { ...p, _distance: dist };
            });
            const finalRadius = effectiveRadius ?? 50;
            products = withDistances.filter(p => p._distance <= finalRadius || p._distance === Infinity);
            products.sort((a, b) => a._distance - b._distance);
        }
        else if (location && location.trim() !== '') {
            const loc = location.toLowerCase();
            products.sort((a, b) => {
                const aLoc = (a.location || '').toLowerCase();
                const bLoc = (b.location || '').toLowerCase();
                const aMatch = aLoc.includes(loc);
                const bMatch = bLoc.includes(loc);
                if (aMatch && !bMatch)
                    return -1;
                if (!aMatch && bMatch)
                    return 1;
                return 0;
            });
        }
        return products.map(p => this.mapProduct(p));
    }
    async findOne(id) {
        const p = await this.prisma.product.findUnique({ where: { id } });
        return p ? this.mapProduct(p) : null;
    }
    async update(id, data) {
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
                options: data.options !== undefined ? data.options : undefined,
                image: data.image !== undefined ? data.image : undefined,
                images: data.images !== undefined ? data.images : undefined,
                isB2B: data.isB2B,
                moq: data.moq ? parseInt(data.moq) : undefined,
                stock: data.stock ? parseInt(data.stock) : undefined,
            },
        });
        return this.mapProduct(p);
    }
    async updateAdminStatus(id, status) {
        const p = await this.prisma.product.update({
            where: { id },
            data: { status }
        });
        return this.mapProduct(p);
    }
    async toggleDummyData(enable) {
        const status = enable ? 'ACTIVE' : 'SUSPENDED';
        await this.prisma.product.updateMany({
            where: { name: { contains: 'Dummy' } },
            data: { status }
        });
        await this.prisma.serviceQueue.updateMany({
            where: { shopName: { contains: 'Dummy' } },
            data: { status }
        });
        return { success: true, message: `Dummy data set to ${status}` };
    }
    async remove(id) {
        await this.prisma.product.delete({ where: { id } });
        return { success: true };
    }
    mapProduct(p) {
        return {
            ...p,
            seller: p.sellerName,
            sellerId: p.sellerId,
            category: p.categoryName,
            images: p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []),
        };
    }
};
ProductsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ProductsService);
export { ProductsService };
//# sourceMappingURL=products.service.js.map
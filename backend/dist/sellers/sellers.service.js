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
import { IdGeneratorService } from '../id-generator/id-generator.service.js';
let SellersService = class SellersService {
    prisma;
    idGenerator;
    constructor(prisma, idGenerator) {
        this.prisma = prisma;
        this.idGenerator = idGenerator;
    }
    async create(seller) {
        let user = null;
        if (seller.email || seller.phone) {
            user = await this.prisma.user.findFirst({
                where: {
                    OR: [
                        seller.email ? { email: seller.email } : undefined,
                        seller.phone ? { phone: seller.phone } : undefined,
                    ].filter(Boolean),
                },
            });
        }
        if (!user) {
            const bcrypt = await import('bcryptjs');
            const markatId = await this.idGenerator.generateUserId();
            user = await this.prisma.user.create({
                data: {
                    markatId,
                    name: seller.ownerName || seller.name || 'Seller',
                    email: seller.email || null,
                    phone: seller.phone || null,
                    password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
                    role: 'SELLER',
                },
            });
        }
        else {
            await this.prisma.user.update({
                where: { id: user.id },
                data: { role: 'SELLER' },
            });
        }
        const existingBusiness = await this.prisma.business.findUnique({
            where: { userId: user.id },
        });
        if (existingBusiness) {
            return { ...existingBusiness, status: 'Pending' };
        }
        const businessCode = await this.idGenerator.generateBusinessId();
        const business = await this.prisma.business.create({
            data: {
                businessCode,
                userId: user.id,
                name: seller.businessName || seller.name || 'My Business',
                description: seller.description || null,
                businessType: seller.businessType || 'WHOLESALER',
                address: seller.address || null,
                verified: false,
                capabilities: seller.mainType === 'SERVICE' ? ['SERVICE'] : ['B2B', 'B2C'],
            },
        });
        if (seller.mainType === 'SERVICE') {
            const queue = await this.prisma.serviceQueue.create({
                data: {
                    sellerId: user.id,
                    shopName: seller.businessName || seller.name || 'My Shop',
                    avgMinutes: 30,
                },
            });
            if (seller.staff && seller.staff.length > 0) {
                const staffData = await Promise.all(seller.staff.map(async (s) => ({
                    queueId: queue.id,
                    name: s.name,
                    role: s.role,
                    staffCode: await this.idGenerator.generateStaffId(),
                })));
                await this.prisma.serviceStaff.createMany({
                    data: staffData,
                });
            }
            if (seller.resources && seller.resources.length > 0) {
                await this.prisma.serviceResource.createMany({
                    data: seller.resources.map((r) => ({
                        queueId: queue.id,
                        name: r.name,
                        type: r.type,
                    })),
                });
            }
        }
        return {
            ...business,
            ownerName: user.name,
            email: user.email,
            phone: user.phone,
            status: 'Pending',
        };
    }
    async findAll() {
        const businesses = await this.prisma.business.findMany({
            include: { user: { select: { name: true, email: true, phone: true, role: true } } },
        });
        return businesses.map(b => ({
            id: b.id,
            businessCode: b.businessCode,
            userId: b.userId,
            businessName: b.name,
            ownerName: b.user.name,
            email: b.user.email,
            phone: b.user.phone,
            businessType: b.businessType,
            address: b.address,
            status: b.verified ? 'Approved' : 'Pending',
            date: b.createdAt.toISOString().split('T')[0],
            maxListings: b.maxListings,
            commissionType: b.commissionType,
            commissionRate: b.commissionRate,
        }));
    }
    async updateStatus(id, status) {
        const business = await this.prisma.business.update({
            where: { id },
            data: { verified: status === 'Approved' },
        });
        return { ...business, status };
    }
    async updateUser(userId, data) {
        const business = await this.prisma.business.findUnique({ where: { userId } });
        if (!business)
            throw new Error('Business not found');
        return this.prisma.business.update({
            where: { userId },
            data: {
                name: data.businessName !== undefined ? data.businessName : undefined,
                address: data.address !== undefined ? data.address : undefined,
                maxListings: data.maxListings !== undefined ? Number(data.maxListings) : undefined,
                commissionType: data.commissionType !== undefined ? data.commissionType : undefined,
                commissionRate: data.commissionRate !== undefined ? Number(data.commissionRate) : undefined,
            }
        });
    }
    async removeUser(userId) {
        await this.prisma.product.deleteMany({
            where: { sellerId: userId },
        });
        await this.prisma.business.deleteMany({
            where: { userId: userId },
        });
        await this.prisma.serviceQueue.deleteMany({
            where: { sellerId: userId },
        });
        return this.prisma.user.delete({
            where: { id: userId },
        });
    }
};
SellersService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        IdGeneratorService])
], SellersService);
export { SellersService };
//# sourceMappingURL=sellers.service.js.map
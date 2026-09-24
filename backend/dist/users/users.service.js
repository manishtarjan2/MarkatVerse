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
let UsersService = class UsersService {
    prisma;
    idGenerator;
    constructor(prisma, idGenerator) {
        this.prisma = prisma;
        this.idGenerator = idGenerator;
    }
    async create(createUserDto) {
        const markatId = await this.idGenerator.generateUserId();
        return this.prisma.user.create({
            data: { ...createUserDto, markatId }
        });
    }
    findAll() {
        return this.prisma.user.findMany({
            include: { business: true }
        });
    }
    findOne(id) {
        return this.prisma.user.findUnique({ where: { id } });
    }
    update(id, updateUserDto) {
        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
    }
    async remove(id) {
        const queues = await this.prisma.serviceQueue.findMany({ where: { sellerId: id } });
        const queueIds = queues.map(q => q.id);
        if (queueIds.length > 0) {
            await this.prisma.serviceBooking.deleteMany({ where: { queueId: { in: queueIds } } });
            await this.prisma.serviceStaff.deleteMany({ where: { queueId: { in: queueIds } } });
            await this.prisma.serviceResource.deleteMany({ where: { queueId: { in: queueIds } } });
            await this.prisma.serviceQueue.deleteMany({ where: { sellerId: id } });
        }
        const businesses = await this.prisma.business.findMany({ where: { userId: id } });
        const businessIds = businesses.map(b => b.id);
        if (businessIds.length > 0) {
            const wallets = await this.prisma.wallet.findMany({ where: { businessId: { in: businessIds } } });
            const walletIds = wallets.map(w => w.id);
            if (walletIds.length > 0) {
                await this.prisma.ledgerTransaction.deleteMany({ where: { walletId: { in: walletIds } } });
                await this.prisma.withdrawalRequest.deleteMany({ where: { walletId: { in: walletIds } } });
                await this.prisma.wallet.deleteMany({ where: { businessId: { in: businessIds } } });
            }
            const bankAccounts = await this.prisma.bankAccount.findMany({ where: { businessId: { in: businessIds } } });
            const bankAccountIds = bankAccounts.map(ba => ba.id);
            if (bankAccountIds.length > 0) {
                await this.prisma.withdrawalRequest.deleteMany({ where: { bankAccountId: { in: bankAccountIds } } });
                await this.prisma.bankAccount.deleteMany({ where: { businessId: { in: businessIds } } });
            }
            await this.prisma.businessFeature.deleteMany({ where: { businessId: { in: businessIds } } });
            await this.prisma.business.deleteMany({ where: { userId: id } });
        }
        await this.prisma.lead.deleteMany({ where: { OR: [{ buyerId: id }, { sellerId: id }] } });
        await this.prisma.product.deleteMany({ where: { sellerId: id } });
        await this.prisma.listing.deleteMany({ where: { sellerId: id } });
        return this.prisma.user.delete({ where: { id } });
    }
};
UsersService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        IdGeneratorService])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map
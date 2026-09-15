var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
let WalletService = class WalletService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getWallet(businessId) {
        let wallet = await this.prisma.wallet.findUnique({
            where: { businessId }
        });
        if (!wallet) {
            wallet = await this.prisma.wallet.create({
                data: { businessId }
            });
        }
        return wallet;
    }
    async getTransactions(walletId) {
        return this.prisma.ledgerTransaction.findMany({
            where: { walletId },
            orderBy: { createdAt: 'desc' }
        });
    }
    async addBankAccount(businessId, data) {
        return this.prisma.bankAccount.create({
            data: {
                businessId,
                ...data
            }
        });
    }
    async getBankAccounts(businessId) {
        return this.prisma.bankAccount.findMany({
            where: { businessId }
        });
    }
    async requestWithdrawal(businessId, amount, bankAccountId) {
        const wallet = await this.getWallet(businessId);
        if (wallet.availableBalance < amount) {
            throw new BadRequestException('Insufficient available balance');
        }
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.withdrawalRequest.create({
                data: {
                    walletId: wallet.id,
                    bankAccountId,
                    amount,
                    netAmount: amount,
                    status: 'REQUESTED'
                }
            });
            await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    availableBalance: { decrement: amount },
                    withdrawn: { increment: amount }
                }
            });
            await tx.ledgerTransaction.create({
                data: {
                    walletId: wallet.id,
                    referenceId: request.id,
                    referenceType: 'WITHDRAWAL',
                    grossAmount: amount,
                    netAmount: amount,
                    type: 'DEBIT',
                    status: 'PENDING'
                }
            });
            return request;
        });
    }
};
WalletService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], WalletService);
export { WalletService };
//# sourceMappingURL=wallet.service.js.map
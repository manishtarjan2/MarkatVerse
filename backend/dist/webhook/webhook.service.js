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
import { WalletService } from '../wallet/wallet.service.js';
let WebhookService = class WebhookService {
    prisma;
    walletService;
    constructor(prisma, walletService) {
        this.prisma = prisma;
        this.walletService = walletService;
    }
    async handlePaymentSuccess(data) {
        const { businessId, amount, referenceId, referenceType, paymentRef } = data;
        const wallet = await this.walletService.getWallet(businessId);
        const existingTx = await this.prisma.ledgerTransaction.findFirst({
            where: { paymentRef }
        });
        if (existingTx) {
            return { status: 'ignored', message: 'Transaction already processed' };
        }
        const platformFee = amount * 0.05;
        const netAmount = amount - platformFee;
        await this.prisma.$transaction(async (tx) => {
            await tx.ledgerTransaction.create({
                data: {
                    walletId: wallet.id,
                    referenceId,
                    referenceType,
                    paymentRef,
                    grossAmount: amount,
                    platformFee,
                    netAmount,
                    type: 'CREDIT',
                    status: 'PENDING_SETTLEMENT'
                }
            });
            await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    totalEarnings: { increment: amount },
                    pendingBalance: { increment: netAmount }
                }
            });
        });
        return { status: 'success' };
    }
};
WebhookService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        WalletService])
], WebhookService);
export { WebhookService };
//# sourceMappingURL=webhook.service.js.map
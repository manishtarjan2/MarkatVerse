import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { WalletService } from '../wallet/wallet.service.js';

@Injectable()
export class WebhookService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService
  ) {}

  async handlePaymentSuccess(data: any) {
    // Mock webhook payload: { businessId, amount, referenceId, referenceType, paymentRef }
    const { businessId, amount, referenceId, referenceType, paymentRef } = data;

    const wallet = await this.walletService.getWallet(businessId);

    // Idempotency check
    const existingTx = await this.prisma.ledgerTransaction.findFirst({
      where: { paymentRef }
    });

    if (existingTx) {
      return { status: 'ignored', message: 'Transaction already processed' };
    }

    // Process payment: 5% platform fee for demonstration
    const platformFee = amount * 0.05;
    const netAmount = amount - platformFee;

    await this.prisma.$transaction(async (tx: any) => {
      // 1. Add ledger entry
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

      // 2. Update wallet pending balance
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
}


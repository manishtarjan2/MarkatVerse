import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { WalletService } from '../wallet/wallet.service.js';
import { EventsService } from '../events/events.service.js';

@Injectable()
export class WebhookService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
    private eventsService: EventsService
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

    // Process payment: Phase 3 Dynamic Commission Engine
    let platformFee = 0;
    
    // Attempt to resolve dynamic commission
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (business) {
      // Find rule by main category/sector or fallback
      const rule = await this.prisma.commissionRule.findFirst({
        where: {
          isActive: true,
          OR: [
            { entityType: 'SECTOR', entityId: business.sector || 'DEFAULT' },
            { entityType: 'BUSINESS_TYPE', entityId: business.businessType || 'DEFAULT' }
          ]
        },
        orderBy: { percentage: 'desc' }
      });

      if (rule) {
        platformFee = (amount * rule.percentage) / 100 + rule.fixedFee;
      } else {
        // Fallback default 5%
        platformFee = amount * 0.05;
      }
    } else {
      platformFee = amount * 0.05;
    }
    
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

    // Phase 3: Emit Event for Order/Token Automation
    this.eventsService.emit('payment.confirmed', {
      referenceId,
      referenceType,
      businessId,
      amount
    });

    return { status: 'success' };
  }
}


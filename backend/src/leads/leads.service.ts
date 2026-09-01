import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.lead.create({
      data: {
        buyerId: data.buyerId,
        sellerId: data.sellerId,
        productId: data.productId,
        message: data.message,
        quantityRequested: parseInt(data.quantityRequested, 10),
        status: 'PENDING'
      }
    });
  }

  findAllForSeller(sellerId: string) {
    return this.prisma.lead.findMany({
      where: { sellerId },
      include: {
        buyer: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true, image: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  updateStatus(id: string, status: string) {
    return this.prisma.lead.update({
      where: { id },
      data: { status }
    });
  }
}

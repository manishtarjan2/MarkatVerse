import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

import { PrismaService } from '../prisma.service.js';
import { IdGeneratorService } from '../id-generator/id-generator.service.js';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private idGenerator: IdGeneratorService
  ) {}

  async create(createUserDto: any) {
    const markatId = await this.idGenerator.generateUserId();
    return this.prisma.user.create({ 
      data: { ...createUserDto, markatId } 
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: string, updateUserDto: any) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    // 1. Delete ServiceQueues and related
    const queues = await this.prisma.serviceQueue.findMany({ where: { sellerId: id } });
    const queueIds = queues.map(q => q.id);
    if (queueIds.length > 0) {
      await this.prisma.serviceBooking.deleteMany({ where: { queueId: { in: queueIds } } });
      await this.prisma.serviceStaff.deleteMany({ where: { queueId: { in: queueIds } } });
      await this.prisma.serviceResource.deleteMany({ where: { queueId: { in: queueIds } } });
      await this.prisma.serviceQueue.deleteMany({ where: { sellerId: id } });
    }

    // 2. Delete Businesses and related
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

    // 3. Delete Leads
    await this.prisma.lead.deleteMany({ where: { OR: [{ buyerId: id }, { sellerId: id }] } });

    // 4. Delete Products
    await this.prisma.product.deleteMany({ where: { sellerId: id } });

    // 5. Delete Listings
    await this.prisma.listing.deleteMany({ where: { sellerId: id } });

    // Delete the user itself
    return this.prisma.user.delete({ where: { id } });
  }
}

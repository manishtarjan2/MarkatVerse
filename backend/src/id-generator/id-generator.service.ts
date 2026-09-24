import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class IdGeneratorService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generates a new unique custom ID by incrementing a counter in MongoDB.
   * @param type The type of ID to generate (e.g. "User", "Business", "Order")
   * @param prefix The prefix for the ID (e.g. "MV-", "BUS-", "ORD-")
   * @param base The base number to add the sequence to (e.g. 100000)
   * @returns The generated custom string ID
   */
  private async getNextId(type: string, prefix: string, base: number = 0): Promise<string> {
    const counter = await this.prisma.counter.upsert({
      where: { id: type },
      update: { seq: { increment: 1 } },
      create: { id: type, seq: 1 },
    });
    
    return `${prefix}${base + counter.seq}`;
  }

  async generateUserId(): Promise<string> {
    return this.getNextId('User', 'MV-', 10000000);
  }

  async generateBusinessId(): Promise<string> {
    return this.getNextId('Business', 'BUS-', 1000);
  }

  async generateStaffId(): Promise<string> {
    return this.getNextId('Staff', 'STAFF-', 2000);
  }

  async generateOrderId(): Promise<string> {
    return this.getNextId('Order', 'ORD-', 50000);
  }

  async generateBookingId(isToken: boolean = false): Promise<string> {
    if (isToken) {
      return this.getNextId('Token', 'TOKEN-', 3000);
    }
    return this.getNextId('Booking', 'BOOK-', 8000);
  }

  async generateAuditLogId(): Promise<string> {
    return this.getNextId('AuditLog', 'AUD-', 10000);
  }
}

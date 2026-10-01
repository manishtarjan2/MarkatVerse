import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class DisputesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.dispute.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(data: { title: string; description?: string }) {
    return this.prisma.dispute.create({
      data: {
        title: data.title,
        description: data.description || '',
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.dispute.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    return this.prisma.dispute.delete({
      where: { id },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class ComplaintsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.complaint.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.complaint.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.complaint.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.complaint.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.complaint.delete({ where: { id } });
  }
}

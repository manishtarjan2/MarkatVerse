import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkflowsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.WorkflowCreateInput) {
    return this.prisma.workflow.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.workflow.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id },
    });
    if (!workflow) throw new NotFoundException(`Workflow with ID ${id} not found`);
    return workflow;
  }

  async update(id: string, data: Prisma.WorkflowUpdateInput) {
    return this.prisma.workflow.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.workflow.delete({
      where: { id },
    });
  }
}

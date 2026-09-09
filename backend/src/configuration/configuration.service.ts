import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { MainType } from '@prisma/client';

@Injectable()
export class ConfigurationService {
  constructor(private prisma: PrismaService) {}

  // --- Business Types ---
  async getBusinessTypes(mainType?: MainType) {
    return this.prisma.businessType.findMany({
      where: mainType ? { mainType } : undefined,
      include: { sectors: true },
    });
  }

  async createBusinessType(data: { mainType: MainType; name: string; description?: string }) {
    return this.prisma.businessType.create({ data });
  }

  // --- Sectors ---
  async getSectors(businessTypeId?: string) {
    return this.prisma.sector.findMany({
      where: businessTypeId ? { businessTypeId } : undefined,
      include: { categories: true },
    });
  }

  async createSector(data: { businessTypeId: string; name: string; description?: string }) {
    return this.prisma.sector.create({ data });
  }

  // --- Categories ---
  async getCategories(sectorId?: string) {
    return this.prisma.category.findMany({
      where: sectorId ? { sectorId } : undefined,
    });
  }

  async createCategory(data: { sectorId: string; name: string; parentId?: string }) {
    return this.prisma.category.create({ data });
  }

  // --- Workflows ---
  async getWorkflows() {
    return this.prisma.workflow.findMany();
  }

  async createWorkflow(data: { name: string; description?: string; steps: any }) {
    return this.prisma.workflow.create({ data });
  }
}

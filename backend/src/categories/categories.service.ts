import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.category.create({
      data: {
        name: data.name,
        theme: data.theme,
        icon: data.icon,
        primaryType: data.primaryType,
        allowedListingTypes: data.allowedListingTypes || [],
        businessModels: data.businessModels || [],
        workflow: data.workflow,
        allowedFeatures: data.allowedFeatures || [],
        notApplicable: data.notApplicable || [],
        optionalFeatures: data.optionalFeatures || [],
        parameters: data.parameters || [],
        subcategories: data.subcategories || [],
        defaultCommissionRate: data.defaultCommissionRate ?? 5.0,
        defaultFlatRate: data.defaultFlatRate ?? 999.0
      }
    });
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  findOne(id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  update(id: string, data: any) {
    return this.prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        theme: data.theme,
        icon: data.icon,
        primaryType: data.primaryType,
        allowedListingTypes: data.allowedListingTypes,
        businessModels: data.businessModels,
        workflow: data.workflow,
        allowedFeatures: data.allowedFeatures,
        notApplicable: data.notApplicable,
        optionalFeatures: data.optionalFeatures,
        parameters: data.parameters,
        subcategories: data.subcategories,
        defaultCommissionRate: data.defaultCommissionRate,
        defaultFlatRate: data.defaultFlatRate
      }
    });
  }

  remove(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }

  async applyBillingDefaults(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new Error('Category not found');

    const products = await this.prisma.product.findMany({
      where: { categoryId: id },
      select: { sellerId: true }
    });
    
    const sellerIds = [...new Set(products.map(p => p.sellerId).filter(Boolean))] as string[];
    
    if (sellerIds.length === 0) return { updatedCount: 0 };

    // Businesses on PERCENTAGE
    const updatedCommission = await this.prisma.business.updateMany({
      where: { 
        userId: { in: sellerIds },
        commissionType: 'PERCENTAGE'
      },
      data: {
        commissionRate: category.defaultCommissionRate ?? 5.0
      }
    });

    // Businesses on FIXED
    const updatedFlat = await this.prisma.business.updateMany({
      where: {
        userId: { in: sellerIds },
        commissionType: 'FIXED'
      },
      data: {
        commissionRate: category.defaultFlatRate ?? 999.0
      }
    });

    return { 
      updatedCount: updatedCommission.count + updatedFlat.count 
    };
  }
}

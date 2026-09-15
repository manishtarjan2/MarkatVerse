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
        subcategories: data.subcategories || []
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
        subcategories: data.subcategories
      }
    });
  }

  remove(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}

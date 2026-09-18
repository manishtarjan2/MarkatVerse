var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
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
    findOne(id) {
        return this.prisma.category.findUnique({ where: { id } });
    }
    update(id, data) {
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
    remove(id) {
        return this.prisma.category.delete({ where: { id } });
    }
    async applyBillingDefaults(id) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category)
            throw new Error('Category not found');
        const products = await this.prisma.product.findMany({
            where: { categoryId: id },
            select: { sellerId: true }
        });
        const sellerIds = [...new Set(products.map(p => p.sellerId).filter(Boolean))];
        if (sellerIds.length === 0)
            return { updatedCount: 0 };
        const updatedCommission = await this.prisma.business.updateMany({
            where: {
                userId: { in: sellerIds },
                commissionType: 'PERCENTAGE'
            },
            data: {
                commissionRate: category.defaultCommissionRate ?? 5.0
            }
        });
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
};
CategoriesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], CategoriesService);
export { CategoriesService };
//# sourceMappingURL=categories.service.js.map
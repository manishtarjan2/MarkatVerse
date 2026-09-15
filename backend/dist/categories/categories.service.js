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
                subcategories: data.subcategories || []
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
                subcategories: data.subcategories
            }
        });
    }
    remove(id) {
        return this.prisma.category.delete({ where: { id } });
    }
};
CategoriesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], CategoriesService);
export { CategoriesService };
//# sourceMappingURL=categories.service.js.map
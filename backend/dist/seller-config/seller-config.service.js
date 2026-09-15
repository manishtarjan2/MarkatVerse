var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
let SellerConfigService = class SellerConfigService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSellerCapabilities(userId) {
        const business = await this.prisma.business.findUnique({
            where: { userId },
            include: {
                features: {
                    include: {
                        feature: true
                    }
                }
            }
        });
        if (!business) {
            throw new NotFoundException('Business not found for this user');
        }
        const activeFeatures = business.features
            .filter((f) => f.isActive)
            .map((f) => f.feature.key);
        return {
            businessId: business.id,
            capabilities: business.capabilities,
            features: activeFeatures,
            businessType: business.businessType,
            businessModel: business.businessModel
        };
    }
    async updateSellerCapabilities(businessId, requestedFeatures) {
        const registryFeatures = await this.prisma.featureRegistry.findMany({
            where: {
                key: { in: requestedFeatures }
            }
        });
        const foundKeys = registryFeatures.map(f => f.key);
        const invalidFeatures = requestedFeatures.filter(f => !foundKeys.includes(f));
        if (invalidFeatures.length > 0) {
            throw new BadRequestException(`Invalid features requested: ${invalidFeatures.join(', ')}`);
        }
        for (const feature of registryFeatures) {
            if (feature.requires && feature.requires.length > 0) {
                const missingDeps = feature.requires.filter(req => !requestedFeatures.includes(req));
                if (missingDeps.length > 0) {
                    throw new BadRequestException(`Feature ${feature.key} requires: ${missingDeps.join(', ')}`);
                }
            }
        }
        await this.prisma.businessFeature.updateMany({
            where: { businessId },
            data: { isActive: false }
        });
        for (const key of requestedFeatures) {
            await this.prisma.businessFeature.upsert({
                where: {
                    businessId_featureKey: {
                        businessId,
                        featureKey: key
                    }
                },
                update: { isActive: true },
                create: {
                    businessId,
                    featureKey: key,
                    isActive: true
                }
            });
        }
        return this.getSellerCapabilitiesByBusiness(businessId);
    }
    async getSellerCapabilitiesByBusiness(businessId) {
        const business = await this.prisma.business.findUnique({
            where: { id: businessId }
        });
        if (!business)
            throw new NotFoundException('Business not found');
        return this.getSellerCapabilities(business.userId);
    }
};
SellerConfigService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], SellerConfigService);
export { SellerConfigService };
//# sourceMappingURL=seller-config.service.js.map
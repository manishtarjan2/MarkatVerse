import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class SellerConfigService {
  constructor(private prisma: PrismaService) {}

  async getSellerCapabilities(userId: string) {
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
      .filter((f: any) => f.isActive)
      .map((f: any) => f.feature.key);

    return {
      businessId: business.id,
      capabilities: business.capabilities, // Legacy array
      features: activeFeatures, // New structured features
      businessType: business.businessType,
      businessModel: business.businessModel
    };
  }

  async updateSellerCapabilities(businessId: string, requestedFeatures: string[]) {
    // 1. Fetch requested feature definitions from registry
    const registryFeatures = await this.prisma.featureRegistry.findMany({
      where: {
        key: { in: requestedFeatures }
      }
    });

    const foundKeys = registryFeatures.map(f => f.key);
    
    // Check if any requested feature is invalid
    const invalidFeatures = requestedFeatures.filter(f => !foundKeys.includes(f));
    if (invalidFeatures.length > 0) {
      throw new BadRequestException(`Invalid features requested: ${invalidFeatures.join(', ')}`);
    }

    // 2. Validate Capability Dependencies
    for (const feature of registryFeatures) {
      if (feature.requires && feature.requires.length > 0) {
        const missingDeps = feature.requires.filter(req => !requestedFeatures.includes(req));
        if (missingDeps.length > 0) {
          throw new BadRequestException(`Feature ${feature.key} requires: ${missingDeps.join(', ')}`);
        }
      }
    }

    // 3. Update the business features
    // First, deactivate all existing features
    await this.prisma.businessFeature.updateMany({
      where: { businessId },
      data: { isActive: false }
    });

    // Upsert the new features
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

  private async getSellerCapabilitiesByBusiness(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId }
    });
    if (!business) throw new NotFoundException('Business not found');
    return this.getSellerCapabilities(business.userId);
  }
}


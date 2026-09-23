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
let SystemConfigService = class SystemConfigService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSeoConfig() {
        const titleConfig = await this.prisma.systemConfig.findUnique({ where: { key: 'SEO_TITLE' } });
        const descConfig = await this.prisma.systemConfig.findUnique({ where: { key: 'SEO_DESCRIPTION' } });
        return {
            title: titleConfig?.value || 'MARKATVERSE - Everything. Everyone. Everywhere.',
            description: descConfig?.value || 'The global marketplace connecting people, businesses and opportunities.',
        };
    }
    async updateSeoConfig(data) {
        await this.prisma.systemConfig.upsert({
            where: { key: 'SEO_TITLE' },
            update: { value: data.title },
            create: { key: 'SEO_TITLE', value: data.title, description: 'Global SEO Title' },
        });
        await this.prisma.systemConfig.upsert({
            where: { key: 'SEO_DESCRIPTION' },
            update: { value: data.description },
            create: { key: 'SEO_DESCRIPTION', value: data.description, description: 'Global SEO Description' },
        });
        return this.getSeoConfig();
    }
    async getAuthConfig() {
        const email = await this.prisma.systemConfig.findUnique({ where: { key: 'AUTH_ENABLE_EMAIL' } });
        const phone = await this.prisma.systemConfig.findUnique({ where: { key: 'AUTH_ENABLE_PHONE' } });
        const google = await this.prisma.systemConfig.findUnique({ where: { key: 'AUTH_ENABLE_GOOGLE' } });
        const twofa = await this.prisma.systemConfig.findUnique({ where: { key: 'AUTH_REQUIRE_2FA' } });
        return {
            enableEmail: email?.value !== 'false',
            enablePhone: phone?.value === 'true',
            enableGoogle: google?.value === 'true',
            require2FA: twofa?.value === 'true',
        };
    }
    async updateAuthConfig(data) {
        const updates = [
            { key: 'AUTH_ENABLE_EMAIL', value: String(data.enableEmail) },
            { key: 'AUTH_ENABLE_PHONE', value: String(data.enablePhone) },
            { key: 'AUTH_ENABLE_GOOGLE', value: String(data.enableGoogle) },
            { key: 'AUTH_REQUIRE_2FA', value: String(data.require2FA) },
        ];
        for (const item of updates) {
            await this.prisma.systemConfig.upsert({
                where: { key: item.key },
                update: { value: item.value },
                create: { key: item.key, value: item.value, description: 'Auth config ' + item.key },
            });
        }
        return this.getAuthConfig();
    }
};
SystemConfigService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], SystemConfigService);
export { SystemConfigService };
//# sourceMappingURL=system-config.service.js.map
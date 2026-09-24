import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class SystemConfigService {
  constructor(private prisma: PrismaService) {}

  async getSeoConfig() {
    const titleConfig = await this.prisma.systemConfig.findUnique({ where: { key: 'SEO_TITLE' } });
    const descConfig = await this.prisma.systemConfig.findUnique({ where: { key: 'SEO_DESCRIPTION' } });

    return {
      title: titleConfig?.value || 'MARKATVERSE - Everything. Everyone. Everywhere.',
      description: descConfig?.value || 'The global marketplace connecting people, businesses and opportunities.',
    };
  }

  async updateSeoConfig(data: { title: string; description: string }) {
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
      enableEmail: email?.value !== 'false', // Default true
      enablePhone: phone?.value === 'true',  // Default false
      enableGoogle: google?.value === 'true', // Default false
      require2FA: twofa?.value === 'true',   // Default false
    };
  }

  async updateAuthConfig(data: { enableEmail: boolean; enablePhone: boolean; enableGoogle: boolean; require2FA: boolean }) {
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

  // --- Payment Config (Dynamic JSON) ---

  async getPaymentMethods() {
    const record = await this.prisma.systemConfig.findUnique({ where: { key: 'PAYMENT_METHODS' } });
    if (!record) return [];
    try {
      return JSON.parse(record.value);
    } catch {
      return [];
    }
  }

  async savePaymentMethods(methods: any[]) {
    await this.prisma.systemConfig.upsert({
      where: { key: 'PAYMENT_METHODS' },
      update: { value: JSON.stringify(methods) },
      create: { key: 'PAYMENT_METHODS', value: JSON.stringify(methods), description: 'Dynamic Payment Methods' },
    });
    return methods;
  }

  async addPaymentMethod(data: any) {
    const methods = await this.getPaymentMethods();
    const newMethod = {
      ...data,
      id: 'PMT-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      updatedAt: new Date().toISOString()
    };
    methods.push(newMethod);
    return this.savePaymentMethods(methods);
  }

  async updatePaymentMethod(id: string, data: any) {
    const methods = await this.getPaymentMethods();
    const index = methods.findIndex((m: any) => m.id === id);
    if (index === -1) throw new Error('Payment method not found');
    methods[index] = { ...methods[index], ...data, id, updatedAt: new Date().toISOString() };
    return this.savePaymentMethods(methods);
  }

  async deletePaymentMethod(id: string) {
    const methods = await this.getPaymentMethods();
    const filtered = methods.filter((m: any) => m.id !== id);
    return this.savePaymentMethods(filtered);
  }
}

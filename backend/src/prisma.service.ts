import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // In serverless, it's better to let Prisma connect lazily
    // to avoid blocking the entire app's bootstrap on cold starts.
  }
}

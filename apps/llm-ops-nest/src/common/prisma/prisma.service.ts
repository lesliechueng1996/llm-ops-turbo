import { Injectable, type OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@repo/lib-prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}

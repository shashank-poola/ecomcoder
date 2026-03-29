import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { db } from '../../database/src/index';

export type AppPrismaClient = typeof db;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  /** Single shared Prisma client from `database/src/index.ts` */
  readonly client: AppPrismaClient = db;

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { db } from '../database/src/index';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Reuse the singleton created in database/src/index.ts — no duplicate connections
  readonly client = db;

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}

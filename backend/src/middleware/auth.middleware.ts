import { Injectable, NestMiddleware, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StoreAuthMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const storeId = req.headers['x-store-id'] as string;
    const userId = req.headers['x-user-id'] as string;

    if (!storeId || !userId) {
      throw new UnauthorizedException('x-store-id and x-user-id headers are required');
    }

    const store = await this.prisma.client.store.findUnique({
      where: { id: storeId },
      select: { ownerId: true },
    });

    if (!store) {
      throw new ForbiddenException('Store not found');
    }

    if (store.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    req.storeId = storeId;
    req.userId = userId;
    next();
  }
}

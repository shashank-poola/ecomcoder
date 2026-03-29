import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev_jwt_secret_change_in_production';

function allowHeaderAuth(): boolean {
  if (process.env.ALLOW_HEADER_AUTH === 'false') return false;
  if (process.env.ALLOW_HEADER_AUTH === 'true') return true;

  return process.env.NODE_ENV !== 'production';
}

@Injectable()
export class StoreAuthMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]!;
      try {
        const decoded = jwt.verify(
          token, 
          JWT_SECRET
        ) as { 
          storeId: string; 
          userId: string 
        };

        req.storeId = decoded.storeId;
        req.userId = decoded.userId;

        next();
        
        return;
      } catch {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }

    if (allowHeaderAuth()) {
      const storeId = req.headers['x-store-id'];
      const userId = req.headers['x-user-id'];
      if (typeof storeId === 'string' && storeId.length > 0 && typeof userId === 'string' && userId.length > 0) {
        req.storeId = storeId;
        req.userId = userId;
        next();
        return;
      }
    }

    throw new UnauthorizedException(
      'Send Authorization: Bearer <token> from POST /api/v1/auth/login, or x-store-id and x-user-id (dev only).',
    );
  }
}

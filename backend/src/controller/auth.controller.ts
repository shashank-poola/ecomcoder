import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaService } from '../service/prisma.service';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { loginSchema } from '../schema/login.schema';
import type { LoginDto } from '../schema/login.schema';
import { AUTH_ROUTES } from '../routes/auth.route';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev_jwt_secret_change_in_production';

@Controller(AUTH_ROUTES.BASE)
export class AuthController {
  constructor(private readonly prisma: PrismaService) {}

  @Post(AUTH_ROUTES.LOGIN)
  @HttpCode(HttpStatus.OK)
  async login(@Body(new ZodValidationPipe(loginSchema)) body: LoginDto) {
    const store = await this.prisma.client.store.findUnique({
      where: { id: body.storeId },
    });

    if (!store?.apiSecret) {
      return { success: false, data: null, error: 'INVALID_CREDENTIALS' };
    }

    const valid = await bcrypt.compare(body.apiSecret, store.apiSecret);
    if (!valid) {
      return { success: false, data: null, error: 'INVALID_CREDENTIALS' };
    }

    const token = jwt.sign(
      { storeId: store.id, userId: store.ownerId },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    return {
      success: true,
      data: { token, storeId: store.id },
      error: null,
    };
  }
}

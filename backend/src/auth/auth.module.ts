import { Module } from '@nestjs/common';
import { DatabaseModule } from '../service/database.module';
import { AuthController } from '../controller/auth.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
})
export class AuthModule {}

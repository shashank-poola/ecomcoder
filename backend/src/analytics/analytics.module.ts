import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { AnalyticsController } from '../controllers/analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}

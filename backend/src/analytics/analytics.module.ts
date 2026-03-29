import { Module } from '@nestjs/common';
import { DatabaseModule } from '../service/database.module';
import { AnalyticsController } from '../controller/analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}

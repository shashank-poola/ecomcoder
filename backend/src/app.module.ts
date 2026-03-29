import { Module, MiddlewareConsumer } from '@nestjs/common';
import { DatabaseModule } from './service/database.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './controller/health.controller';
import { AnalyticsController } from './controller/analytics.controller';
import { StoreAuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [DatabaseModule, AnalyticsModule, AuthModule],
  controllers: [HealthController],
  providers: [StoreAuthMiddleware],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(StoreAuthMiddleware).forRoutes(AnalyticsController);
  }
}

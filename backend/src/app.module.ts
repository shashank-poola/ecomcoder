import { Module, MiddlewareConsumer } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AnalyticsController } from './controllers/analytics.controller';
import { StoreAuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [DatabaseModule, AnalyticsModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply multi-tenant auth to every analytics route
    consumer.apply(StoreAuthMiddleware).forRoutes(AnalyticsController);
  }
}

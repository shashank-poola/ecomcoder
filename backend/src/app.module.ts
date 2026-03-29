import { Module, MiddlewareConsumer } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { AnalyticsController } from './analytics/analytics.controller';
import { StoreAuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [DatabaseModule, AnalyticsModule, AuthModule],
  providers: [StoreAuthMiddleware],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(StoreAuthMiddleware).forRoutes(AnalyticsController);
  }
}

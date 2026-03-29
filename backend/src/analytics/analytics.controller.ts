import {
  Controller,
  Get,
  Req,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { dateRangeSchema } from '../schema/date-range.schema';
import type { DateRangeDto } from '../schema/date-range.schema';
import { paginationSchema } from '../schema/pagination.schema';
import type { PaginationDto } from '../schema/pagination.schema';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import type { DateRange } from '../types/analytics.types';

/**
 * Store analytics API. Paths are under the global prefix /api/v1.
 * Auth: Bearer JWT from POST /auth/login, or x-store-id + x-user-id (non-production).
 */
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('overview')
  @HttpCode(HttpStatus.OK)
  async overview(
    @Req() req: Request,
    @Query(new ZodValidationPipe(dateRangeSchema)) query: DateRangeDto,
  ) {
    const range = this.parseDateRange(query);
    const data = await this.analytics.getOverview(req.storeId, range);
    return { success: true, data, error: null };
  }

  @Get('top-products')
  @HttpCode(HttpStatus.OK)
  async topProducts(
    @Req() req: Request,
    @Query(new ZodValidationPipe(dateRangeSchema)) query: DateRangeDto,
  ) {
    const range = this.parseDateRange(query);
    const data = await this.analytics.getTopProducts(req.storeId, range);
    return { success: true, data, error: null };
  }

  @Get('recent-activity')
  @HttpCode(HttpStatus.OK)
  async recentActivity(
    @Req() req: Request,
    @Query(new ZodValidationPipe(paginationSchema)) query: PaginationDto,
  ) {
    const data = await this.analytics.getRecentActivity(req.storeId, query.limit ?? 20);
    return { success: true, data, error: null };
  }

  @Get('daily-revenue')
  @HttpCode(HttpStatus.OK)
  async dailyRevenue(@Req() req: Request) {
    const data = await this.analytics.getDailyRevenue(req.storeId);
    return { success: true, data, error: null };
  }

  private parseDateRange(query: DateRangeDto): DateRange | undefined {
    if (query.from && query.to) return { from: query.from, to: query.to };
    if (query.from || query.to) {
      throw new BadRequestException('Both "from" and "to" are required for a date range');
    }
    return undefined;
  }
}

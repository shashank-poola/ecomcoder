import { Controller, Get, Req, Query, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { AnalyticsService } from '../analytics/analytics.service';
import { DateRangeDto } from '../schema/date-range.schema';
import { PaginationDto } from '../schema/pagination.schema';
import { ANALYTICS_ROUTES } from '../routes/analytics.routes';
import type { DateRange } from '../types/analytics.types';

@Controller(ANALYTICS_ROUTES.BASE)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get(ANALYTICS_ROUTES.OVERVIEW)
  @HttpCode(HttpStatus.OK)
  async getOverview(@Req() req: Request, @Query() query: DateRangeDto) {
    const dateRange = this.resolveDateRange(query);
    const data = await this.analyticsService.getOverview(req.storeId, dateRange);
    return { success: true, storeId: req.storeId, data };
  }

  @Get(ANALYTICS_ROUTES.TOP_PRODUCTS)
  @HttpCode(HttpStatus.OK)
  async getTopProducts(@Req() req: Request, @Query() query: DateRangeDto) {
    const dateRange = this.resolveDateRange(query);
    const data = await this.analyticsService.getTopProducts(req.storeId, dateRange);
    return { success: true, storeId: req.storeId, data };
  }

  @Get(ANALYTICS_ROUTES.RECENT_ACTIVITY)
  @HttpCode(HttpStatus.OK)
  async getRecentActivity(@Req() req: Request, @Query() query: PaginationDto) {
    const data = await this.analyticsService.getRecentActivity(req.storeId, query.limit ?? 20);
    return { success: true, storeId: req.storeId, count: data.length, data };
  }

  @Get(ANALYTICS_ROUTES.DAILY_REVENUE)
  @HttpCode(HttpStatus.OK)
  async getDailyRevenue(@Req() req: Request) {
    const data = await this.analyticsService.getDailyRevenue(req.storeId);
    return { success: true, storeId: req.storeId, data };
  }

  private resolveDateRange(query: DateRangeDto): DateRange | undefined {
    if (query.from && query.to) return { from: query.from, to: query.to };
    if (query.from || query.to) {
      throw new BadRequestException('Both "from" and "to" are required for a date range');
    }
    return undefined;
  }
}

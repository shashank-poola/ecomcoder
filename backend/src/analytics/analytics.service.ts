import { Injectable } from '@nestjs/common';
import { PrismaService } from '../service/prisma.service';
import type {
  OverviewResponse,
  EventCounts,
  TopProduct,
  RecentEvent,
  DateRange,
  DailyRevenue,
} from '../types/analytics.types';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  private getDefaultDateBoundaries() {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return {
      todayStart,
      weekStart: new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000),
      monthStart: new Date(todayStart.getTime() - 29 * 24 * 60 * 60 * 1000),
    };
  }

  async getOverview(storeId: string, dateRange?: DateRange): Promise<OverviewResponse> {
    const { todayStart, weekStart, monthStart } = this.getDefaultDateBoundaries();
    const eventFilter = dateRange
      ? { gte: new Date(dateRange.from), lte: new Date(dateRange.to) }
      : undefined;

    const [todayAgg, weekAgg, monthAgg, rawCounts] = await Promise.all([
      this.prisma.client.dailyAggregate.aggregate({
        where: { storeId, date: { gte: todayStart } },
        _sum: { totalRevenue: true },
      }),
      this.prisma.client.dailyAggregate.aggregate({
        where: { storeId, date: { gte: weekStart } },
        _sum: { totalRevenue: true },
      }),
      this.prisma.client.dailyAggregate.aggregate({
        where: { storeId, date: { gte: monthStart } },
        _sum: { totalRevenue: true },
      }),
      this.prisma.client.event.groupBy({
        by: ['eventType'],
        where: { storeId, ...(eventFilter && { timestamp: eventFilter }) },
        _count: { _all: true },
      }),
    ]);

    const eventCounts: EventCounts = {
      page_view: 0,
      add_to_cart: 0,
      remove_from_cart: 0,
      checkout_started: 0,
      purchase: 0,
    };

    for (const row of rawCounts) {
      eventCounts[row.eventType] = row._count._all;
    }

    const totalPurchases = eventCounts.purchase;
    const totalPageViews = eventCounts.page_view || 1;

    return {
      revenue: {
        today: Number(todayAgg._sum.totalRevenue ?? 0),
        thisWeek: Number(weekAgg._sum.totalRevenue ?? 0),
        thisMonth: Number(monthAgg._sum.totalRevenue ?? 0),
      },
      eventCounts,
      conversionRate: parseFloat(((totalPurchases / totalPageViews) * 100).toFixed(2)),
      totalPurchases,
      totalPageViews,
    };
  }

  async getTopProducts(storeId: string, dateRange?: DateRange): Promise<TopProduct[]> {
    const { monthStart } = this.getDefaultDateBoundaries();

    const rows = await this.prisma.client.event.groupBy({
      by: ['productId'],
      where: {
        storeId,
        eventType: 'purchase',
        productId: { not: null },
        timestamp: {
          gte: dateRange ? new Date(dateRange.from) : monthStart,
          ...(dateRange && { lte: new Date(dateRange.to) }),
        },
      },
      _sum: { amount: true },
      _count: { _all: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 10,
    });

    return rows
      .filter((r) => r.productId !== null)
      .map((r, i) => ({
        productId: r.productId as string,
        totalRevenue: Number(r._sum.amount ?? 0),
        orderCount: r._count._all,
        rank: i + 1,
      }));
  }

  async getRecentActivity(storeId: string, limit = 20): Promise<RecentEvent[]> {
    const events = await this.prisma.client.event.findMany({
      where: { storeId },
      orderBy: { timestamp: 'desc' },
      take: limit,
      select: { id: true, eventType: true, timestamp: true, productId: true, amount: true, currency: true },
    });

    return events.map((e) => ({ ...e, amount: e.amount ? Number(e.amount) : null }));
  }

  async getDailyRevenue(storeId: string): Promise<DailyRevenue[]> {
    const { monthStart } = this.getDefaultDateBoundaries();

    const rows = await this.prisma.client.dailyAggregate.findMany({
      where: { storeId, date: { gte: monthStart } },
      orderBy: { date: 'asc' },
      select: { date: true, totalRevenue: true },
    });

    return rows.map((r) => ({
      date: r.date.toISOString().split('T')[0] as string,
      revenue: Number(r.totalRevenue),
    }));
  }
}

export interface RevenueBreakdown {
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export interface EventCounts {
  page_view: number;
  add_to_cart: number;
  remove_from_cart: number;
  checkout_started: number;
  purchase: number;
  [key: string]: number;
}

export interface OverviewResponse {
  revenue: RevenueBreakdown;
  eventCounts: EventCounts;
  conversionRate: number;
  totalPurchases: number;
  totalPageViews: number;
}

export interface TopProduct {
  productId: string;
  totalRevenue: number;
  orderCount: number;
  rank: number;
}

export interface RecentEvent {
  id: string;
  eventType: string;
  timestamp: Date;
  productId: string | null;
  amount: number | null;
  currency: string | null;
}

export interface DateRange {
  from: string;
  to: string;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
}

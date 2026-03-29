export interface Store {
  id: string;
  name: string;
  userId: string;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
}

export interface TopProduct {
  productId: string;
  totalRevenue: number;
  orderCount: number;
  rank: number;
}

export interface EventCounts {
  page_view: number;
  add_to_cart: number;
  remove_from_cart: number;
  checkout_started: number;
  purchase: number;
}

export interface OverviewData {
  revenue: { today: number; thisWeek: number; thisMonth: number };
  eventCounts: EventCounts;
  conversionRate: number;
  totalPurchases: number;
  totalPageViews: number;
}

export interface RecentEvent {
  id: string;
  eventType: string;
  timestamp: string;
  productId: string | null;
  amount: number | null;
  currency: string | null;
}

export type TimeRangeId = '1h' | '24h' | '7d' | '30d';

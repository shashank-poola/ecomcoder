import type { OverviewData, TopProduct, RecentEvent, DailyRevenue } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

function headers(storeId: string, userId: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'x-store-id': storeId,
    'x-user-id': userId,
  };
}

function qs(params: Record<string, string | undefined>): string {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) u.set(k, v);
  }
  const s = u.toString();
  return s ? `?${s}` : '';
}

async function get<T>(
  path: string,
  storeId: string,
  userId: string,
  query?: Record<string, string | undefined>,
): Promise<T> {
  const res = await fetch(`${API_URL}/api/v1/analytics/${path}${query ? qs(query) : ''}`, {
    headers: headers(storeId, userId),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`${path} failed: ${res.status}`);
  const json = await res.json();
  return json.data as T;
}

export function rangeToDateQuery(range: string | undefined): { from: string; to: string } | undefined {
  if (!range || range === '30d') return undefined;
  const to = new Date();
  const toStr = to.toISOString().slice(0, 10);
  const from = new Date(to);
  if (range === '1h' || range === '24h') {
    from.setDate(from.getDate() - 1);
  } else if (range === '7d') {
    from.setDate(from.getDate() - 7);
  } else {
    return undefined;
  }
  const fromStr = from.toISOString().slice(0, 10);
  return { from: fromStr, to: toStr };
}

export const api = {
  overview: (storeId: string, userId: string, range?: string) => {
    const q = rangeToDateQuery(range);
    return get<OverviewData>('overview', storeId, userId, q);
  },

  topProducts: (storeId: string, userId: string, range?: string) => {
    const q = rangeToDateQuery(range);
    return get<TopProduct[]>('top-products', storeId, userId, q);
  },

  recentActivity: (storeId: string, userId: string) =>
    get<RecentEvent[]>('recent-activity', storeId, userId),

  dailyRevenue: (storeId: string, userId: string) =>
    get<DailyRevenue[]>('daily-revenue', storeId, userId),
};

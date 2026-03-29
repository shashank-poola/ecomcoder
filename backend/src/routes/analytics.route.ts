/**
 * Analytics route segments under /api/v1.
 * Mirrors: mainRouter.use("/analytics", analyticsRouter) with nested paths.
 */
export const ANALYTICS_ROUTES = {
  BASE: 'analytics',
  OVERVIEW: 'overview',
  TOP_PRODUCTS: 'top-products',
  RECENT_ACTIVITY: 'recent-activity',
  DAILY_REVENUE: 'daily-revenue',
} as const;

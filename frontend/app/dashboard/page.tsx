import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { api } from '@/lib/api';
import { STORES } from '@/constants/stores';
import { parseThemeCookie } from '@/lib/theme';
import { DashboardFilterProvider } from '@/components/dashboard/dashboard-filter-context';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ViewTabs } from '@/components/dashboard/view-tabs';
import { MetricCard } from '@/components/analytics/metric-card';
import { RevenueChart } from '@/components/analytics/revenue-chart';
import { ConversionFunnel } from '@/components/analytics/conversion-funnel';
import { ProductsLeaderboard } from '@/components/dashboard/products-leaderboard';
import { RecentActivity } from '@/components/analytics/recent-activity';

const sectionTitle = 'text-lg font-semibold tracking-tight text-[var(--swiss-fg)] sm:text-xl';
const sectionSub = 'mt-1 text-[13px] text-[var(--swiss-muted)]';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ store?: string; range?: string }>;
}) {
  const sp = await searchParams;
  const theme = parseThemeCookie((await cookies()).get('theme')?.value);
  const store = STORES.find((s) => s.id === sp.store) ?? STORES[0]!;
  const range = typeof sp.range === 'string' ? sp.range : undefined;

  const [overview, topProducts, recentActivity, dailyRevenue] = await Promise.all([
    api.overview(store.id, store.userId, range),
    api.topProducts(store.id, store.userId, range),
    api.recentActivity(store.id, store.userId),
    api.dailyRevenue(store.id, store.userId),
  ]);

  const { revenue, eventCounts, conversionRate } = overview;

  return (
    <DashboardFilterProvider>
      <div className="min-h-screen overflow-x-hidden text-[var(--swiss-fg)] antialiased">
        <DashboardHeader stores={STORES} activeStoreId={store.id} range={range} theme={theme} />

        <main className="mx-auto min-w-0 max-w-[1400px] px-3 py-5 sm:px-6 sm:py-8">
          <div className="mb-5 flex flex-col gap-2 border-b border-[var(--swiss-border)] pb-5 sm:mb-6 sm:pb-6">
            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight text-[var(--swiss-fg)] sm:text-2xl md:text-3xl">
                {store.name}
              </h1>
              <p className={`${sectionSub} mt-1 max-w-prose`}>
                Live performance · revenue, funnel, and storefront events (sample data)
              </p>
            </div>
          </div>

          <ViewTabs />

          <div id="overview" className="scroll-mt-24 pt-6">
            <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-[var(--swiss-dim)]">
              Overview
            </h2>
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Revenue today" value={revenue.today} type="currency" icon="today" />
              <MetricCard label="This week" value={revenue.thisWeek} type="currency" icon="week" />
              <MetricCard
                label="This month"
                value={revenue.thisMonth}
                type="currency"
                icon="month"
                accent="up"
              />
              <MetricCard
                label="Conversion rate"
                value={conversionRate}
                type="percent"
                icon="conversion"
                accent="up"
                subtitle={`${overview.totalPurchases.toLocaleString()} purchases · ${overview.totalPageViews.toLocaleString()} sessions`}
              />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
            <section id="revenue" className="panel scroll-mt-24 p-4 sm:p-6 lg:col-span-2">
              <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                  <h2 className={sectionTitle}>Revenue trend</h2>
                  <p className={sectionSub}>Daily net revenue · trailing 30 days</p>
                </div>
                <span className="w-fit border border-[var(--swiss-border)] px-2 py-0.5 font-mono text-[11px] text-[var(--swiss-dim)]">
                  30D
                </span>
              </div>
              <Suspense fallback={<div className="skeleton h-44 w-full border border-[var(--swiss-border)]" />}>
                <RevenueChart data={dailyRevenue} />
              </Suspense>
            </section>

            <section id="funnel" className="panel scroll-mt-24 p-4 sm:p-6">
              <h2 className={sectionTitle}>Conversion funnel</h2>
              <p className={`${sectionSub} mb-6`}>Session → cart → checkout → purchase</p>
              <ConversionFunnel eventCounts={eventCounts} />
            </section>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <section id="products" className="panel scroll-mt-24 p-4 sm:p-6">
              <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                  <h2 className={sectionTitle}>Top products</h2>
                  <p className={sectionSub}>By net revenue · respects range filter above</p>
                </div>
                <span className="text-[12px] text-[var(--swiss-dim)]">Top 10</span>
              </div>
              <ProductsLeaderboard products={topProducts} />
            </section>

            <section id="activity" className="panel scroll-mt-24 p-4 sm:p-6">
              <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                  <h2 className={sectionTitle}>Recent activity</h2>
                  <p className={sectionSub}>Latest events from this page load · refresh page to update</p>
                </div>
              </div>
              <RecentActivity events={recentActivity} />
            </section>
          </div>
        </main>
      </div>
    </DashboardFilterProvider>
  );
}

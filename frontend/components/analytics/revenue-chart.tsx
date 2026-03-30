'use client';

import type { DailyRevenue } from '@/types/store.types';
import { formatCurrency, formatDate } from '@/lib/utils';

export function RevenueChart({ data }: { data: DailyRevenue[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-[13px] text-[var(--swiss-muted)] sm:h-44">
        No revenue data
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-0 top-0 flex h-40 flex-col justify-between py-0.5 sm:h-44">
        {[maxRevenue, maxRevenue * 0.5, 0].map((v) => (
          <span key={v} className="font-mono text-[9px] tabular-nums text-[var(--swiss-dim)] sm:text-[10px]">
            {v > 0 ? formatCurrency(v) : '$0'}
          </span>
        ))}
      </div>

      <div className="pl-9 sm:pl-12">
        <div className="relative h-40 border-b border-[var(--swiss-border-strong)] sm:h-44">
          <div className="absolute inset-0 flex items-stretch gap-px">
            {data.map((d) => {
              const heightPct = (d.revenue / maxRevenue) * 100;
              const isEmpty = d.revenue === 0;
              return (
                <div
                  key={d.date}
                  title={`${formatDate(d.date)} · ${formatCurrency(d.revenue)}`}
                  className="flex min-h-0 min-w-[3px] flex-1 flex-col justify-end"
                >
                  <div
                    className="w-full"
                    style={{
                      height: isEmpty ? '2px' : `${heightPct}%`,
                      minHeight: isEmpty ? 2 : 4,
                      background: isEmpty ? 'var(--swiss-border)' : 'var(--swiss-fg)',
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-2 flex">
          {data.map((d, i) => (
            <div key={d.date} className="min-w-0 flex-1 text-center">
              {i % 5 === 0 && (
                <span className="text-[10px] text-[var(--swiss-dim)]">{formatDate(d.date)}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

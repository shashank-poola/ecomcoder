'use client';

import { useMemo } from 'react';
import { Star } from 'lucide-react';
import type { TopProduct } from '@/types/store.types';
import { productDisplay } from '@/lib/product-catalog';
import { formatCurrency, productTicker, pseudoPercentChange, pseudoTrendPoints } from '@/lib/utils';
import { Sparkline } from '@/components/charts/sparkline';
import { useDashboardFilter } from './dashboard-filter-context';

interface Props {
  products: TopProduct[];
}

function scoreLetter(rank: number, orders: number): { letter: string; className: string } {
  if (rank <= 2 && orders >= 8) return { letter: 'A', className: 'text-[var(--swiss-up)] border-[var(--swiss-up)]' };
  if (rank <= 5 && orders >= 4) return { letter: 'B', className: 'text-[var(--swiss-fg)] border-[var(--swiss-border-strong)]' };
  return { letter: 'C', className: 'text-[var(--swiss-muted)] border-[var(--swiss-border)]' };
}

export function ProductsLeaderboard({ products }: Props) {
  const { query: q, setQuery } = useDashboardFilter();

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter((p) => {
      const { name, sku } = productDisplay(p.productId);
      return (
        name.toLowerCase().includes(s) ||
        sku.toLowerCase().includes(s) ||
        p.productId.toLowerCase().includes(s)
      );
    });
  }, [products, q]);

  if (products.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center border border-dashed border-[var(--swiss-border)] text-[13px] text-[var(--swiss-muted)]">
        No purchase data in this range
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="relative flex md:hidden border border-[var(--swiss-border)] bg-[var(--swiss-surface)]">
        <input
          value={q}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="h-9 w-full bg-transparent px-3 text-[13px] text-[var(--swiss-fg)] placeholder:text-[var(--swiss-dim)] focus:outline-none"
        />
      </label>
      <div className="-mx-px overflow-x-auto overscroll-x-contain border border-[var(--swiss-border)] touch-pan-x">
        <table className="w-full min-w-[640px] border-collapse text-left text-[11px] sm:min-w-[720px] sm:text-[12px]">
          <thead>
            <tr className="border-b border-[var(--swiss-border)] text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--swiss-dim)]">
              <th className="w-10 px-2 py-2.5" aria-label="Watchlist" />
              <th className="w-10 px-1 py-2.5">#</th>
              <th className="min-w-[200px] py-2.5 pl-2 pr-4">Product</th>
              <th className="py-2.5 pr-4 text-right">Revenue</th>
              <th className="w-24 py-2.5">Trend</th>
              <th className="py-2.5 pr-4 text-right">Δ</th>
              <th className="py-2.5 pr-4 text-right">Orders</th>
              <th className="w-14 py-2.5 text-center">Score</th>
              <th className="w-20 py-2.5 pr-2 text-right" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const { name, sku } = productDisplay(p.productId);
              const pct = pseudoPercentChange(p.productId);
              const up = pct >= 0;
              const pts = pseudoTrendPoints(p.productId, 14);
              const { letter, className: scoreClass } = scoreLetter(p.rank, p.orderCount);
              return (
                <tr
                  key={p.productId}
                  className="border-b border-[var(--swiss-border)] transition-colors hover:bg-[var(--swiss-surface)]"
                >
                  <td className="px-2 py-2.5">
                    <button type="button" className="text-[var(--swiss-dim)] hover:text-[var(--swiss-fg)]" aria-label="Favorite">
                      <Star className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                  </td>
                  <td className="px-1 py-2.5 font-mono tabular-nums text-[var(--swiss-muted)]">{p.rank}</td>
                  <td className="py-2.5 pl-2 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--swiss-border)] bg-[var(--swiss-surface)] font-mono text-[10px] font-semibold text-[var(--swiss-fg)]">
                        {productTicker(p.productId)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-[var(--swiss-fg)]">{name}</div>
                        <div className="truncate font-mono text-[10px] text-[var(--swiss-dim)]">{sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4 text-right font-semibold tabular-nums text-[var(--swiss-fg)]">
                    {formatCurrency(p.totalRevenue)}
                  </td>
                  <td className="py-2">
                    <Sparkline points={pts} positive={up} />
                  </td>
                  <td
                    className={`py-2.5 pr-4 text-right font-mono tabular-nums ${up ? 'text-[var(--swiss-up)]' : 'text-[var(--swiss-down)]'}`}
                  >
                    {up ? '+' : ''}
                    {pct}%
                  </td>
                  <td className="py-2.5 pr-4 text-right tabular-nums text-[var(--swiss-muted)]">{p.orderCount}</td>
                  <td className="py-2.5 text-center">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center border font-mono text-[10px] font-bold ${scoreClass}`}
                      title="Velocity score (rank × orders)"
                    >
                      {letter}
                    </span>
                  </td>
                  <td className="py-2.5 pr-2 text-right">
                    <button
                      type="button"
                      className="border border-[var(--swiss-border)] px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-[var(--swiss-fg)] transition-colors hover:border-[var(--swiss-fg)]"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

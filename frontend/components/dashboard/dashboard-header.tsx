'use client';

import Link from 'next/link';
import { Search, Settings } from 'lucide-react';
import { useEffect } from 'react';
import { StoreSwitcher } from './store-switcher';
import { TimeRangeToggle } from './time-range-toggle';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useDashboardFilter } from './dashboard-filter-context';
import type { Store } from '@/types/store.types';
import type { ThemeMode } from '@/lib/theme';

interface Props {
  stores: Store[];
  activeStoreId: string;
  range?: string;
  theme: ThemeMode;
}

export function DashboardHeader({ stores, activeStoreId, range, theme }: Props) {
  const { query, setQuery } = useDashboardFilter();
  const logoSrc = theme === 'light' ? '/ecom/ecom.png' : '/ecom/ecom.png';

  const logoBlend =
    theme === 'dark'
      ? '[mix-blend-mode:lighten]'
      : '[mix-blend-mode:multiply] invert';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && e.target instanceof HTMLElement && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('dashboard-search')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--swiss-border)] bg-[var(--swiss-bg)]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard"
            className="shrink-0 bg-transparent outline-none ring-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="Ecom Analytics"
              width={280}
              height={80}
              decoding="async"
              fetchPriority="high"
              className={`block h-9 w-auto max-w-[min(200px,calc(100vw-10rem))] object-contain object-left sm:h-10 sm:max-w-[220px] md:h-11 lg:h-12 lg:max-w-[280px] ${logoBlend}`}
            />
          </Link>

          <label className="relative mx-4 hidden flex-1 items-center border border-[var(--swiss-border)] bg-[var(--swiss-surface)] sm:flex">
            <Search
              className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 shrink-0 text-[var(--swiss-muted)]"
              strokeWidth={1.5}
            />
            <input
              id="dashboard-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, SKUs…"
              className="h-9 min-w-0 w-full bg-transparent py-2 pl-8 pr-10 text-[13px] text-[var(--swiss-fg)] placeholder:text-[var(--swiss-dim)] focus:outline-none"
              autoComplete="off"
            />
            <kbd className="pointer-events-none absolute right-2.5 hidden rounded border border-[var(--swiss-border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--swiss-muted)] sm:inline">
              /
            </kbd>
          </label>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
            <span className="hidden shrink-0 text-[12px] font-medium tracking-wide text-[var(--swiss-muted)] lg:inline">
              Reports
            </span>
            <span className="hidden shrink-0 text-[12px] font-medium tracking-wide text-[var(--swiss-muted)] lg:inline">
              Team
            </span>
            <ThemeToggle initialTheme={theme} />
            <button
              type="button"
              className="shrink-0 text-[var(--swiss-muted)] hover:text-[var(--swiss-fg)]"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <div className="min-w-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <StoreSwitcher stores={stores} activeId={activeStoreId} range={range} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-[var(--swiss-border)] pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <p className="shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--swiss-dim)]">
            Commerce intelligence
          </p>
          <div className="min-w-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:shrink-0 [&::-webkit-scrollbar]:hidden">
            <TimeRangeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, Settings } from 'lucide-react';
import { useEffect } from 'react';
import { StoreSwitcher } from './store-switcher';
import { TimeRangeToggle } from './time-range-toggle';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useDashboardFilter } from './dashboard-filter-context';
import type { Store } from '@/app/lib/types';
import type { ThemeMode } from '@/app/lib/theme';

interface Props {
  stores: Store[];
  activeStoreId: string;
  range?: string;
  theme: ThemeMode;
}

export function DashboardHeader({ stores, activeStoreId, range, theme }: Props) {
  const { query, setQuery } = useDashboardFilter();
  const logoSrc = theme === 'light' ? '/ecom/blackecom.png' : '/ecom/ecom.png';

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
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-2.5">
            <Image
              src={logoSrc}
              alt="Ecom Analytics"
              width={280}
              height={80}
              className="h-11 w-auto max-w-[min(100%,260px)] sm:h-12 sm:max-w-[280px]"
              sizes="(max-width: 640px) 220px, 280px"
              priority
            />
          </Link>

          <div className="hidden min-w-0 flex-1 justify-center px-4 md:flex">
            <label className="relative flex w-full max-w-md items-center border border-[var(--swiss-border)] bg-[var(--swiss-surface)]">
              <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-[var(--swiss-muted)]" strokeWidth={1.5} />
              <input
                id="dashboard-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, SKUs…"
                className="h-9 w-full bg-transparent pl-8 pr-12 text-[13px] text-[var(--swiss-fg)] placeholder:text-[var(--swiss-dim)] focus:outline-none"
                autoComplete="off"
              />
              <kbd className="pointer-events-none absolute right-2.5 hidden rounded border border-[var(--swiss-border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--swiss-muted)] sm:inline">
                /
              </kbd>
            </label>
          </div>

          <div className="flex items-center gap-3 text-[12px] font-medium tracking-wide sm:gap-4">
            <span className="hidden text-[var(--swiss-muted)] lg:inline">Reports</span>
            <span className="hidden text-[var(--swiss-muted)] lg:inline">Team</span>
            <ThemeToggle initialTheme={theme} />
            <button type="button" className="text-[var(--swiss-muted)] hover:text-[var(--swiss-fg)]" aria-label="Settings">
              <Settings className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <StoreSwitcher stores={stores} activeId={activeStoreId} range={range} />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--swiss-border)] pt-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--swiss-dim)]">
            Commerce intelligence
          </p>
          <TimeRangeToggle />
        </div>
      </div>
    </header>
  );
}

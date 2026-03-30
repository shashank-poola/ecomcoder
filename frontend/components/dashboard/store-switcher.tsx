import Link from 'next/link';
import { Store as StoreIcon } from 'lucide-react';
import type { Store } from '@/types/store.types';

interface Props {
  stores: Store[];
  activeId: string;
  range?: string;
}

function hrefForStore(storeId: string, range?: string) {
  const p = new URLSearchParams();
  p.set('store', storeId);
  if (range) p.set('range', range);
  return `/dashboard?${p.toString()}`;
}

export function StoreSwitcher({ stores, activeId, range }: Props) {
  return (
    <div className="inline-flex max-w-full shrink-0 items-center gap-0.5 border border-[var(--swiss-border)] p-0.5 sm:gap-1">
      <span className="flex items-center justify-center px-2 text-[var(--swiss-muted)]" aria-hidden>
        <StoreIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
      </span>
      {stores.map((s) => {
        const active = s.id === activeId;
        const label = s.shortName ?? s.name;
        return (
          <Link
            key={s.id}
            href={hrefForStore(s.id, range)}
            title={s.name}
            className={[
              'whitespace-nowrap px-2 py-1 text-[11px] font-medium tracking-wide transition-colors sm:px-2.5',
              active
                ? 'bg-[var(--swiss-fg)] text-[var(--swiss-bg)]'
                : 'text-[var(--swiss-muted)] hover:text-[var(--swiss-fg)]',
            ].join(' ')}
            prefetch
          >
            <span className="sm:hidden">{label}</span>
            <span className="hidden sm:inline">{s.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

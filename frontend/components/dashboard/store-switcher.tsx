import Link from 'next/link';
import { Store as StoreIcon } from 'lucide-react';
import type { Store } from '@/app/lib/types';

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
    <div className="flex items-center gap-1 border border-[var(--swiss-border)] p-0.5">
      <span className="flex items-center justify-center px-2 text-[var(--swiss-muted)]" aria-hidden>
        <StoreIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
      </span>
      {stores.map((s) => {
        const active = s.id === activeId;
        return (
          <Link
            key={s.id}
            href={hrefForStore(s.id, range)}
            className={[
              'px-2.5 py-1 text-[11px] font-medium tracking-wide transition-colors',
              active
                ? 'bg-[var(--swiss-fg)] text-[var(--swiss-bg)]'
                : 'text-[var(--swiss-muted)] hover:text-[var(--swiss-fg)]',
            ].join(' ')}
            prefetch
          >
            {s.name}
          </Link>
        );
      })}
    </div>
  );
}

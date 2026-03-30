'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { TimeRangeId } from '@/types/store.types';

const RANGES: { id: TimeRangeId; label: string }[] = [
  { id: '1h', label: '1H' },
  { id: '24h', label: '24H' },
  { id: '7d', label: '7D' },
  { id: '30d', label: '30D' },
];

export function TimeRangeToggle() {
  const router = useRouter();
  const params = useSearchParams();
  const store = params.get('store') ?? '';
  const current = (params.get('range') as TimeRangeId) || '30d';

  function setRange(id: TimeRangeId) {
    const q = new URLSearchParams();
    if (store) q.set('store', store);
    q.set('range', id);
    router.push(`/dashboard?${q.toString()}`);
  }

  return (
    <div
      className="inline-flex shrink-0 border border-[var(--swiss-border)]"
      role="group"
      aria-label="Time range"
    >
      {RANGES.map(({ id, label }) => {
        const active = current === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setRange(id)}
            className={[
              'min-h-9 min-w-9 shrink-0 px-2 py-1.5 text-[11px] font-medium tracking-wide transition-colors sm:min-w-0 sm:px-2.5 sm:py-1',
              active
                ? 'bg-[var(--swiss-fg)] text-[var(--swiss-bg)]'
                : 'text-[var(--swiss-muted)] hover:text-[var(--swiss-fg)]',
            ].join(' ')}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

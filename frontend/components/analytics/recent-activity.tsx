import { MousePointerClick, ShoppingCart, CreditCard, Package, Trash2 } from 'lucide-react';
import type { RecentEvent } from '@/app/lib/types';
import { timeAgo, formatCurrency, formatEventType } from '@/app/lib/utils';
import { productDisplay } from '@/app/lib/product-catalog';

const EVENT_META: Record<string, { className: string; Icon: typeof Package }> = {
  purchase: { className: 'border-[var(--swiss-up)] text-[var(--swiss-up)]', Icon: Package },
  page_view: { className: 'border-[var(--swiss-border-strong)] text-[var(--swiss-muted)]', Icon: MousePointerClick },
  add_to_cart: { className: 'border-[var(--swiss-border-strong)] text-[var(--swiss-fg)]', Icon: ShoppingCart },
  remove_from_cart: { className: 'border-[var(--swiss-down)] text-[var(--swiss-down)]', Icon: Trash2 },
  checkout_started: { className: 'border-[var(--swiss-border-strong)] text-[var(--swiss-muted)]', Icon: CreditCard },
};

interface Props {
  events: RecentEvent[];
}

export function RecentActivity({ events }: Props) {
  const list = events ?? [];

  if (list.length === 0) {
    return <p className="text-[13px] text-[var(--swiss-muted)]">No recent events</p>;
  }

  return (
    <div className="max-h-[340px] space-y-px overflow-y-auto pr-1">
      {list.map((event) => {
        const meta = EVENT_META[event.eventType] ?? EVENT_META.page_view!;
        const Icon = meta.Icon;
        return (
          <div
            key={event.id}
            className="flex items-center gap-3 border-b border-[var(--swiss-border)] bg-[var(--swiss-bg)] px-2 py-2.5 last:border-b-0"
          >
            <span
              className={`inline-flex items-center gap-1 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${meta.className}`}
            >
              <Icon className="h-3 w-3" strokeWidth={1.5} />
              {formatEventType(event.eventType)}
            </span>
            <span className="flex-1 truncate text-[11px] text-[var(--swiss-muted)]">
              {event.productId ? productDisplay(event.productId).name : '—'}
            </span>
            {event.amount != null && (
              <span className="shrink-0 font-mono text-[11px] font-medium tabular-nums text-[var(--swiss-up)]">
                {formatCurrency(event.amount)}
              </span>
            )}
            <span className="w-12 shrink-0 text-right font-mono text-[10px] tabular-nums text-[var(--swiss-dim)]">
              {timeAgo(event.timestamp)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

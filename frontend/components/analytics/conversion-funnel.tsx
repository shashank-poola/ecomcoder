import { Eye, ShoppingCart, CreditCard, Package } from 'lucide-react';
import type { EventCounts } from '@/app/lib/types';
import { formatNumber } from '@/app/lib/utils';

interface Step {
  label: string;
  key: keyof EventCounts;
  Icon: typeof Eye;
}

const STEPS: Step[] = [
  { label: 'Page views', key: 'page_view', Icon: Eye },
  { label: 'Add to cart', key: 'add_to_cart', Icon: ShoppingCart },
  { label: 'Checkout', key: 'checkout_started', Icon: CreditCard },
  { label: 'Purchases', key: 'purchase', Icon: Package },
];

export function ConversionFunnel({ eventCounts }: { eventCounts: EventCounts }) {
  const top = eventCounts.page_view || 1;

  return (
    <div className="space-y-4">
      {STEPS.map((step, i) => {
        const count = eventCounts[step.key] ?? 0;
        const pct = Math.round((count / top) * 100);
        const barWidth = Math.max((count / top) * 100, count > 0 ? 4 : 0);
        const Icon = step.Icon;

        return (
          <div key={step.key}>
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-[var(--swiss-muted)]" strokeWidth={1.5} />
                <span className="text-[12px] text-[var(--swiss-muted)]">{step.label}</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[12px]">
                <span className="text-[var(--swiss-fg)]">{formatNumber(count)}</span>
                {i > 0 && <span className="text-[var(--swiss-dim)]">{pct}%</span>}
              </div>
            </div>
            <div className="h-1 w-full bg-[var(--swiss-border)]">
              <div
                className="h-1 bg-[var(--swiss-fg)] transition-all duration-700"
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        );
      })}

      <div className="flex items-center justify-between border-t border-[var(--swiss-border)] pt-4">
        <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--swiss-dim)]">
          Conversion
        </span>
        <span className="font-mono text-sm font-semibold text-[var(--swiss-up)]">
          {top > 1 ? `${((eventCounts.purchase / top) * 100).toFixed(1)}%` : '—'}
        </span>
      </div>
    </div>
  );
}

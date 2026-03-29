import { Clock, CalendarDays, CalendarRange, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/app/lib/utils';

type Accent = 'neutral' | 'up';
type IconType = 'today' | 'week' | 'month' | 'conversion';

const ICONS: Record<IconType, typeof Clock> = {
  today: Clock,
  week: CalendarDays,
  month: CalendarRange,
  conversion: TrendingUp,
};

interface Props {
  label: string;
  value: number;
  type: 'currency' | 'percent';
  accent?: Accent;
  icon: IconType;
  subtitle?: string;
}

export function MetricCard({ label, value, type, accent = 'neutral', icon, subtitle }: Props) {
  const Icon = ICONS[icon];
  const displayValue = type === 'currency' ? formatCurrency(value) : `${value}%`;
  const up = accent === 'up';

  return (
    <div className="border border-[var(--swiss-border)] bg-[var(--swiss-surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--swiss-dim)]">
          {label}
        </span>
        <Icon
          className={`h-4 w-4 shrink-0 ${up ? 'text-[var(--swiss-up)]' : 'text-[var(--swiss-muted)]'}`}
          strokeWidth={1.5}
        />
      </div>
      <p className="mt-3 font-mono text-2xl font-semibold tracking-tight text-[var(--swiss-fg)] sm:text-3xl">
        {displayValue}
      </p>
      {subtitle && (
        <p className="mt-1.5 text-[12px] leading-snug text-[var(--swiss-muted)]">{subtitle}</p>
      )}
    </div>
  );
}

import { Clock, CalendarDays, CalendarRange, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

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
    <div className="min-w-0 border border-[var(--swiss-border)] bg-[var(--swiss-surface)] p-3 sm:p-4">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <span className="min-w-0 text-[10px] font-medium uppercase leading-tight tracking-[0.12em] text-[var(--swiss-dim)] sm:text-[11px]">
          {label}
        </span>
        <Icon
          className={`h-4 w-4 shrink-0 ${up ? 'text-[var(--swiss-up)]' : 'text-[var(--swiss-muted)]'}`}
          strokeWidth={1.5}
        />
      </div>
      <p className="mt-2 min-w-0 truncate font-mono text-xl font-semibold tracking-tight text-[var(--swiss-fg)] sm:mt-3 sm:text-2xl md:text-3xl">
        {displayValue}
      </p>
      {subtitle && (
        <p className="mt-1.5 break-words text-[11px] leading-snug text-[var(--swiss-muted)] sm:text-[12px]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

'use client';

interface Props {
  points: number[];
  positive?: boolean;
  className?: string;
}

/** Minimal SVG sparkline; values in 0–1, drawn left→right */
export function Sparkline({ points, positive = true, className = '' }: Props) {
  if (points.length < 2) return <div className={`h-8 w-20 ${className}`} />;

  const w = 72;
  const h = 28;
  const pad = 2;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;

  const stroke = positive ? 'var(--swiss-up)' : 'var(--swiss-down)';

  const path = points
    .map((p, i) => {
      const x = pad + (i / (points.length - 1)) * (w - pad * 2);
      const y = pad + (1 - (p - min) / span) * (h - pad * 2);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      aria-hidden
    >
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

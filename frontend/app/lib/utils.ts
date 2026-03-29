export function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: n >= 100 ? 0 : 2,
  }).format(n);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
}

export function formatDate(iso: string): string {
  const d = new Date(iso + (iso.includes('T') ? '' : 'T12:00:00'));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatEventType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function timeAgo(iso: string | Date): string {
  const t = typeof iso === 'string' ? new Date(iso).getTime() : iso.getTime();
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

export function formatProductLabel(id: string): string {
  return id
    .replace(/^prod_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function productTicker(id: string): string {
  const raw = id.replace(/^prod_/, '');
  return raw.slice(0, 4).toUpperCase();
}

/** Deterministic pseudo-trend for sparkline when per-product series is unavailable */
export function pseudoTrendPoints(seed: string, n = 12): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    out.push((h % 100) / 100);
  }
  return out;
}

export function pseudoPercentChange(seed: string): number {
  const pts = pseudoTrendPoints(seed, 2);
  const a = 0.2 + pts[0]! * 0.8;
  const b = 0.2 + pts[1]! * 0.8;
  return Math.round(((b - a) / a) * 1000) / 10;
}

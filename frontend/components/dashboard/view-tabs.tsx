'use client';

import { Flame, LayoutGrid, LineChart, GitBranch, Radio } from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'revenue', label: 'Revenue', icon: LineChart },
  { id: 'products', label: 'Products', icon: Flame },
  { id: 'funnel', label: 'Funnel', icon: GitBranch },
  { id: 'activity', label: 'Activity', icon: Radio },
] as const;

export function ViewTabs() {
  return (
    <nav className="flex flex-wrap items-center gap-1 border-b border-[var(--swiss-border)] pb-px">
      {tabs.map(({ id, label, icon: Icon }) => (
        <a
          key={id}
          href={`#${id}`}
          className="group flex items-center gap-1.5 border border-transparent px-3 py-2 text-[12px] font-medium tracking-wide text-[var(--swiss-muted)] transition-colors hover:text-[var(--swiss-fg)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--swiss-fg)]"
        >
          <Icon className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100" strokeWidth={1.5} />
          {label}
        </a>
      ))}
    </nav>
  );
}

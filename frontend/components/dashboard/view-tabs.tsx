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
    <nav
      className="-mx-3 flex flex-nowrap items-center gap-0.5 overflow-x-auto border-b border-[var(--swiss-border)] px-3 pb-px [scrollbar-width:none] sm:mx-0 sm:gap-1 sm:px-0 [&::-webkit-scrollbar]:hidden"
      aria-label="Dashboard sections"
    >
      {tabs.map(({ id, label, icon: Icon }) => (
        <a
          key={id}
          href={`#${id}`}
          className="group flex shrink-0 items-center gap-1.5 whitespace-nowrap border border-transparent px-2.5 py-2 text-[12px] font-medium tracking-wide text-[var(--swiss-muted)] transition-colors hover:text-[var(--swiss-fg)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--swiss-fg)] sm:px-3"
        >
          <Icon className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100" strokeWidth={1.5} />
          {label}
        </a>
      ))}
    </nav>
  );
}

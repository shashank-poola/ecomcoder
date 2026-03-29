'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface Ctx {
  query: string;
  setQuery: (q: string) => void;
}

const DashboardFilterContext = createContext<Ctx | null>(null);

export function DashboardFilterProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const value = useMemo(() => ({ query, setQuery }), [query]);
  return <DashboardFilterContext.Provider value={value}>{children}</DashboardFilterContext.Provider>;
}

export function useDashboardFilter() {
  const ctx = useContext(DashboardFilterContext);
  if (!ctx) throw new Error('useDashboardFilter must be used within DashboardFilterProvider');
  return ctx;
}

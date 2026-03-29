'use client';

import { useEffect, useState, useTransition } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ThemeMode } from '@/app/lib/theme';

interface Props {
  initialTheme: ThemeMode;
}

export function ThemeToggle({ initialTheme }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [mode, setMode] = useState<ThemeMode>(initialTheme);

  useEffect(() => {
    setMode(initialTheme);
  }, [initialTheme]);

  const isLight = mode === 'light';

  function setTheme(next: ThemeMode) {
    setMode(next);
    document.cookie = `theme=${next};path=/;max-age=31536000;SameSite=Lax`;
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      disabled={pending}
      className="flex h-8 w-8 items-center justify-center border border-[var(--swiss-border)] text-[var(--swiss-muted)] transition-colors hover:border-[var(--swiss-border-strong)] hover:text-[var(--swiss-fg)] disabled:opacity-50"
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {isLight ? <Moon className="h-4 w-4" strokeWidth={1.5} /> : <Sun className="h-4 w-4" strokeWidth={1.5} />}
    </button>
  );
}

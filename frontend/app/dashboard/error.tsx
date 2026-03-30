'use client';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--swiss-bg)] px-6 text-center text-[var(--swiss-fg)]">
      <h1 className="text-xl font-semibold tracking-tight">Could not load dashboard</h1>
      <p className="max-w-md text-[13px] text-[var(--swiss-muted)]">
        {error.message || 'Check that the API is running and NEXT_PUBLIC_API_URL is correct.'}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="border border-[var(--swiss-border-strong)] bg-[var(--swiss-surface)] px-4 py-2 text-[13px] font-medium text-[var(--swiss-fg)] hover:border-[var(--swiss-fg)]"
      >
        Try again
      </button>
    </div>
  );
}

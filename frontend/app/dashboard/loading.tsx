export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--swiss-bg)] text-[var(--swiss-fg)]">
      <div className="h-[120px] border-b border-[var(--swiss-border)]" />
      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
        <div className="mb-6 space-y-2 border-b border-[var(--swiss-border)] pb-6">
          <div className="skeleton h-8 w-56 border border-[var(--swiss-border)]" />
          <div className="skeleton h-4 w-72 border border-[var(--swiss-border)]" />
        </div>
        <div className="mb-8 h-10 border-b border-[var(--swiss-border)]" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-[var(--swiss-border)] bg-[var(--swiss-surface)] p-4">
              <div className="skeleton mb-3 h-3 w-24" />
              <div className="skeleton h-9 w-32" />
            </div>
          ))}
        </div>
        <div className="mt-10 grid gap-3 lg:grid-cols-3">
          <div className="skeleton h-64 border border-[var(--swiss-border)] bg-[var(--swiss-surface)] lg:col-span-2" />
          <div className="skeleton h-64 border border-[var(--swiss-border)] bg-[var(--swiss-surface)]" />
        </div>
      </main>
    </div>
  );
}

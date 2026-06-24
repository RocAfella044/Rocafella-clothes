export function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-moss">
      <div className="relative h-8 w-8">
        <div className="absolute inset-0 rounded-full border-2 border-line" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-moss animate-spin" />
      </div>
      <p className="eyebrow">{label}</p>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <p className="eyebrow text-clay">Something went wrong</p>
      <p className="max-w-sm text-sm text-ink/70">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="font-mono text-xs uppercase tracking-widest2 border border-ink px-4 py-2 hover:bg-ink hover:text-canvas transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <p className="font-display text-2xl">{title}</p>
      {message && <p className="max-w-sm text-sm text-ink/60">{message}</p>}
      {action}
    </div>
  );
}

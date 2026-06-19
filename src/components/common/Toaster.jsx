import { useUI } from '../../context/UIContext'

const typeStyles = {
  info: 'border-ink/20 bg-ink text-canvas',
  success: 'border-moss bg-moss text-canvas',
  error: 'border-clay bg-clay text-canvas',
}

export function Toaster() {
  const { toasts, dismissToast } = useUI()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`flex items-center justify-between gap-4 rounded-sm border px-4 py-3 shadow-lg max-w-sm font-mono text-xs ${
            typeStyles[toast.type] || typeStyles.info
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

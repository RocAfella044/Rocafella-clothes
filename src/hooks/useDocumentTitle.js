import { useEffect } from 'react'

/**
 * Sets document.title on mount and restores the previous title on
 * unmount — a small, focused demonstration of a component lifecycle
 * effect via useEffect's cleanup function.
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} · Rocafella` : 'Rocafella'
    return () => {
      document.title = previous
    }
  }, [title])
}

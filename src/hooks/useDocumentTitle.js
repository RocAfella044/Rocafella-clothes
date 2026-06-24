import { useEffect } from 'react'

export function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} · Threadline` : 'Threadline'
    return () => { document.title = previous }
  }, [title])
}
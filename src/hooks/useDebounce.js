import { useEffect, useState } from 'react'

/**
 * Debounce a fast-changing value (e.g. search input) so dependent
 * effects (like API calls) only fire after the value settles.
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

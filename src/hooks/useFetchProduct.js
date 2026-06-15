import { useEffect, useState } from 'react'
import { fetchProductById } from '../services/api'

/**
 * Loads a single product by id and exposes loading/error state.
 * Cancels stale updates if the id changes or the component unmounts
 * before the request resolves.
 */
export function useFetchProduct(id) {
  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | succeeded | failed
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    setStatus('loading')
    setError(null)

    fetchProductById(id)
      .then((data) => {
        if (cancelled) return
        setProduct(data)
        setStatus('succeeded')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err?.response?.data?.message || 'Failed to load product.')
        setStatus('failed')
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return { product, status, error }
}

import { useEffect, useState } from 'react'
import { fetchProductById } from '../supabase/products'

export function useFetchProduct(id) {
  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState('idle')
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
        setError(err?.message || 'Failed to load product.')
        setStatus('failed')
      })

    return () => { cancelled = true }
  }, [id])

  return { product, status, error }
}
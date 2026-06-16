import axios from 'axios'
import { products, getProductById } from './mockData'

// A configured axios instance. In a real deployment, baseURL would point
// at your backend (e.g. import.meta.env.VITE_API_URL). We keep it here so
// every request in the app goes through one place (headers, interceptors,
// error shaping, etc.)
export const api = axios.create({
  baseURL: '/api',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Simulate network latency + occasional failure so loading/error states
// in the UI have something real to handle.
const simulateNetwork = (data, { failRate = 0, delay = 500 } = {}) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failRate) {
        reject({
          response: { status: 500, data: { message: 'Unable to reach the catalogue service.' } },
        })
      } else {
        resolve({ data, status: 200 })
      }
    }, delay)
  })

/**
 * Fetch the full product catalogue, optionally filtered by query params.
 * Mirrors a real `api.get('/products', { params })` call.
 */
export const fetchProducts = async (params = {}) => {
  let results = [...products]

  if (params.category && params.category !== 'All') {
    results = results.filter((p) => p.category === params.category)
  }

  if (params.search) {
    const q = params.search.toLowerCase()
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q)
    )
  }

  // if (params.minPrice != null) {
  //   results = results.filter((p) => p.price >= params.minPrice)
  // }
  // if (params.maxPrice != null) {
  //   results = results.filter((p) => p.price <= params.maxPrice)
  // }

  if (params.sort === 'price-asc') results.sort((a, b) => a.price - b.price)
  if (params.sort === 'price-desc') results.sort((a, b) => b.price - a.price)
  if (params.sort === 'rating') results.sort((a, b) => b.rating - a.rating)
  if (params.sort === 'newest') results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))

  const response = await simulateNetwork(results, { delay: 450 })
  return response.data
}

/**
 * Fetch a single product by id.
 * Mirrors `api.get(`/products/${id}`)`.
 */
export const fetchProductById = async (id) => {
  const product = getProductById(id)
  if (!product) {
    throw { response: { status: 404, data: { message: 'Product not found.' } } }
  }
  const response = await simulateNetwork(product, { delay: 350 })
  return response.data
}

/**
 * Submit an order. Mirrors `api.post('/orders', payload)`.
 * Has a small simulated failure rate to exercise error handling.
 */
export const placeOrder = async (payload) => {
  const response = await simulateNetwork(
    {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      placedAt: new Date().toISOString(),
      status: 'confirmed',
      ...payload,
    },
    { delay: 900, failRate: 0.08 }
  )
  return response.data
}

import { supabase } from './client'

// ─── FAVORITES ───────────────────────────────────────────────

export async function fetchFavorites(userId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('product_id')
    .eq('user_id', userId)
  if (error) throw error
  return data.map((row) => row.product_id)
}

export async function addFavorite(userId, productId) {
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, product_id: productId })
  if (error) throw error
}

export async function removeFavorite(userId, productId) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)
  if (error) throw error
}

// ─── ORDERS ──────────────────────────────────────────────────

export async function fetchOrders(userId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchOrderById(orderId, userId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('user_id', userId)
    .single()
  if (error) throw error
  return data
}

export async function createOrder(userId, { customer, items, total }) {
  const { data, error } = await supabase
    .from('orders')
    .insert({ user_id: userId, customer, items, total, status: 'confirmed' })
    .select()
    .single()
  if (error) throw error
  return data
}
import { supabase } from './client'

export async function fetchAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function updateOrderStatus(orderId, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateUserRole(userId, role) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function listUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

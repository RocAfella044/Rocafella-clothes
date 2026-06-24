import { supabase } from './client'

export async function fetchProducts(filters = {}) {
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters.category && filters.category !== 'All') {
    query = query.eq('category', filters.category)
  }

  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,color.ilike.%${filters.search}%`
    )
  }

  if (filters.sort === 'price-asc') query = query.order('price', { ascending: true })
  else if (filters.sort === 'price-desc') query = query.order('price', { ascending: false })
  else if (filters.sort === 'rating') query = query.order('rating', { ascending: false })
  else if (filters.sort === 'newest') query = query.order('created_at', { ascending: false })

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function fetchProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

export async function uploadProductImage(file) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
  const filePath = `products/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, { cacheControl: '3600', upsert: false })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('product-images').getPublicUrl(filePath)
  return data.publicUrl
}

export async function fetchCategories() {
  const { data, error } = await supabase.from('products').select('category')
  if (error) throw error
  return [...new Set(data.map((p) => p.category))].sort()
}
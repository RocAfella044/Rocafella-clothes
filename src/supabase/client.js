import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eijtrwbjwzmqalyauaot.supabase.co'
const supabaseKey = 'sb_publishable_4HUXkQNcKR0wtAqGqBjDvA_Gqvv6ljh'

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})


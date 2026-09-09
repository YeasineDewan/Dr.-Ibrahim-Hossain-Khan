import { createClient } from '@supabase/supabase-js'

const required = name => {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is required`)
  return value
}

const email = (process.env.ADMIN_EMAIL || 'dr.ibrahimhossain53@gmail.com').trim().toLowerCase()
const password = required('ADMIN_PASSWORD')
if (password.length < 12) throw new Error('ADMIN_PASSWORD must be at least 12 characters; rotate the supplied password before production.')

const supabase = createClient(required('SUPABASE_URL'), required('SUPABASE_SERVICE_ROLE_KEY'), { auth: { autoRefreshToken: false, persistSession: false } })
const { data: users, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
if (listError) throw listError
const existing = users.users.find(user => user.email?.toLowerCase() === email)
const result = existing
  ? await supabase.auth.admin.updateUserById(existing.id, { password, email_confirm: true, user_metadata: { full_name: 'Dr. Ibrahim Hossain Khan', role: 'admin' } })
  : await supabase.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name: 'Dr. Ibrahim Hossain Khan', role: 'admin' } })
if (result.error || !result.data.user) throw result.error || new Error('Admin user creation failed')
const { error: profileError } = await supabase.from('profiles').upsert({ id: result.data.user.id, full_name: 'Dr. Ibrahim Hossain Khan', role: 'admin' }, { onConflict: 'id' })
if (profileError) throw profileError
console.log(`Doctor Admin Dashboard user is ready: ${email}`)

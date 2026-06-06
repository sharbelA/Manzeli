'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

type AuthState = { error: string | null }

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }

  redirect('/dashboard')
}

export async function adminLoginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (profileError || profile?.role !== 'admin') {
    await supabase.auth.signOut()
    return { error: 'Access denied. Admin credentials required.' }
  }

  redirect('/admin')
}

// ─── Logout ─────────────────────────────────────────────────

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

// ─── Get current user with role ─────────────────────────────

export type CurrentUser = {
  id: string
  email: string
  name: string
  role: 'admin' | 'host' | 'guest'
} | null

export async function getCurrentUser(): Promise<CurrentUser> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = (await supabase
    .from('profiles')
    .select('name, role')
    .eq('id', user.id)
    .single()) as { data: { name: string; role: 'admin' | 'host' | 'guest' } | null }

  return {
    id: user.id,
    email: user.email ?? '',
    name: profile?.name ?? user.email?.split('@')[0] ?? 'User',
    role: profile?.role ?? 'guest',
  }
}

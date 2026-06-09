'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

interface Props {
  redirectTo: string
}

export default function SignupForm({ redirectTo }: Props) {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.session) {
      router.push(redirectTo)
      router.refresh()
    } else {
      setDone(true)
    }
  }

  if (done) {
    return (
      <div className="text-center py-4 space-y-2">
        <p className="font-semibold text-warm-900">Check your email</p>
        <p className="text-sm text-warm-500">
          We sent a confirmation link to <span className="font-medium">{email}</span>.
        </p>
        <Link href="/login" className="inline-block mt-2 text-sm font-medium text-sea-600 hover:underline">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="sf-name" className="text-sm font-medium text-warm-700">
          Full name
        </label>
        <input
          id="sf-name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={loading}
          placeholder="Your name"
          className="h-11 rounded-xl border border-sand-200 bg-white px-4 text-sm text-warm-900 placeholder:text-warm-400 outline-none transition focus:border-sea-400 focus:ring-2 focus:ring-sea-100 disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="sf-email" className="text-sm font-medium text-warm-700">
          Email address
        </label>
        <input
          id="sf-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
          placeholder="you@example.com"
          className="h-11 rounded-xl border border-sand-200 bg-white px-4 text-sm text-warm-900 placeholder:text-warm-400 outline-none transition focus:border-sea-400 focus:ring-2 focus:ring-sea-100 disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="sf-password" className="text-sm font-medium text-warm-700">
          Password
        </label>
        <input
          id="sf-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
          placeholder="At least 6 characters"
          className="h-11 rounded-xl border border-sand-200 bg-white px-4 text-sm text-warm-900 outline-none transition focus:border-sea-400 focus:ring-2 focus:ring-sea-100 disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !name || !email || !password}
        className="mt-1 h-11 rounded-xl bg-sea-600 text-sm font-semibold text-white transition hover:bg-sea-700 active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}

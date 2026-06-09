import type { Metadata } from 'next'
import Link from 'next/link'
import SignupForm from '@/app/(auth)/_components/SignupForm'

export const metadata: Metadata = { title: 'Create account' }

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const raw = typeof params.redirect === 'string' ? params.redirect : null
  const redirectTo = raw?.startsWith('/') ? raw : '/'

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-sand-50 px-4 py-16">
      <div className="w-full max-w-sm">

        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold tracking-tight text-sea-700">
            Manzeli
          </Link>
          <p className="mt-1 text-sm text-warm-500">
            Create your free account
          </p>
        </div>

        <div className="rounded-2xl border border-sand-200 bg-white px-8 py-8 shadow-sm">
          <h1 className="mb-6 text-xl font-semibold text-warm-900">Get started</h1>
          <SignupForm redirectTo={redirectTo} />
          <p className="mt-5 text-center text-sm text-warm-500">
            Already have an account?{' '}
            <Link
              href={raw ? `/login?redirect=${encodeURIComponent(raw)}` : '/login'}
              className="font-medium text-sea-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </main>
  )
}

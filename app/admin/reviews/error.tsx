'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <p className="text-warm-700 font-medium">Failed to load reviews</p>
      <p className="text-sm text-warm-500">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-xl bg-warm-800 px-5 py-2 text-sm font-semibold text-white hover:bg-warm-700 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}

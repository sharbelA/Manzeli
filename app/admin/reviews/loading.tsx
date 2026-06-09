export default function Loading() {
  return (
    <div>
      <div className="mb-6">
        <div className="h-8 w-28 rounded-lg bg-sand-200 animate-pulse" />
        <div className="mt-1 h-4 w-20 rounded bg-sand-100 animate-pulse" />
      </div>
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="h-8 w-20 rounded-full bg-sand-100 animate-pulse" />
        ))}
      </div>
      <div className="rounded-2xl border border-sand-200 bg-white overflow-hidden">
        {[1, 2, 3, 4, 5].map(n => (
          <div key={n} className="flex items-center gap-4 px-4 py-4 border-b border-sand-100 last:border-none">
            <div className="h-4 w-32 rounded bg-sand-100 animate-pulse" />
            <div className="h-4 w-24 rounded bg-sand-100 animate-pulse" />
            <div className="h-4 w-20 rounded bg-sand-100 animate-pulse" />
            <div className="h-4 w-40 rounded bg-sand-100 animate-pulse flex-1" />
          </div>
        ))}
      </div>
    </div>
  )
}

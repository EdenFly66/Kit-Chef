export function FormSkeleton({ campos = 3 }: { campos?: number }) {
  return (
    <main className="mx-auto w-full max-w-md px-6 py-16">
      <div className="h-7 w-40 animate-pulse rounded bg-superficie-2" />
      <div className="mt-3 h-4 w-full animate-pulse rounded bg-superficie-2" />

      <div className="mt-6 space-y-4">
        {Array.from({ length: campos }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-3 w-20 animate-pulse rounded bg-superficie-2" />
            <div className="h-9 w-full animate-pulse rounded-md bg-superficie-2" />
          </div>
        ))}
        <div className="h-9 w-full animate-pulse rounded-md bg-superficie-2" />
      </div>
    </main>
  );
}

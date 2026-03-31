export function AppHero() {
  return (
    <section className="mx-auto w-full max-w-7xl px-8 pt-10 pb-12">
      <h1 className="max-w-4xl text-4xl leading-tight font-semibold tracking-tight text-zinc-900">
        A live Zod schema visualizer that parses your schema and generates a
        type-safe form in real time.
      </h1>

      <div className="mt-6 flex w-fit items-center gap-2 rounded-2xl border border-amber-100 px-2 py-1">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
        </span>
        <span className="font-mono text-xs font-semibold tracking-widest text-zinc-500 uppercase">
          Available for a frontend role
        </span>
      </div>

      <p className="mt-6 max-w-3xl text-base text-zinc-500">
        Use the keyboard-driven builder or paste a raw{' '}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-sm text-zinc-700">
          z.object()
        </code>{' '}
        schema. The visualizer parses it with Zod, walks the shape tree, and
        renders a matching form on the right — live.
      </p>
    </section>
  );
}

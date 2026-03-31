export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-100 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-4">
        <span className="font-mono text-sm font-semibold tracking-tight text-zinc-900">
          zod-schema-visualizer
        </span>
        <span className="rounded-full bg-zinc-100 px-3 py-1 font-mono text-xs font-medium tracking-widest text-zinc-500 uppercase">
          Portfolio
        </span>
      </div>
    </header>
  );
}

const PLACEHOLDER = `z.object({
  name: z.string().min(2),
  age: z.number().min(0).max(120),
  email: z.string().email(),
  isActive: z.boolean(),
  role: z.enum(["admin", "user", "guest"]),
})`

interface SchemaInputProps {
  value: string
  onChange: (value: string) => void
  onParse: () => void
  error: string | null
}

export function SchemaInput({ value, onChange, onParse, error }: SchemaInputProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden border-r border-zinc-200">
      <header className="flex shrink-0 items-baseline gap-2.5 border-b border-zinc-200 px-5 py-3.5">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-(--accent)">
          Schema
        </span>
        <span className="text-xs text-zinc-400">
          Paste a Zod{' '}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-700">
            z.object()
          </code>{' '}
          schema
        </span>
      </header>

      <textarea
        className="flex-1 resize-none bg-white p-5 font-mono text-sm leading-relaxed text-zinc-900 outline-none [tab-size:2]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={PLACEHOLDER}
        spellCheck={false}
        aria-label="Zod schema input"
      />

      {error && (
        <p
          className="m-0 shrink-0 border-t border-red-500/20 bg-red-500/10 px-5 py-2.5 text-xs text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="shrink-0 px-5 py-3">
        <button
          className="cursor-pointer rounded-md border border-(--accent-border) bg-(--accent-bg) px-4 py-2 text-sm font-medium text-(--accent) transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
          onClick={onParse}
        >
          Parse Schema
        </button>
      </div>
    </div>
  )
}

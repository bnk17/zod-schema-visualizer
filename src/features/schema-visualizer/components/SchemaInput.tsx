import { PRESETS } from '../presets'

const PLACEHOLDER = `z.object({
  name: z.string().min(2),
  age: z.number().int().min(18),
  email: z.string().email(),
  role: z.enum(["admin", "user"]),
  isActive: z.boolean(),
})`

interface SchemaInputProps {
  value: string
  onChange: (value: string) => void
  onVisualize: () => void
  onPresetSelect: (schema: string) => void
  error: string | null
}

export function SchemaInput({
  value,
  onChange,
  onVisualize,
  onPresetSelect,
  error,
}: SchemaInputProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-zinc-100 px-5 py-3">
        <span className="text-sm text-zinc-400" aria-hidden>✦</span>
        <span className="text-sm font-semibold text-zinc-900">Schema</span>
      </div>

      {/* Textarea */}
      <textarea
        className="flex-1 resize-none bg-transparent px-5 py-4 font-mono text-sm leading-relaxed text-zinc-900 outline-none [tab-size:2] placeholder:font-mono placeholder:text-zinc-300"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={PLACEHOLDER}
        spellCheck={false}
        aria-label="Zod schema input"
      />

      {/* Bottom toolbar */}
      <div className="shrink-0 border-t border-zinc-100 px-4 pb-4 pt-3">
        {/* Preset chips */}
        <div className="mb-3 flex flex-wrap gap-2">
          {PRESETS.map(preset => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onPresetSelect(preset.schema)}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Error + action row */}
        <div className="flex min-h-[32px] items-center justify-between gap-3">
          {error ? (
            <p className="text-xs text-red-500" role="alert">{error}</p>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onVisualize}
            disabled={!value.trim()}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden>✦</span>
            Visualize
          </button>
        </div>
      </div>
    </div>
  )
}

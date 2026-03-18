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
    <div className="panel schema-panel">
      <header className="panel-header">
        <span className="panel-label">Schema</span>
        <span className="panel-hint">Paste a Zod <code>z.object()</code> schema</span>
      </header>

      <textarea
        className="schema-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={PLACEHOLDER}
        spellCheck={false}
        aria-label="Zod schema input"
      />

      {error && (
        <p className="parse-error" role="alert">
          {error}
        </p>
      )}

      <button className="parse-btn" onClick={onParse}>
        Parse Schema
      </button>
    </div>
  )
}

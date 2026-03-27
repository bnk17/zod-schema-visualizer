import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

interface EnumValuesEditorProps {
  values: string[]
  onChange: (values: string[]) => void
}

export const EnumValuesEditor = forwardRef<HTMLInputElement, EnumValuesEditorProps>(
  function EnumValuesEditor({ values, onChange }, ref) {
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => inputRef.current!)

  function commit() {
    const trimmed = draft.trim()
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed])
    }
    setDraft('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commit()
    }
    if (e.key === 'Backspace' && draft === '' && values.length > 0) {
      onChange(values.slice(0, -1))
    }
  }

  function remove(value: string) {
    onChange(values.filter(v => v !== value))
    inputRef.current?.focus()
  }

  return (
    <div
      className="flex flex-1 flex-wrap items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 transition-colors focus-within:border-zinc-400 focus-within:bg-white"
      onClick={() => inputRef.current?.focus()}
    >
      {values.map(v => (
        <span
          key={v}
          className="flex items-center gap-1 rounded-md border border-violet-200 bg-violet-50 px-2 py-0.5 font-mono text-xs text-violet-700"
        >
          {v}
          <button
            type="button"
            onClick={e => { e.stopPropagation(); remove(v) }}
            className="leading-none text-violet-400 hover:text-violet-700"
            aria-label={`Remove ${v}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={values.length === 0 ? 'add values… (Enter or ,)' : ''}
        className="min-w-[8rem] flex-1 bg-transparent font-mono text-xs text-zinc-900 outline-none placeholder:text-zinc-400"
        aria-label="Add enum value"
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  )
})

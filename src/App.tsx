import { useCallback, useState } from 'react'
import { SchemaInput, FormPreview } from './features/schema-visualizer'
import { SchemaBuilder } from './features/schema-visualizer/builder/components/SchemaBuilder'
import { parseSchemaText } from './features/schema-visualizer/parse-schema'
import { TypePanel } from './features/schema-visualizer/components/TypePanel'
import type { ZodObject, ZodRawShape } from 'zod'
import './App.css'

type Mode = 'builder' | 'paste'

function App() {
  const [mode, setMode] = useState<Mode>('builder')
  const [schemaText, setSchemaText] = useState('')
  const [parsedSchema, setParsedSchema] = useState<ZodObject<ZodRawShape> | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)

  const parse = useCallback((text: string) => {
    const result = parseSchemaText(text)
    if (result.ok) {
      setParsedSchema(result.schema)
      setParseError(null)
    } else {
      setParsedSchema(null)
      setParseError(result.error)
    }
  }, [])

  function handlePresetSelect(schema: string) {
    setSchemaText(schema)
    parse(schema)
  }

  function handleModeSwitch(next: Mode) {
    setMode(next)
    setParsedSchema(null)
    setParseError(null)
    setSchemaText('')
  }

  return (
    <div className="flex min-h-svh flex-col bg-white text-zinc-900">
      {/* Top nav */}
      <header className="sticky top-0 z-10 border-b border-zinc-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-4">
          <span className="font-mono text-sm font-semibold tracking-tight text-zinc-900">
            zod-schema-visualizer
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 font-mono text-xs font-medium uppercase tracking-widest text-zinc-500">
            Portfolio
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-7xl px-8 pb-12 pt-10">
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-zinc-900">
          A live Zod schema visualizer that parses your schema and generates a
          type-safe form in real time.
        </h1>

        <div className="mt-6 flex w-fit items-center gap-2 rounded-2xl border border-amber-100 px-2 py-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
          </span>
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500">
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

      {/* Mode toggle */}
      <div className="mx-auto w-full max-w-7xl px-8 pb-5">
        <div className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 p-1">
          {(['builder', 'paste'] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => handleModeSwitch(m)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {m === 'builder' ? 'Builder' : 'Paste schema'}
            </button>
          ))}
        </div>
      </div>

      {/* Schema + Preview panels */}
      <section className="mx-auto w-full max-w-7xl flex-1 px-8 pb-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:min-h-[520px]">
          {/* Left panel */}
          {mode === 'builder' ? (
            <SchemaBuilder onChange={text => parse(text)} />
          ) : (
            <SchemaInput
              value={schemaText}
              onChange={setSchemaText}
              onVisualize={() => parse(schemaText)}
              onPresetSelect={handlePresetSelect}
              error={parseError}
            />
          )}

          {/* Right panel — form preview */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex shrink-0 items-center gap-2 border-b border-zinc-100 px-5 py-3">
              <span className="text-sm text-zinc-400" aria-hidden>✦</span>
              <span className="text-sm font-semibold text-zinc-900">Form Preview</span>
              {parsedSchema && (
                <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-500">
                  {Object.keys(parsedSchema.shape).length} fields
                </span>
              )}
            </div>
            <FormPreview schema={parsedSchema} />
          </div>
        </div>
      </section>

      {/* TypeScript type panel */}
      <TypePanel schema={parsedSchema} />

      {/* Footer */}
      <footer className="flex shrink-0 items-center justify-between border-t border-zinc-200 px-8 py-4 text-sm text-zinc-400">
        <span>
          © 2025 — <span className="text-zinc-600">Paul Bilbao</span>
        </span>
        <a
          href="mailto:paul.bilbao@example.com"
          className="text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline"
        >
          paul.bilbao@example.com
        </a>
      </footer>
    </div>
  )
}

export default App

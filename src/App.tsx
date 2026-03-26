import { useState } from 'react';
import { SchemaInput } from './features/schema-visualizer';
import './App.css';

function App() {
  const [schemaText, setSchemaText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);

  function handleParse() {
    if (!schemaText.trim()) {
      setParseError('Schema is empty.');
      return;
    }
    setParseError(null);
  }

  return (
    <div className="flex min-h-svh flex-col bg-white text-zinc-900">
      {/* Top nav */}
      <header className="sticky top-0 mx-auto flex w-full max-w-7xl items-center justify-between bg-white px-8 py-4">
        <span className="font-mono text-sm font-semibold tracking-tight text-zinc-900">
          Zod-schema-visualizer
        </span>
        <span className="rounded-full bg-zinc-100 px-3 py-1 font-mono text-xs font-medium tracking-widest text-zinc-500 uppercase">
          Portfolio
        </span>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-7xl px-8 pt-10 pb-12">
        <h1 className="max-w-4xl text-4xl leading-tight font-semibold tracking-tight text-zinc-900">
          A live Zod schema visualizer that parses your schema and generates a
          type-safe form in real time.
        </h1>

        {/* Availability badge */}
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
          Paste any{' '}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-sm text-zinc-700">
            z.object()
          </code>{' '}
          schema on the left. The visualizer parses it with Zod, walks the shape
          tree, and renders a matching form on the right — demonstrating
          advanced TypeScript inference and schema-driven UI patterns.
        </p>
      </section>

      {/* Schema + Preview panels */}
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-8 pb-16">
        <div
          className="flex overflow-hidden rounded-xl border border-zinc-200 shadow-sm"
          style={{ minHeight: '480px' }}
        >
          <SchemaInput
            value={schemaText}
            onChange={setSchemaText}
            onParse={handleParse}
            error={parseError}
          />

          <div className="flex flex-1 flex-col overflow-hidden">
            <header className="flex shrink-0 items-baseline gap-2.5 border-b border-zinc-200 px-5 py-3.5">
              <span className="font-mono text-xs font-semibold tracking-widest text-(--accent) uppercase">
                Form Preview
              </span>
              <span className="text-xs text-zinc-400">
                Generated form will appear here
              </span>
            </header>

            <div className="flex flex-1 items-center justify-center text-sm text-zinc-400">
              <p>Parse a schema to generate the form</p>
            </div>
          </div>
        </div>
      </section>

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
  );
}

export default App;

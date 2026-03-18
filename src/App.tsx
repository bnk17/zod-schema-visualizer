import { useState } from 'react'
import { SchemaInput } from './features/schema-visualizer'
import './App.css'

function App() {
  const [schemaText, setSchemaText] = useState('')
  const [parseError, setParseError] = useState<string | null>(null)

  function handleParse() {
    // Feature 2 will implement real parsing
    if (!schemaText.trim()) {
      setParseError('Schema is empty.')
      return
    }
    setParseError(null)
  }

  return (
    <div className="flex h-full overflow-hidden">
      <SchemaInput
        value={schemaText}
        onChange={setSchemaText}
        onParse={handleParse}
        error={parseError}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-baseline gap-2.5 border-b border-(--border) px-5 py-3.5">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-(--accent)">
            Form Preview
          </span>
          <span className="text-xs text-(--text)">
            Generated form will appear here
          </span>
        </header>

        <div className="flex flex-1 items-center justify-center text-sm text-(--text)">
          <p>Parse a schema to generate the form</p>
        </div>
      </div>
    </div>
  )
}

export default App

import { useState } from 'react'
import { SchemaInput } from './features/schema-visualizer'
import './App.css'

function App() {
  const [schemaText, setSchemaText] = useState('')
  const [parseError, setParseError] = useState<string | null>(null)

  function handleParse() {
    // Feature 2 will implement real parsing; placeholder for now
    if (!schemaText.trim()) {
      setParseError('Schema is empty.')
      return
    }
    setParseError(null)
  }

  return (
    <div className="app-layout">
      <SchemaInput
        value={schemaText}
        onChange={setSchemaText}
        onParse={handleParse}
        error={parseError}
      />

      <div className="panel form-panel">
        <header className="panel-header">
          <span className="panel-label">Form Preview</span>
          <span className="panel-hint">Generated form will appear here</span>
        </header>
        <div className="form-placeholder">
          <p>Parse a schema to generate the form</p>
        </div>
      </div>
    </div>
  )
}

export default App

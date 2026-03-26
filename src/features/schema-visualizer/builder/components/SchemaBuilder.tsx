import { useEffect, useRef, useState } from 'react'
import { FieldRow } from './FieldRow'
import { buildSchemaText } from '../build-schema'
import type { FieldDef } from '../types'

interface SchemaBuilderProps {
  onChange: (schemaText: string) => void
}

function createField(): FieldDef {
  return {
    id: crypto.randomUUID(),
    name: '',
    type: null,
    validators: [],
    enumValues: [],
  }
}

export function SchemaBuilder({ onChange }: SchemaBuilderProps) {
  const [fields, setFields] = useState<FieldDef[]>([createField()])
  const lastFieldRef = useRef<HTMLDivElement>(null)

  function update(next: FieldDef[]) {
    setFields(next)
    onChange(buildSchemaText(next))
  }

  function updateField(id: string, updated: FieldDef) {
    update(fields.map(f => (f.id === id ? updated : f)))
  }

  function removeField(id: string) {
    const next = fields.filter(f => f.id !== id)
    update(next.length > 0 ? next : [createField()])
  }

  function addField() {
    const next = [...fields, createField()]
    setFields(next)
    // focus the new field's name input on next tick
    requestAnimationFrame(() => {
      const inputs = lastFieldRef.current?.querySelectorAll('input')
      inputs?.[0]?.focus()
    })
  }

  // Keep lastFieldRef pointing to the last FieldRow wrapper
  useEffect(() => {
    const rows = document.querySelectorAll('[data-field-row]')
    if (rows.length > 0) {
      // focus last field's input when a new field is added
    }
  }, [fields.length])

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-zinc-100 px-5 py-3">
        <span className="text-sm text-zinc-400" aria-hidden>✦</span>
        <span className="text-sm font-semibold text-zinc-900">Builder</span>
        <span className="ml-auto font-mono text-xs text-zinc-400">
          Tab → pick type · Enter → next field
        </span>
      </div>

      {/* Field rows */}
      <div className="flex-1 divide-y divide-zinc-50 overflow-y-auto px-5">
        {fields.map((field, i) => (
          <div key={field.id} data-field-row ref={i === fields.length - 1 ? lastFieldRef : undefined}>
            <FieldRow
              field={field}
              onChange={updated => updateField(field.id, updated)}
              onRemove={() => removeField(field.id)}
              onAddNext={addField}
            />
          </div>
        ))}
      </div>

      {/* Add field */}
      <div className="shrink-0 border-t border-zinc-100 px-5 py-3">
        <button
          type="button"
          onClick={addField}
          className="flex items-center gap-1.5 rounded-full border border-dashed border-zinc-300 px-4 py-1.5 text-sm text-zinc-400 transition-colors hover:border-zinc-400 hover:text-zinc-600"
        >
          <span aria-hidden>+</span>
          Add field
        </button>
      </div>
    </div>
  )
}

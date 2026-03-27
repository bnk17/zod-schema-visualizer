import { useRef, useState } from 'react'
import { TypeSelectPopup } from './TypeSelectPopup'
import { EnumValuesEditor } from './EnumValuesEditor'
import { VALIDATORS_BY_TYPE } from '../zod-options'
import type { FieldDef, ValidatorDef, ZodTypeName } from '../types'

interface FieldRowProps {
  field: FieldDef
  onChange: (field: FieldDef) => void
  onRemove: () => void
  onAddNext: () => void
}

export function FieldRow({ field, onChange, onRemove, onAddNext }: FieldRowProps) {
  const [showTypePopup, setShowTypePopup] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  function handleNameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Tab' && !e.shiftKey && field.name.trim()) {
      e.preventDefault()
      setShowTypePopup(true)
    }
    if (e.key === 'Enter' && field.type !== null) {
      e.preventDefault()
      onAddNext()
    }
  }

  function handleTypeSelect(type: ZodTypeName) {
    onChange({ ...field, type, validators: [] })
    setShowTypePopup(false)
    nameRef.current?.focus()
  }

  function toggleValidator(name: string) {
    const existing = field.validators.find(v => v.name === name)
    if (existing) {
      onChange({ ...field, validators: field.validators.filter(v => v.name !== name) })
      return
    }
    const option = VALIDATORS_BY_TYPE[field.type!].find(v => v.name === name)!
    const next: ValidatorDef = option.requiresArg
      ? { name, arg: option.defaultArg }
      : { name }
    onChange({ ...field, validators: [...field.validators, next] })
  }

  const availableValidators = field.type ? VALIDATORS_BY_TYPE[field.type] : []
  const activeValidatorNames = new Set(field.validators.map(v => v.name))

  return (
    <div className="relative flex flex-wrap items-center gap-2 py-2">
      {/* Field name input */}
      <input
        ref={nameRef}
        value={field.name}
        onChange={e => onChange({ ...field, name: e.target.value })}
        onKeyDown={handleNameKeyDown}
        placeholder="field name"
        className="w-36 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 font-mono text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-400 focus:bg-white"
        aria-label="Field name"
        autoComplete="off"
        spellCheck={false}
      />

      {/* Type selector button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowTypePopup(true)}
          className={`rounded-lg border px-3 py-1.5 font-mono text-sm font-medium transition-colors ${
            field.type
              ? 'border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-700'
              : 'border-zinc-200 bg-zinc-50 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600'
          }`}
          aria-haspopup="listbox"
          aria-expanded={showTypePopup}
        >
          {field.type ?? 'type ▾'}
        </button>

        {showTypePopup && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowTypePopup(false)}
            />
            <TypeSelectPopup
              onSelect={handleTypeSelect}
              onClose={() => setShowTypePopup(false)}
            />
          </>
        )}
      </div>

      {/* Enum values editor */}
      {field.type === 'enum' && (
        <EnumValuesEditor
          values={field.enumValues}
          onChange={enumValues => onChange({ ...field, enumValues })}
        />
      )}

      {/* Validator chips */}
      {availableValidators.map(v => (
        <button
          key={v.name}
          type="button"
          onClick={() => toggleValidator(v.name)}
          className={`rounded-full border px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
            activeValidatorNames.has(v.name)
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300'
              : 'border-zinc-200 bg-white text-zinc-400 hover:border-zinc-300 hover:text-zinc-600'
          }`}
        >
          .{v.label}
        </button>
      ))}

      {/* Remove button */}
      <button
        type="button"
        onClick={onRemove}
        className="ml-auto rounded p-1 text-zinc-300 transition-colors hover:text-red-400"
        aria-label={`Remove ${field.name || 'field'}`}
      >
        ✕
      </button>
    </div>
  )
}

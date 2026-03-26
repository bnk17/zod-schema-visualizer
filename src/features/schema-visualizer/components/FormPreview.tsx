import { z } from 'zod'
import type { ZodObject, ZodRawShape, ZodTypeAny } from 'zod'

interface FormPreviewProps {
  schema: ZodObject<ZodRawShape> | null
}

export function FormPreview({ schema }: FormPreviewProps) {
  if (!schema) {
    return (
      <div className="flex flex-1 items-center justify-center px-8 text-center text-sm text-zinc-400">
        <p>Build or paste a schema to preview the form</p>
      </div>
    )
  }

  const entries = Object.entries(schema.shape) as [string, ZodTypeAny][]

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5">
      <form onSubmit={e => e.preventDefault()} className="space-y-4" noValidate>
        {entries.map(([key, zodType]) => (
          <FormField key={key} name={key} zodType={zodType} />
        ))}
      </form>
    </div>
  )
}

function unwrap(zodType: ZodTypeAny): ZodTypeAny {
  if (zodType instanceof z.ZodOptional || zodType instanceof z.ZodNullable) {
    return unwrap(zodType.unwrap())
  }
  return zodType
}

function toLabel(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
}

function isOptional(zodType: ZodTypeAny): boolean {
  return zodType instanceof z.ZodOptional
}

function FormField({ name, zodType }: { name: string; zodType: ZodTypeAny }) {
  const base = unwrap(zodType)
  const label = toLabel(name)
  const optional = isOptional(zodType)

  const labelEl = (
    <label
      htmlFor={name}
      className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-700"
    >
      {label}
      {optional && (
        <span className="font-mono text-xs font-normal text-zinc-400">optional</span>
      )}
    </label>
  )

  if (base instanceof z.ZodBoolean) {
    return (
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id={name}
          className="h-4 w-4 rounded border-zinc-300 accent-zinc-900"
        />
        <label htmlFor={name} className="text-sm font-medium text-zinc-700">
          {label}
          {optional && <span className="ml-1.5 font-mono text-xs font-normal text-zinc-400">optional</span>}
        </label>
      </div>
    )
  }

  if (base instanceof z.ZodEnum) {
    const options = base.options as string[]
    return (
      <div>
        {labelEl}
        <select
          id={name}
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-400 focus:bg-white"
        >
          <option value="">Select…</option>
          {options.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (base instanceof z.ZodNumber) {
    return (
      <div>
        {labelEl}
        <input
          type="number"
          id={name}
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-400 focus:bg-white"
        />
      </div>
    )
  }

  if (base instanceof z.ZodDate) {
    return (
      <div>
        {labelEl}
        <input
          type="date"
          id={name}
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-400 focus:bg-white"
        />
      </div>
    )
  }

  // ZodString and fallback
  return (
    <div>
      {labelEl}
      <input
        type="text"
        id={name}
        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-400 focus:bg-white"
      />
    </div>
  )
}

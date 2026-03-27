import type { ZodTypeAny } from 'zod'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDef = any

function zodTypeToTs(zodType: ZodTypeAny, indent: number): string {
  const def = zodType.def as AnyDef

  switch (def.type as string) {
    case 'string':
      return 'string'
    case 'number':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'enum': {
      const keys = Object.keys(def.entries as Record<string, string>)
      return keys.map(k => `'${k}'`).join(' | ')
    }
    case 'optional':
      return zodTypeToTs(def.innerType as ZodTypeAny, indent)
    case 'object':
      return objectShapeToTs(def.shape as Record<string, ZodTypeAny>, indent)
    default:
      return 'unknown'
  }
}

function objectShapeToTs(
  shape: Record<string, ZodTypeAny>,
  indent: number,
): string {
  const pad = '  '.repeat(indent + 1)
  const closePad = '  '.repeat(indent)
  const lines = Object.entries(shape).map(([key, value]) => {
    const def = (value as ZodTypeAny).def as AnyDef
    const isOptional = def.type === 'optional'
    const typeStr = zodTypeToTs(value as ZodTypeAny, indent + 1)
    return `${pad}${key}${isOptional ? '?' : ''}: ${typeStr};`
  })
  return `{\n${lines.join('\n')}\n${closePad}}`
}

export function generateTsType(schema: ZodTypeAny): string {
  return `type Schema = ${zodTypeToTs(schema, 0)}`
}

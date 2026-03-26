import type { FieldDef } from './types'

export function buildSchemaText(fields: FieldDef[]): string {
  const valid = fields.filter(f => f.name.trim() !== '' && f.type !== null)
  if (valid.length === 0) return ''

  const lines = valid.map(f => `  ${toFieldKey(f.name)}: ${toZodExpr(f)},`)
  return `z.object({\n${lines.join('\n')}\n})`
}

function toFieldKey(name: string): string {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name) ? name : JSON.stringify(name)
}

function toZodExpr(field: FieldDef): string {
  if (field.type === 'enum') {
    const values =
      field.enumValues.length > 0
        ? field.enumValues.map(v => JSON.stringify(v)).join(', ')
        : '"option1", "option2"'
    return `z.enum([${values}])`
  }

  let expr = `z.${field.type}()`
  for (const v of field.validators) {
    expr += v.arg !== undefined ? `.${v.name}(${v.arg})` : `.${v.name}()`
  }
  return expr
}

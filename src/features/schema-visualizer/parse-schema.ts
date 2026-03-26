import { z, ZodObject } from 'zod'

export type ParseResult =
  | { ok: true; schema: ZodObject<z.ZodRawShape> }
  | { ok: false; error: string }

export function parseSchemaText(text: string): ParseResult {
  if (!text.trim()) return { ok: false, error: 'Schema is empty.' }
  try {
    const schema = new Function('z', `return ${text}`)(z) as unknown
    if (!(schema instanceof ZodObject)) {
      return { ok: false, error: 'Schema must be a z.object({…}).' }
    }
    return { ok: true, schema }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Invalid schema.',
    }
  }
}

import { describe, it, expect } from 'vitest'
import { parseSchemaText } from 'src/features/schema-visualizer/parse-schema'
import { ZodObject } from 'zod'

describe('parseSchemaText', () => {
  describe('empty / blank input', () => {
    it('returns error for empty string', () => {
      const result = parseSchemaText('')
      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.error).toBe('Schema is empty.')
    })

    it('returns error for whitespace-only string', () => {
      const result = parseSchemaText('   \n  ')
      expect(result.ok).toBe(false)
    })
  })

  describe('invalid input', () => {
    it('returns error for syntax error', () => {
      const result = parseSchemaText('z.object({ name: z.string(')
      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.error).toBeTruthy()
    })

    it('returns error when schema is not a z.object()', () => {
      const result = parseSchemaText('z.string()')
      expect(result.ok).toBe(false)
      if (!result.ok)
        expect(result.error).toBe('Schema must be a z.object({…}).')
    })

    it('returns error for z.array()', () => {
      const result = parseSchemaText('z.array(z.string())')
      expect(result.ok).toBe(false)
    })

    it('returns error when referencing an undefined variable', () => {
      const result = parseSchemaText('unknownLib.object({ name: z.string() })')
      expect(result.ok).toBe(false)
    })
  })

  describe('valid schemas', () => {
    it('parses a minimal z.object()', () => {
      const result = parseSchemaText('z.object({ name: z.string() })')
      expect(result.ok).toBe(true)
      if (result.ok) expect(result.schema).toBeInstanceOf(ZodObject)
    })

    it('returns a schema with the correct shape keys', () => {
      const result = parseSchemaText(
        'z.object({ name: z.string(), age: z.number() })',
      )
      expect(result.ok).toBe(true)
      if (result.ok) {
        const keys = Object.keys(result.schema.def.shape)
        expect(keys).toEqual(['name', 'age'])
      }
    })

    it('parses a schema with all supported field types', () => {
      const schema = `z.object({
        title: z.string(),
        count: z.number(),
        active: z.boolean(),
        status: z.enum(["on", "off"]),
      })`
      const result = parseSchemaText(schema)
      expect(result.ok).toBe(true)
    })

    it('parses a schema with optional fields', () => {
      const result = parseSchemaText(
        'z.object({ name: z.string(), bio: z.string().optional() })',
      )
      expect(result.ok).toBe(true)
    })

    it('parses a schema with chained validators', () => {
      const result = parseSchemaText(
        'z.object({ email: z.string().email(), age: z.number().int().min(18).max(99) })',
      )
      expect(result.ok).toBe(true)
    })

    it('parses a schema with z.date()', () => {
      const result = parseSchemaText(
        'z.object({ birthday: z.date(), graduatedAt: z.date().optional() })',
      )
      expect(result.ok).toBe(true)
    })
  })
})

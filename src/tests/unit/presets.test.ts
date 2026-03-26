import { describe, it, expect } from 'vitest'
import { PRESETS } from 'src/features/schema-visualizer/presets'
import { parseSchemaText } from 'src/features/schema-visualizer/parse-schema'

describe('PRESETS', () => {
  it('exports 4 presets', () => {
    expect(PRESETS).toHaveLength(4)
  })

  it('each preset has id, label, and schema', () => {
    for (const preset of PRESETS) {
      expect(preset.id).toBeTruthy()
      expect(preset.label).toBeTruthy()
      expect(preset.schema).toBeTruthy()
    }
  })

  it('all preset ids are unique', () => {
    const ids = PRESETS.map((p: { id: string }) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all preset schemas are valid z.object() schemas', () => {
    for (const { label, schema } of PRESETS) {
      const result = parseSchemaText(schema)
      expect(result.ok, `${label} failed: ${!result.ok ? result.error : ''}`).toBe(true)
    }
  })

  it('all preset schemas have at least one field', () => {
    for (const { schema } of PRESETS) {
      const result = parseSchemaText(schema)
      if (!result.ok) continue
      expect(Object.keys(result.schema.def.shape).length).toBeGreaterThan(0)
    }
  })
})

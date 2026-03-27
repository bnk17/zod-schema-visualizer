import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { generateTsType } from '../../features/schema-visualizer/generate-ts-type';

describe('generateTsType', () => {
  it('returns "type Schema = string" for z.string()', () => {
    expect(generateTsType(z.string())).toBe('type Schema = string');
  });

  it('returns "type Schema = number" for z.number()', () => {
    expect(generateTsType(z.number())).toBe('type Schema = number');
  });

  it('returns "type Schema = boolean" for z.boolean()', () => {
    expect(generateTsType(z.boolean())).toBe('type Schema = boolean');
  });

  it('returns a union of string literals for z.enum()', () => {
    expect(generateTsType(z.enum(['admin', 'user']))).toBe(
      "type Schema = 'admin' | 'user'",
    );
  });

  it('contains "name: string;" for z.object({ name: z.string() })', () => {
    const result = generateTsType(z.object({ name: z.string() }));
    expect(result).toContain('name: string;');
  });

  it('contains "role?: string;" for an optional field', () => {
    const result = generateTsType(z.object({ role: z.optional(z.string()) }));
    expect(result).toContain('role?: string;');
  });

  it('starts with "type Schema = {" for an object schema', () => {
    const result = generateTsType(z.object({ x: z.number() }));
    expect(result).toMatch(/^type Schema = \{/);
  });

  it('falls back to "unknown" for an unrecognised zod type', () => {
    // z.any() has def.type === 'any', which is not handled by the switch
    const result = generateTsType(z.any());
    expect(result).toBe('type Schema = unknown');
  });
});

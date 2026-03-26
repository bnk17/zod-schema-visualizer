Add a new Zod schema preset to the zod-schema-visualizer project.

Preset description: $ARGUMENTS

## Steps

1. Read `src/features/schema-visualizer/presets.ts` to see the existing `SchemaPreset[]` format.
2. Generate a realistic, interesting Zod schema that matches the description. Use a variety of Zod validators (`.min()`, `.max()`, `.email()`, `.positive()`, `.int()`, `.enum()`, `.optional()`, etc.) to showcase breadth.
3. Add the new preset to the `PRESETS` array following the exact same structure:
   - `id`: kebab-case, unique
   - `label`: Title Case, short (2-3 words max)
   - `schema`: formatted `z.object({...})` string, indented with 2 spaces
4. Also add a unit test for the new preset in `src/tests/unit/presets.test.ts` — verify it parses successfully via `parseSchemaText`.

Constraints:
- Schema must only use `z.object({...})` at the top level (no nested objects, no arrays — keep it flat for now)
- All field types must be supported by the existing `FormPreview` component
- Output only the changed files.

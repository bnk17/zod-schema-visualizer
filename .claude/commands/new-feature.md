Create a new feature module for the zod-schema-visualizer project.

Feature name: $ARGUMENTS

## Steps

1. Read `src/features/schema-visualizer/` to understand the existing module structure.
2. Create `src/features/$FEATURE_NAME/` with:
   - `index.ts` — public API (re-exports only)
   - `types.ts` — TypeScript interfaces/types for this feature
   - Any pure logic files (e.g. `parse-*.ts`, `transform-*.ts`)
   - `components/` subdirectory if UI is needed
3. Create test stubs:
   - `src/tests/unit/$FEATURE_NAME.test.ts` — unit tests for pure functions
   - `src/tests/integration/$FEATURE_NAME.test.tsx` — if components exist
4. Follow all patterns from the existing `schema-visualizer` feature exactly — same file naming, same export style, same TypeScript strictness.
5. Do NOT add the feature to `App.tsx` or wire it up — just scaffold the module.

Output only the created files. No explanations.

# TypeScript: Senior-Level Standards
*Derived from: "The Fatal TypeScript Patterns That Make Senior Developers Question Your Experience"*

## 🚫 THE "FATAL" ANTI-PATTERNS (DO NOT USE)
- **The `any` Escape Hatch:** Never use `any`. Use `unknown` + Type Guards if the shape is truly dynamic.
- **Type Assertion Abuse (`as`):** Do not force types. If TypeScript says it's wrong, your logic or interface is wrong. Use Zod for boundary validation instead of casting.
- **Primitive Obsession:** No "magic strings" or numbers. Use **Union Types** or **Enums** to provide semantic meaning.
- **The "Over-Engineer":** Avoid complex, multi-level nested generics unless building a library utility. Keep application code flat and readable.
- **Inconsistent Nullability:** Pick a side. Use `?` for optional properties and `| null` for "empty" data. Ensure `strictNullChecks` is enabled.

## ✅ SENIOR PATTERNS (REQUIRED)
- **Explicit Function Contracts:** Always define return types for exported functions. This acts as a stable API contract.
- **Inference where Obvious:** Do not redundantly type local variables (e.g., `const x: number = 5;`). Let the compiler do its job.
- **Nominal Typing/Branding:** For critical IDs (like `UserId` vs `OrderId`), use branding to prevent accidental swaps.
- **Exhaustiveness Checking:** Use `never` in `switch` statements or `else` blocks to ensure all union cases are handled.
- **Validation Boundaries:** TypeScript types do not exist at runtime. Use **Zod** at every I/O boundary (API calls, LocalStorage, User Input).

## 🛡️ ZOD INTEGRATION
- **Single Source of Truth:** Use `z.infer<typeof schema>` to generate TS types. Never manually sync an interface with a schema.
- **Safe Parsing:** Prefer `safeParse()` for UI logic to prevent runtime crashes.
- **Discriminated Unions:** Use `z.discriminatedUnion()` for handling different "states" or "event types" in your form.

## ⚡ PERFORMANCE & LINTING
- **Const Enums:** Prefer `const enum` or object literal `as const` to avoid unnecessary runtime objects.
- **Utility Types:** Mastery of `Pick`, `Omit`, `Partial`, and `Required` is expected to avoid code duplication.
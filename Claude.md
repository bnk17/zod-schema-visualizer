# Zod-Form-Playground

> **[COMPRESSED_MEMORY]**
> `task:zod-to-form-gen | stack:Bun,Vite,TS,Zod,Vitest,Playwright | aud:CTO/Recruiters | src:src | docs:agent_docs/`

## 💡 WHY (Purpose)
- **Mission:** A high-quality portfolio piece demonstrating advanced TS/Zod manipulation.
- **Target:** CTOs and Lead Devs looking for code quality, type safety, and testing rigor.

## 🗺️ WHAT (Context)
- **Tech:** React + TypeScript via Vite. 
- **Validation:** Zod (Core logic: dynamic form generation from schema).
- **Tooling:** **Bun** (Package manager & runner).
- **Structure:** All logic resides in `src/`. Custom instructions in `agent_docs/`.

## 🛠️ HOW (Commands)
- **Install:** `bun install`
- **Dev:** `bun run dev`
- **Test (Unit):** `bun vitest` or `bun vitest [file]`
- **Test (E2E):** `bun playwright test`
- **Lint/Fix:** `bun run lint`

## 📜 GUIDELINES
- **Strict Context:** Consult `.claudeignore` to avoid indexing bloat.
- **Progressive Disclosure:** - For React/TS patterns: Read `agent_docs/react_ts_best_practices.md`
  - For Testing rules: Read `agent_docs/running_tests.md`
  - For PRs: Read `agent_docs/pr_template.md`
- **Zod Handling:** Prioritize type-safe schema parsing; avoid `any`.

---

## ⚡ AGENT PROTOCOL (System Optimizations)

### 1. System Prompt Compression
* **Minimalism:** Treat instructions as high-density tokens. 
* **Implicit Knowledge:** Do not explain standard Vite/React features unless they deviate from the `/agent_docs` standards.

### 2. Output Limiting
* **Code-First:** Provide the solution directly. 
* **Omit Explanations:** Do not explain *how* the code works or provide "helpful" summaries unless I specifically ask "Why?" or "Explain."
* **Concise Feedback:** If a command fails, provide the fix, not a tutorial.

### 3. Strict Context Management
* **Scope:** Only read files within `src/` or `agent_docs/`. 
* **Ignore:** Respect `.claudeignore` strictly to keep the context window lean and reduce latency.

## Atomic Development: 
Break tasks into small, functional units. Max 5-7 files per PR/commit. Never submit a "mega-PR."
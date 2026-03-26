# Zod Schema Playground

**AI-Assisted Dynamic Form Generation & Validation Sandbox.**

A technical demonstration of building modular, type-safe tools using an AI-collaborative workflow. This project focuses on high-density TypeScript patterns and automated testing.

---

### ⚙️ The Core Logic

A developer tool designed to bridge the gap between schema definition and UI implementation.

- **Input:** Raw Zod schemas.
- **Output:** Dynamically generated React forms with real-time validation.
- **Workflow:** Built using **Atomic Development** (small, functional PRs and commits).

### 🏗️ Tech Stack

- **Runtime:** [Bun](https://bun.sh/) (Fastest package management & test runner).
- **Framework:** React 19 + [Vite](https://vitejs.dev/) (Utilizing the **React Compiler**).
- **Validation:** [Zod](https://zod.dev/) for schema-to-UI mapping.
- **Quality Assurance:** [Vitest](https://vitest.dev/) (Unit) & [Playwright](https://playwright.dev/) (E2E).

### 💎 Key Features

- **Schema-to-Form Generation:** Paste any valid Zod schema and instantly generate a corresponding, accessible React form.
- **Live Validation Feedback:** Experience real-time error handling and input validation driven directly by the Zod schema definitions.
- **Interactive Sandbox:** Test complex validation logic (strings, numbers, enums, etc.) in a live preview environment without local setup.

### 🤖 AI-Native Development

This repository is optimized for AI collaboration (Claude Code / Cursor) using:

- **`CLAUDE.md`:** A runtime configuration for AI agents to maintain context.
- **`agent_docs/`:** A modular documentation folder containing strict design patterns for React, TypeScript, and Testing.
- **Context Management:** Strict `.claudeignore` rules to ensure efficient token usage and high-accuracy code generation.

---

### 🛠️ Commands

```bash
# Setup
bun install
bun run dev

# Testing
bun vitest      # Logic & Unit tests
bun playwright  # Browser E2E tests
```

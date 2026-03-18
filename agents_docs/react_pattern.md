# React Design Patterns & Architecture

## 🏛️ Core Patterns
- **Compound Components:** Use for complex UI (e.g., Form, Tabs). Export a parent and its sub-components (e.g., `Form` and `Form.Input`).
- **Render Props / Children as a Function:** Use for sharing stateful logic that requires UI flexibility.
- **Controlled vs Uncontrolled:** Default to **Uncontrolled** with `useRef` for raw performance in the form editor, but **Controlled** for the live preview.
- **HOCs:** Avoid. Prefer Hooks or Composition.

## ⚛️ Component Guidelines
- **Functional Only:** No Class components.
- **Container/Presenter:** Separate "Logic" (Zod parsing/validation) from "Pure View" (The rendered form).
- **Props Definition:** Use Interface over Type for public component APIs.
- **Performance:** Use `useMemo` for heavy Zod schema parsing and `useCallback` for event handlers passed to deep form children.

## 🎨 UI & State
- **State Colocation:** Keep state as close to the form field as possible. Do not use global state for local form inputs.
- **Error Boundaries:** Wrap the "Live Preview" in an Error Boundary to catch invalid Zod schema injections without crashing the app.
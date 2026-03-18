# 📂 Project Folder Architecture

_Standardized Feature-Based Structure_

## 🏛️ Directory Overview

The project follows a **Feature-Driven Architecture**. Logic should be localized to its domain in `features/` rather than grouped by technical type (e.g., putting all hooks in one folder).

```text
src/
├── assets/            # Static files: images, fonts, icons, global styles
├── common/            # Truly global, cross-feature code
│   ├── components/    # Atomic UI (Buttons, Inputs, Modals) - "The Design System"
│   ├── hooks/         # Generic hooks (useDebounce, useLocalStorage)
│   ├── utils/         # Pure helper functions (formatDate)
│   └── types/         # Global TS interfaces or shared Zod types
├── config/            # Environment variables, constants, API clients
├── features/          # The "Heart" of the app - organized by domain
│   ├── [feature-name]/
│   │   ├── api/       # Feature-specific endpoints (queries/mutations)
│   │   ├── components/# Local components used only in this feature
│   │   ├── hooks/     # Feature-specific logic (e.g., useFormLogic)
│   │   ├── types/     # Feature-specific TS types
│   │   └── index.ts   # Barrel file: Export ONLY what pages/other features need
├── layouts/           # Page wrappers (e.g., MainLayout, DashboardLayout)
├── pages/             # Routing entry points (Must remain thin; import from features)
├── services/          # External integrations (Firebase, Sentry, Analytics)
├── store/             # Global state (Zustand stores or Redux slices)
├── App.tsx            # Root component: Providers & Routing config
└── main.tsx           # Entry point
```

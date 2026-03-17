# Student Portal Subdomain: Project Standards & AI Core Memory

This file provides strict architectural guidance and context for any AI assistant (Claude/Gemini/Cursor) working in this repository.

## 1. Project Overview

- **App Name:** Student Account Portal
- **Domain:** Subdomain application for managing student accounts, feedback, and dashboard metrics.
- **Goal:** Build a robust, scalable React SPA with a strict separation of concerns. The UI must be completely decoupled from the data layer so that the current mock APIs can be seamlessly replaced with a PHP backend in the future.

## 2. Tech Stack & Boundaries

### Frontend (React SPA)
- **Framework:** React 18+ initialized with **Vite**.
- **Language:** TypeScript (`.ts` / `.tsx`). Strict mode is enabled.
- **Routing:** `react-router-dom` v6.
- **State Management:** Zustand (for global state) and React Context (for local/auth state).
- **Styling:** Tailwind CSS.
- **Data Fetching:** Axios + TanStack Query (React Query) for caching and async state management.
- **API Layer:** Strict service pattern. Components must never make raw `fetch` or `axios` calls directly. All calls route through `src/services/`.

## 3. Architecture & Directory Structure

We use a **feature-driven** architecture. Cross-feature imports should be minimized.

```text
src/
├── assets/         # Static files (images, icons, global CSS)
├── components/     # Shared, generic UI components (Buttons, Modals, Inputs)
├── features/       # Domain-specific modules
│   ├── auth/       # Login, password reset
│   ├── dashboard/  # Student overview metrics
│   └── feedback/   # Student feedback system
├── hooks/          # Global custom hooks
├── layouts/        # Page wrappers (AuthLayout, DashboardLayout)
├── routes/         # Route configuration and lazy-loading setup
├── services/       # API configurations, Axios instances, and Mock data layer
├── store/          # Global Zustand stores
├── types/          # Global TypeScript interfaces
└── utils/          # Global utility functions
```

## 4. Development Commands

```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Locally preview the production build
npm run lint     # Run ESLint
```

## 5. Architectural Rules & Mocking Strategy

### The Service Pattern (Crucial)

Because the PHP backend is pending, the frontend must rely on a mocked service layer.

- **Rule 1:** Create an Axios instance in `src/services/api.ts` with a configurable `baseURL` from Vite environment variables (`import.meta.env.VITE_API_BASE_URL`).
- **Rule 2:** Create feature-specific service files (e.g., `src/services/auth.service.ts`).
- **Rule 3:** Inside these services, use `setTimeout` to simulate network latency, returning strongly-typed mock data. Do not put mock data directly inside UI components.

### Component Standards

- Reusable primitives go in `src/components/`. Feature-specific UI goes in `src/features/[feature-name]/components/`.
- Use descriptive prop names. Avoid generic names like `data` or `info`.
- Minimize `useEffect`. Rely on TanStack Query for data synchronization and derived state where possible.

## 6. AI Workflow Directives

- **Avoid Infinite Loops:** If a file is too large or a problem requires heavy computation, break it down into smaller steps.
- **Brevity:** Do not output full files if you only changed one line. Output the specific code block with a few lines of context above and below.
- **No Laziness:** Do not use placeholders like `// ...existing code...` in a way that breaks the application if copy-pasted. Be explicit.
- **Plan First:** For any non-trivial change (2+ files or new logic), write a brief plan and get user approval before writing code.
- **Scope Discipline:** Implement only what is requested. Do not refactor unrelated files.
- **Self-Learn:** When corrected, fix the error AND add to the Lessons Learned ledger below.

## 7. [LESSONS LEARNED] - The AI Correction Ledger

> **Agent Instructions:** Append a new bullet point here immediately after making a mistake and receiving a correction from the user. Format: `[Date] - [Topic]: Rule.`

- `[2026-03-12]` - **Baseline:** Initialized Vite/React architecture and self-learning protocol.
- `[2026-03-12]` - **Routing:** All new pages must be added to the centralized routing configuration in `src/routes/` and wrapped in the appropriate layout component.

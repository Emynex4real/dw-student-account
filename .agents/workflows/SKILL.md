---
name: Student Portal Development
description: Standards and workflow for the Student Account Portal — a React/Vite SPA with a mock service layer designed for future PHP backend integration.
---

# Student Portal Development Skill

## Self-Learning & Verification Protocol

### Step 1: Context Acquisition

Before executing **any** request, read `CLAUDE.md` in the project root to load:

- Tech stack constraints (React 18, Vite, TypeScript, Tailwind CSS)
- Architecture boundaries (feature-driven structure, service pattern)
- The mocking strategy and PHP migration rules
- Lessons learned from past mistakes (the AI Correction Ledger)

### Step 2: Plan & Execute Loop

For any non-trivial change (touching 2+ files or adding new logic):

1. Write a brief plan outlining the affected files and approach
2. Ask the user for approval before writing code
3. Implement with minimal, elegant code — do not refactor unrelated files
4. Keep changes scoped to the requested feature only

### Step 3: Self-Correction Mandate

When corrected on a bug, style, or architecture error:

1. Fix the error immediately
2. Append a new entry to `[LESSONS LEARNED]` in `CLAUDE.md`
3. Format: `* [YYYY-MM-DD] - [Topic]: Rule.`

---

## Architecture Rules

### Feature-Driven Structure

Every domain feature lives under `src/features/<feature-name>/` with its own:

```
src/features/<feature-name>/
├── components/   # UI components specific to this feature
├── hooks/        # Custom hooks (TanStack Query wrappers, form logic, etc.)
├── types/        # TypeScript interfaces and types for this feature
└── api/          # Feature-specific API/service calls
```

- **Never** place feature-specific components in `src/components/` — that folder is for shared, generic UI primitives only (Button, Modal, Input, etc.).
- **Minimize cross-feature imports.** If two features need shared logic, extract it to `src/hooks/`, `src/utils/`, or `src/types/`.

### Service Layer & Mocking Strategy

This is the **most critical architectural rule**. The PHP backend does not exist yet.

1. **All API calls** go through service files — never call `axios` or `fetch` directly from a component.
2. **Mock services** use `src/services/mock.ts` → `mockDelay()` to simulate network latency with strongly-typed return data.
3. **Feature services** live in `src/features/<feature>/api/` (e.g., `src/features/auth/api/auth.service.ts`).
4. **Axios instance** in `src/services/api.ts` reads `VITE_API_BASE_URL` from `.env` — when the PHP backend is ready, update the `.env` and swap mock functions for real HTTP calls. **Components remain untouched.**

### Routing

- All routes are defined centrally in `src/routes/index.tsx`.
- Every new page must be **lazy-loaded** with `React.lazy()` + `<Suspense>`.
- Public routes use `AuthLayout`, protected routes use `DashboardLayout` + `ProtectedRoute`.
- Never define routes inside feature components.

### State Management

- **Zustand** for global state (auth tokens, user profile, app-wide settings) → `src/store/`.
- **TanStack Query** for server-state (API data, caching, revalidation) → feature-level hooks.
- **React Context** only for tightly scoped local state (e.g., a multi-step form wizard).
- **Minimize `useEffect`** — prefer TanStack Query's built-in lifecycle and derived state.

### Styling

- Use **Tailwind CSS** utility classes for all styling.
- Custom design tokens (colors, spacing) live in `tailwind.config.js` under `theme.extend`.
- No inline `style={{}}` attributes unless absolutely necessary for dynamic values.

---

## Workflow: Adding a New Feature

Follow this checklist when scaffolding a new feature (e.g., `profile`, `feedback`, `courses`):

1. **Create the folder structure:**
   ```
   src/features/<feature>/
   ├── components/
   ├── hooks/
   ├── types/
   └── api/
   ```

2. **Define TypeScript types** in `types/` — interfaces for API responses, form data, component props.

3. **Create the mock service** in `api/<feature>.service.ts`:
   - Import `mockDelay` from `src/services/mock.ts`
   - Return strongly-typed mock data wrapped in `mockDelay()`
   - Add JSDoc comments noting which PHP endpoint this will map to

4. **Create TanStack Query hooks** in `hooks/`:
   - `useQuery` for reads, `useMutation` for writes
   - Import the service functions, not raw axios

5. **Build UI components** in `components/`:
   - Page-level components (e.g., `ProfilePage.tsx`)
   - Sub-components as needed (e.g., `ProfileForm.tsx`, `AvatarUpload.tsx`)

6. **Register routes** in `src/routes/index.tsx`:
   - Lazy-import the page component
   - Add under the correct layout (AuthLayout or DashboardLayout)
   - Wrap in `<Suspended>` for loading fallback

7. **Update sidebar navigation** in `src/layouts/DashboardLayout.tsx` if the feature needs a nav link.

---

## Workflow: Preparing for PHP Backend Migration

When the PHP backend is ready, the migration path is:

1. Update `.env`: set `VITE_API_BASE_URL` to the real PHP server URL.
2. In each feature's `api/<feature>.service.ts`:
   - Replace `mockDelay(data)` calls with `api.get()/post()/put()/delete()` using the Axios instance from `src/services/api.ts`.
   - Remove mock data constants.
3. Uncomment the token injection in `src/services/api.ts` request interceptor.
4. Uncomment the 401 redirect in `src/services/api.ts` response interceptor.
5. **Components and hooks remain completely untouched** — they only know about the service interface, not the transport layer.

---

## Code Quality Rules

- **TypeScript strict mode** is enabled — no `any` types without explicit justification.
- **Descriptive names** — avoid generic prop names like `data`, `info`, `item`. Use `studentProfile`, `courseList`, `feedbackEntry`.
- **No barrel exports** (`index.ts` re-exports) unless the feature has 5+ public exports.
- **Error boundaries** — wrap each major feature's route in an error boundary for graceful failure.
- **Accessibility** — all interactive elements must have `aria-label` or visible label text. Form inputs need `htmlFor`/`id` pairing.

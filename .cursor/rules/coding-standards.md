# Coding Standards

These standards apply to ALL code in this repo. Agents must follow them. Reviewers must enforce them.

## TypeScript

- **Strict mode is non-negotiable.** `strict: true` in `tsconfig.json`.
- **No `any`.** Use `unknown` and narrow, or define a proper type.
- **No `// @ts-ignore`** without a comment explaining why and a tracking issue.
- **Prefer `type` over `interface`** unless extending or for public-facing APIs.
- **Discriminated unions** for state with multiple variants.
- **Zod** for runtime validation at API boundaries.

## Next.js (App Router)

- **Server Components by default.** Only add `"use client"` when you actually need it (state, effects, browser APIs).
- **Route handlers** in `app/api/` use the new Route Handler API, not legacy `pages/api/`.
- **Loading/error boundaries** for every route segment that fetches data.
- **Metadata API** for SEO, never `<Head>`.
- **Image component** (`next/image`) always, never raw `<img>`.
- **Link component** (`next/link`) always, never raw `<a>` for internal navigation.

## React Components

- **Functional components only.** No class components.
- **One component per file.** File name matches component name (`CookieBanner.tsx` exports `CookieBanner`).
- **Props typed inline:**

  ```tsx
  type CookieBannerProps = {
    onAccept: () => void;
    onReject: () => void;
  };

  export function CookieBanner({ onAccept, onReject }: CookieBannerProps) { ... }
  ```

- **No default exports** except for Next.js page/layout/route files.
- **Custom hooks** start with `use`, live in `hooks/` directory.

## Styling (Tailwind)

- **Tailwind utilities only.** No CSS modules, no styled-components, no inline styles.
- **`cn()` helper** for conditional classes (from `lib/utils.ts`):
  ```tsx
  className={cn("base-classes", isActive && "active-classes")}
  ```
- **Design tokens** in `tailwind.config.ts` — colors, spacing, typography. Don't hardcode hex values in components.
- **Mobile-first.** Base styles are mobile, use `md:` `lg:` breakpoints to scale up.
- **Dark mode** support via `dark:` prefix where applicable.

## File Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/       # Route groups for marketing pages
│   ├── (app)/             # Authenticated app routes
│   ├── api/               # Route handlers
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                # Reusable UI primitives (Button, Card, etc.)
│   └── features/          # Feature-specific composed components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities, helpers, business logic
│   ├── utils.ts
│   └── validations.ts     # Zod schemas
├── types/                 # Shared TypeScript types
└── styles/
    └── globals.css        # Tailwind directives only
```

## Naming Conventions

- **Files:** PascalCase for components (`CookieBanner.tsx`), camelCase for utilities (`formatDate.ts`), kebab-case for routes (`app/cookie-policy/page.tsx`).
- **Components:** PascalCase (`CookieBanner`).
- **Hooks:** camelCase starting with `use` (`useLocalStorage`).
- **Utilities:** camelCase (`formatDate`, `parseQueryString`).
- **Constants:** SCREAMING_SNAKE_CASE for true constants (`COOKIE_NAMES`), camelCase for config objects.
- **Booleans:** prefix with `is`, `has`, `should`, `can` (`isLoading`, `hasAccepted`).
- **Event handlers:** prefix with `handle` (`handleSubmit`), or `on` for props (`onAccept`).

## State & Data

- **Server state:** TanStack Query / SWR — never raw `useEffect` for fetching.
- **Client state:** React state for component-local, Zustand for global. Avoid Context for everything.
- **Forms:** React Hook Form + Zod for validation.
- **No Redux** unless there's a strong reason.

## Error Handling

- **API routes:** always return typed error responses, never throw bare strings:
  ```ts
  return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  ```
- **Client errors:** use error boundaries (`error.tsx` in App Router).
- **Validation errors:** zod parse failures return 400 with field-level details.
- **Logging:** use a real logger (we standardize on `pino`), never `console.log` in production code.

## Accessibility (Non-Negotiable)

- **Semantic HTML** first. `<button>` for buttons, `<a>` for navigation.
- **ARIA** only when semantic HTML is insufficient.
- **Keyboard navigation** must work for every interactive element.
- **Focus states** visible (don't disable `outline` without replacement).
- **Color contrast** WCAG AA minimum.
- **Forms** have labels (visible or `sr-only`).
- **Images** have meaningful alt text or `alt=""` for decorative.

## Comments

- **Don't explain what.** The code shows what.
- **Explain why** for non-obvious decisions:
  ```ts
  // Vercel Edge runtime doesn't support node:crypto, use Web Crypto API
  const hash = await crypto.subtle.digest("SHA-256", data);
  ```
- **TODO comments** must include an issue number: `// TODO(#42): handle pagination`.
- **JSDoc** for exported functions in shared libraries.

## Imports

- **Order:**
  1. Node built-ins
  2. External packages
  3. Internal aliases (`@/` for `src/`)
  4. Relative imports
- **Path alias** `@/` configured in `tsconfig.json`. Use it for anything outside the current feature folder.
- **Type imports** explicit: `import type { Foo } from "..."`.

## Performance

- **Code splitting:** dynamic imports (`next/dynamic`) for heavy client components.
- **Images:** `next/image` with proper `sizes` and `priority` for above-the-fold.
- **Fonts:** `next/font` for self-hosted, never link to Google Fonts directly.
- **Bundle size:** if you add a package over 50kb gzipped, justify in PR.

## Testing Standards

See `.cursor/rules/testing-standards.md`.

## Security Standards

See `.cursor/rules/security-standards.md`.

## Quick orientation for AI coding agents

This repository is a Next.js 16 (App Router) TypeScript app using Supabase for auth/data, Tailwind for styling, Vitest for tests and Biome for linting/formatting.

Keep instructions short and prescriptive. Prioritize changes that are small, safe, and follow existing patterns (server actions, Supabase client helpers, revalidatePath usage).

Key files to inspect when making changes
- `app/` — Next.js App Router pages and server components (default). Examples: `app/page.tsx` (home), `app/auth/actions.ts` (server actions).
- `lib/supabase/server.ts` — creates Supabase server client using Next cookies; use for server-side code.
- `lib/supabase/client.ts` — creates browser Supabase client for client components.
- `middleware.ts` — refreshes Supabase session on requests; read before changing auth/session behavior.
- `supabase/migrations/` — SQL schema and triggers; apply DB changes here.
- `components/` — shared React components (often client components).
- `__tests__/` and `vitest.config.ts` — unit tests use Vitest + happy-dom; `__tests__/utils/supabase-mock.ts` contains Supabase test mocks.

Architecture and important patterns
- App Router + Server Components: many top-level files (e.g. `app/page.tsx`) are async server components. Prefer server-side data fetching where possible.
- Server vs client Supabase usage: use `lib/supabase/server.ts` for server code (server actions, server components). Use `lib/supabase/client.ts` (createBrowserClient) only inside client components or hooks.
- Server actions: auth flows use server actions (`"use server"`) in `app/auth/actions.ts`. They call `createClient()` (server) and then `revalidatePath(...)` + `redirect(...)` to update cache and navigate.
- Cookies & sessions: middleware sets and syncs cookies for Supabase session; any change to auth/session behavior likely requires updates to `middleware.ts` and `lib/supabase/server.ts`.
- Revalidation: When an action mutates auth/profile data, code calls `revalidatePath('/', 'layout')` — follow this pattern to keep layouts in sync.

Developer workflows (commands)
- Install: `npm install`
- Dev server: `npm run dev` (Next dev on port 3000)
- Build: `npm run build` then `npm run start`
- Tests: `npm run test` (or `npm run test:ui` for the Vitest UI, `npm run test:run` for CI)
- Lint: `npm run lint` (Biome)
- Format: `npm run format` (Biome)

Testing notes
- Vitest runs with `happy-dom` (DOM-like environment). Check `vitest.config.ts` if tests fail.
- The repo provides `__tests__/utils/supabase-mock.ts` — reuse this when writing tests that touch Supabase.

Conventions and gotchas
- Path alias: `@/*` maps to project root (`tsconfig.json`). Import with `@/components/...`.
- Strict TypeScript is enabled. Prefer adding narrow types and prefer explicit casts rather than suppressing errors.
- Server components are the default under `app/`. Add `"use client"` at the top of a file to opt into client behavior.
- Avoid using browser-only APIs in server components (e.g. window, localStorage). If needed, create a small client component wrapper.
- Environment variables: expect `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` (dev). The README documents copying `.env.local.example`.

Integration and DB
- DB migrations live in `supabase/migrations/`. There are SQL triggers that populate `profiles` on signup — be cautious when changing sign-up flows.
- Supabase triggers and row-level logic are relied on by server code (e.g. `signUp` updates `profiles` after Supabase trigger creates a row).

When you modify code, follow this checklist
1. Run `npm run lint` and `npm run test` locally.
2. If you change auth/session flow, update `middleware.ts` and `lib/supabase/server.ts` as needed.
3. Add or update a migration if you change DB schema (`supabase/migrations/`).
4. Use `revalidatePath` + `redirect` in server actions to mirror existing patterns.

Examples to copy from
- Auth server action: `app/auth/actions.ts` — signUp, signIn, signOut, getUser. Copy the pattern of creating a server client and using `revalidatePath`.
- Server client helper: `lib/supabase/server.ts` — shows cookie wiring for server sessions.

If unsure where to change
- Search for patterns first (e.g. `revalidatePath`, `createServerClient`, `createBrowserClient`). Inspect affected files listed above.

Questions or gaps
- If an instruction here is unclear or you'd like additional examples (tests, CI, or a coding convention), tell me which area to expand and I will iterate.

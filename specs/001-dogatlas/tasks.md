# Executable Task List (Derived from Plan)

**Legend**: [P] = parallelizable; "Gate" = must pass before next block.

## Phase 0 — Repo & Foundations

- Create app repo with Next.js + TS + Tailwind. [P]
- Add Prisma + Postgres schema (City, Place, User, Favorite).
- Configure Auth.js; providers (Google + credentials); role on session token.
- Set ENV and safe defaults; add .env.example.

**Gate**: Boots locally, `/api/health` returns 200.

## Phase 1 — Contracts First (Integration-first)

- Write REST contracts in tests for `/api/cities`, `/api/{city}/places`, `/api/{city}/places/{slug}`.
- Write ingest contract tests for POST `/api/admin/ingest` and `/apply`.
- Write favorites contract tests (GET/POST) with auth.

**Gate**: Contract tests exist (red state).

## Phase 2 — Minimal Implementation to Green

- Implement `/api/cities`. [P]
- Implement `/api/{city}/places` with filters and limit 50. [P]
- Implement `/api/{city}/places/{slug}`. [P]
- Implement favorites endpoints with JWT session.
- Implement ingest validate/apply using CSV v0.7 zod schema.

**Gate**: Contract tests green.

## Phase 3 — Pages & UI

- Home with CitySelector (fetch `/api/cities`).
- City hub route `/{city}` (server fetch), list + filters + client map.
- Place detail page with gallery support.
- Auth pages `/login`, `/signup`, `/account`.
- Admin `/admin/ingest` UI for validate/apply.

**Gate**: Quickstart scenarios pass manually.

## Phase 4 — Quality

- Accessibility pass (axe devtools) on main pages. [P]
- Performance check (LCP ≤ 2.5s p75 simulated).
- Security checklist: role gates, input validation, rate-limit basics (if available).
- Logging & error envelopes.

**Gate**: All checks resolved or tracked.

## Phase 5 — Content Onboarding

- Normalize and ingest Paris/Berlin/Rome/Barcelona CSVs.
- Smoke test real data in UI.
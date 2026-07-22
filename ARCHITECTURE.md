# Architecture

## Stack
- Requested: `nextjs-fullstack` (Next.js 15 App Router + TypeScript, single-container fullstack)
- Status: **newly scaffolded** — the repo previously held only a placeholder nginx static site (`index.html` + generic `Dockerfile`); no prior app code existed.

## Layout
Fullstack template — everything lives at the project root, one container:
- `app/` — Next.js App Router pages and API routes
  - `app/layout.tsx` — root layout, carries `data-testid="app-ready"` readiness landmark (added by scaffolder for the render gate)
  - `app/page.tsx` — placeholder home page, to be replaced with the real app UI
  - `app/api/health/route.ts` — health check endpoint (`GET /api/health`)
- `lib/auth.ts` — minimal JWT session helpers (`auth_pattern: jwt_session`)
- `prisma/schema.prisma` — Prisma schema (PostgreSQL), starts with a `User` model
- `prisma/seed.ts` — seed script; prints `SEED_CRED` lines consumed by the deploy pipeline
- `public/` — static assets
- `.pipeline/surface.json` — machine-readable route/component/test-id manifest, kept in sync as routes are added
- `Dockerfile` — multi-stage build, Next.js `output: 'standalone'`, serves on port 3000
- `k8s/`, `kustomization.yaml`, `.github/workflows/colossus-deploy.yml` — colossus-managed deploy manifests, left unchanged by the scaffolder

## Next steps for the developer / coder agent
1. Set `DATABASE_URL` (Postgres) via `app-secrets` / local `.env` — no `.env.template` ships with this template, create one if needed for local dev.
2. Run `npm install`, then `npx prisma generate` and `npx prisma migrate dev` to create the database schema.
3. Run `npm run dev` for local development.
4. Build out the real application in `app/**` per the feature plan, keeping `.pipeline/surface.json` up to date with every new route, component, and `data-testid`.
5. Keep `data-testid="app-ready"` on the persistent root shell (`app/layout.tsx`) — the post-deploy render gate waits for it.
6. `npm run build` to verify the production build before deploy.

## Template source
- `template-nextjs-fullstack` from the scaffold-templates library (Next.js 15 + React 19 + TypeScript + Prisma + `jsonwebtoken`).

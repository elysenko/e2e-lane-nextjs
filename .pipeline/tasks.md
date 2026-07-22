# Pipeline Task Decomposition

## Summary
Recipe Box is a Next.js 15 (App Router, TypeScript) web app that lets visitors browse recipes, add new ones via a simple title form, and read an About page. It exposes `/recipes` (list), `/recipes/new` (create form), and `/about`, redirects `/` → `/recipes`, and auto-seeds 3 example recipes so the list is never empty. A `GET /api/health` endpoint serves deploy probes. Persistence is a relational database with a `recipes` table. The app builds to a standalone server listening on port 80 in a multi-stage Docker image.

## Surface contract
Routes / screens (source of truth for ui_agent + service_agent + tester):
- `GET /` → redirect to `/recipes`.
- `GET /recipes` — heading "My Recipes", one row per recipe (title + short description), prominent "Add Recipe" link to `/recipes/new`. Seeded to 3 rows on a fresh DB.
- `GET /recipes/new` — form with a "Title" field and a "Create" submit button; posts via server action `createRecipe`.
- `GET /about` — static page, heading "About Recipe Box" + short description.
- `GET /api/health` — returns `200 {status:'ok'}`.
- Auth surface (from `<auth_model>` = full_auth): `/login`, `/signup`, `/logout`, admin route group `(admin)` incl. `/admin/settings`.

Entities:
- `Recipe` — `id` (PK, autoincrement), `title` (string, required), `description` (string, default `''`).
- `User` — with `role` field (`UserRole` enum) per full_auth model.
- `SystemSetting` — `key` (PK), `value`, `updatedAt` (backing services present).

## db_agent tasks
- [ ] Create the `Recipe` model/table: `id INTEGER PK AUTOINCREMENT`, `title TEXT NOT NULL`, `description TEXT DEFAULT ''`. Owns schema + migrations only.
- [ ] Add a seed mechanism source of data: 3 example recipes (title + description) used by `ensureSeeded()` when the `recipes` table is empty (idempotent).
- [ ] Add `User` model with `enum UserRole { ADMIN USER }` and `role UserRole @default(USER)` (full_auth model).
- [ ] Add `SystemSetting` model: `key String @id`, `value String`, `updatedAt DateTime @updatedAt` (backing services `postgresql`, `minio` present).
- [ ] Provide/confirm a writable, resolvable DB path and connection initialization used by migrations (create dir if absent).

## backend_agent tasks
- [ ] Implement `createRecipe(formData)` `'use server'` action in `app/recipes/actions.ts`: validate non-empty title, insert row (empty description for user-created), `revalidatePath('/recipes')`, `redirect('/recipes')`.
- [ ] Implement recipe query/data access used by `/recipes` (call `ensureSeeded()` then select all recipes ordered for display).
- [ ] Implement `GET /api/health` route (`app/api/health/route.ts`) returning `200 {status:'ok'}`.
- [ ] Generate admin guard middleware + protect the `(admin)` route group; admin access via role check in the `(admin)` layout.
- [ ] Generate user auth flows (login, signup, logout): first user created via signup gets `ADMIN`, subsequent users get `USER`; protect all non-public app routes (leave `/recipes`, `/recipes/new`, `/about`, `/api/health` public per spec).
- [ ] Generate `lib/config.ts` with `resolveConfig(key)`: read `process.env[key]`; if equal to `PLACEHOLDER_CONFIGURE_IN_SETTINGS` or absent, read from `SystemSetting` DB row; return null if neither set.
- [ ] Generate `GET /api/admin/settings` (list service keys for `postgresql` + `minio` with masked values + configured status) and `PATCH /api/admin/settings` (upsert key-value pairs, admin role required).

## ui_agent tasks
- [ ] Root layout `app/layout.tsx`: `<html>`/`<body>`, shared nav (Recipes, About), metadata title "Recipe Box"; `app/globals.css` minimal styling for list rows, form, button.
- [ ] `app/page.tsx` — redirect to `/recipes`.
- [ ] `app/recipes/page.tsx` — heading "My Recipes", one row per recipe (title + short description), prominent "Add Recipe" `<Link href="/recipes/new">`; empty/loading states.
- [ ] `app/recipes/new/page.tsx` — form with a "Title" input and "Create" submit button bound to the `createRecipe` action; validation/error display for empty title.
- [ ] `app/about/page.tsx` — static page, heading "About Recipe Box" + short description.
- [ ] Generate `/login` and `/signup` screens as part of the main app; admin section in nav visible only to admins (full_auth model).
- [ ] Generate `/admin/settings` page: list each backing service (`postgresql`, `minio`) with configured/unconfigured badge and per-service credential form. No real third-party integrations to add (see Open questions).

## service_agent tasks
- [ ] Wire `/recipes/new` form submission to the `createRecipe` server action and confirm post-submit redirect back to `/recipes` reflects the new row.
- [ ] Wire the `/recipes` page to the recipe data layer (ensure-seeded + list) so rendered rows match DB state.
- [ ] Wire `/admin/settings` UI forms to `GET`/`PATCH /api/admin/settings` (load masked values + configured status, submit upserts).
- [ ] Wire auth screens (`/login`, `/signup`, `/logout`) to their backend auth handlers and session/role state.

## tester tasks
- [ ] `/recipes` on a fresh DB shows heading "My Recipes" + exactly 3 seeded rows (title + description) + an "Add Recipe" button.
- [ ] "Add Recipe" navigates to `/recipes/new`, which shows a Title field and a Create button.
- [ ] Submitting a title adds a recipe and returns to `/recipes` with the new row present (now 4).
- [ ] `/about` shows heading "About Recipe Box"; `/` redirects to `/recipes`.
- [ ] `GET /api/health` returns `200 {status:'ok'}`.
- [ ] Auth flows: signup (first user → ADMIN, next → USER), login, logout; `(admin)` group and `/admin/settings` blocked for non-admins, reachable by admin.
- [ ] Admin settings: `GET/PATCH /api/admin/settings` masks values, shows configured status, upserts service credentials.
- [ ] `npm run build` succeeds; `docker build` succeeds and the container serves on port 80.

## Open questions
- **Auth conflict:** The spec explicitly states "No authentication" and the assumptions section says the auth baseline is intentionally not applied, but `<auth_model>` is `full_auth`. Tasks follow the mandated full_auth model; downstream agents must confirm which wins. If auth is truly out of scope, drop the auth/login/signup and admin-guard tasks and keep all app routes public.
- **Database conflict:** The spec uses SQLite (`better-sqlite3`) with a `recipes` table, but `<spec_deployments>` lists `postgresql` and `minio`, and the settings rules assume a Prisma-style `SystemSetting`/`User` schema. Confirm the actual datastore (SQLite vs. Postgres) and whether MinIO is used at all — the spec declares no object-storage usage.
- **Integrations:** `<spec_integrations>` contains only a sentinel entry ("None — no third-party APIs or external services") with a placeholder env key; the spec's Integrations section is explicitly "None." No integration client modules created. Confirm there are genuinely no integrations before wiring `lib/integrations/*`.
- **Admin settings scope:** Spec does not describe an admin settings page; it is added only because `<spec_deployments>` is non-empty. Confirm whether the Recipe Box app should surface Postgres/MinIO credential management UI at all.

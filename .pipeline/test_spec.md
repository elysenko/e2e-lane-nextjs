# Test Specification

> **Scope note:** The approved spec is authoritative and states **"No authentication"** with an
> explicit assumption that "the standard auth baseline is intentionally not applied." The upstream
> `tasks.md` speculatively added a `full_auth` model (`/login`, `/signup`, `(admin)`,
> `/api/admin/settings`) and Postgres/MinIO settings, but flags these as unresolved conflicts where
> "the spec wins." This test spec therefore follows the spec: all app routes are public, persistence
> is SQLite, and auth/admin-settings surfaces are listed under **Out of scope**. `surface.json`
> confirms only one API route (`GET /api/health`); the page routes are covered as UI/journey tests.

## Coverage summary
- Total cases: 27
- API endpoints covered: 1 / 1 (`surface.json` lists only `GET /api/health`)
- User journeys covered: 6

## API tests

### `GET /api/health`
- **Happy path**: `GET /api/health` with no auth → `200`, body is JSON `{ "status": "ok" }`, `Content-Type: application/json`.
- **Validation failures**: N/A — endpoint takes no input parameters or body.
- **Auth failures**: N/A — endpoint is public (no auth in this app); a request with no credentials must still return `200` (never `401`/`403`).
- **Idempotency / edge cases**:
  - Repeated calls always return the same `200 {status:'ok'}` (stateless, read-only, no DB side effects).
  - Non-GET verbs (e.g. `POST /api/health`) → `405 Method Not Allowed` (only `GET` is defined).
  - Endpoint responds even before any recipe/seed activity (used as a deploy readiness probe).

## UI / journey tests

### Journey: Root redirect
- **Steps**: Navigate to `/`.
- **Expected outcomes**: Server issues a redirect to `/recipes`; final resolved URL is `/recipes`; the "My Recipes" heading is visible. No login prompt appears.
- **Negative path**: N/A — `/` has no inputs; it must never render its own content (always redirect).

### Journey: Browse seeded recipe list (fresh DB)
- **Steps**: Ensure a fresh/empty database (or first request after startup), navigate to `/recipes`.
- **Expected outcomes**:
  - Heading text exactly "My Recipes" is visible (`<h1>`-level).
  - Exactly **3** recipe rows render (auto-seeded), each showing a non-empty **title** and its short **description** text.
  - A prominent "Add Recipe" link/button is visible and its `href` is `/recipes/new`.
  - Shared nav (links to Recipes and About) is present; page loads with no login prompt.
- **Negative path**: The list is **never empty** — if the DB was reset, `ensureSeeded()` re-inserts the 3 examples before rendering, so the count is always ≥ 3.

### Journey: Navigate to the Add Recipe form
- **Steps**: From `/recipes`, click the "Add Recipe" link.
- **Expected outcomes**: URL becomes `/recipes/new`; the page shows a form containing a "Title" input field and a "Create" submit button. Shared nav still present.
- **Negative path**: N/A — navigation only.

### Journey: Create a recipe (happy path)
- **Steps**: On `/recipes/new`, type a non-empty title (e.g. `"Test Pancakes"`) into the Title field, click "Create".
- **Expected outcomes**:
  - The `createRecipe` server action inserts a row (with an empty description for user-created recipes), calls `revalidatePath('/recipes')`, and redirects to `/recipes`.
  - Final URL is `/recipes`; the new row "Test Pancakes" is present in the list; total row count is now **4** (3 seeded + 1 new).
  - The new recipe persists across a re-fetch of `/recipes` within the same running instance.
- **Negative path**: Submitting an **empty/whitespace-only** title → the action rejects the insert (validates non-empty title); no new row is created and the list count stays at its prior value. (Behaviour surfaced as a validation error and/or a no-op stay on the form — implementation-defined but must not persist an empty-title recipe.)

### Journey: Persistence / never-empty guarantee
- **Steps**: Load `/recipes` (seeds to 3). Simulate an app restart or a reset DB. Load `/recipes` again.
- **Expected outcomes**: The list still shows ≥ 3 recipes (re-seeded when the table is empty); the page is never empty. Note: SQLite storage is per-pod ephemeral, so user-added rows may not survive a pod restart, but the seeded 3 always reappear.
- **Negative path**: A missing/unwritable DB directory must be created/resolved defensively rather than crashing the page (see Data integrity tests).

### Journey: About page
- **Steps**: Navigate to `/about` (directly and via the nav link).
- **Expected outcomes**: Heading text exactly "About Recipe Box" is visible, plus a short description paragraph. Route is deep-linkable and loads with no login prompt.
- **Negative path**: N/A — static page, no inputs.

## Data integrity tests
- After seeding on an empty DB, the `recipes` table contains exactly 3 rows, each with a non-null `title` and a `description` string.
- `ensureSeeded()` is **idempotent**: calling it when the table already has ≥ 1 row inserts nothing (count is unchanged; no duplicate seed rows accumulate across repeated `/recipes` loads).
- Schema invariants hold: `id` is an autoincrement PK (unique, monotonic), `title` is `NOT NULL`, `description` defaults to `''`.
- After a successful `createRecipe`, row count increases by exactly 1 and the persisted title equals the submitted (trimmed, non-empty) value; user-created rows have `description = ''`.
- An empty-title submission produces **no** new row (count invariant preserved).
- The DB path is writable: the connection initializes (creating the directory if absent) without runtime error on first query.

## Out of scope
- **Authentication & authorization** (`/login`, `/signup`, `/logout`, `(admin)` group, admin guards): the spec explicitly declares "No authentication," so no login/session/role behaviour is tested. Positive assertion retained everywhere: pages load with **no login prompt**.
- **Admin settings UI and `GET`/`PATCH /api/admin/settings`**: not described by the spec (only introduced by upstream deployment metadata); no test cases until the conflict is resolved in favour of adding them.
- **Postgres / MinIO backing services and `SystemSetting`/`User` models**: the spec's datastore is SQLite with a single `recipes` table; other datastores/models are not under test.
- **Third-party integrations**: the spec's Integrations section is "None"; nothing to test.
- **Build/container mechanics** (`npm run build`, `docker build`, port-80 binding, ingress prefix rewrite): these are pipeline/CI concerns validated by the build and deploy stages, not functional test cases in this document (noted here for traceability to the spec's Testing Strategy).
- **Exact seed content and styling/CSS specifics**: the spec fixes the count (3) and required fields (title + description) but not the literal recipe text or visual styling, so only structural/behavioural assertions are made.

Wrote .pipeline/test_spec.md (27 cases across 1 endpoints / 6 journeys).

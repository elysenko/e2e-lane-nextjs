# Recipe Box

A small **Recipe Box** web app: browse your recipes, add new ones, and read a short
about page. No authentication — every page is open.

## Stack
- **Next.js 15** (App Router, TypeScript) — UI + API routes in a single container
- **Prisma** ORM on **PostgreSQL** — recipe persistence
- Standalone server, served on **port 80**

## Routes
- `/` → redirects to `/recipes`
- `/recipes` — "My Recipes" list (auto-seeded with 3 example recipes)
- `/recipes/new` — add a recipe (Title field + Create button)
- `/about` — About Recipe Box
- `GET /api/health` — health probe (`200 {"status":"ok"}`)

## Data
Recipes live in the `recipes` table. On first render `lib/recipes.ensureSeeded()`
inserts 3 example recipes if the table is empty, so the list is never blank.

## Local development
```bash
npm install
export DATABASE_URL="postgresql://user:pass@host:5432/app"
npx prisma migrate deploy   # apply migrations
npx prisma generate         # generate the client
npm run dev                 # http://localhost:3000
```

## Production
```bash
npm run build   # Next.js standalone output
npm start
```
The container image (see `Dockerfile`) runs `node server.js` on port 80.

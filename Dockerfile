# syntax=docker/dockerfile:1
# Multi-stage build for the Next.js 15 (App Router) standalone server.
# Serves on port 80 to match the k8s Service targetPort: 80.
FROM node:20-alpine AS base
# libc6-compat + openssl are required by the Prisma query engine on alpine (musl).
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# --- deps: install dependencies and generate the Prisma client ---
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate

# --- builder: produce the Next.js standalone bundle ---
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- runner: minimal production image ---
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Next.js standalone server reads PORT/HOSTNAME from the environment.
ENV PORT=80
ENV HOSTNAME=0.0.0.0
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# The Next.js file-trace does not reliably include the Prisma query-engine
# binary (loaded dynamically), so copy the generated client explicitly.
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
# Keep the schema + migrations available for reference / boot-time migrate deploy.
COPY --from=builder /app/prisma ./prisma

EXPOSE 80
CMD ["node", "server.js"]

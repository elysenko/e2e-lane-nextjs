import { PrismaClient } from '@prisma/client';

// Reuse a single PrismaClient across hot-reloads / module instances. Next.js
// dev re-evaluates modules on every request, which would otherwise exhaust the
// Postgres connection pool with a new client each time.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Seed contract (Colossus): every seeded demo credential MUST be printed as a
// `SEED_CRED <ROLE> <email> <password>` line (or a single SEED_CREDS_JSON line) —
// the deploy activity sync_seed_credentials parses stdout to populate
// deployments.appDemoCredentials. Keep these lines when extending this seed.
import { PrismaClient, Role } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

function derivePassword(email: string): string {
  return createHash('sha256')
    .update(email + (process.env.SEED_SECRET || 'colossus-seed'))
    .digest('hex')
    .slice(0, 16);
}

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

const SEED_USERS: Array<{ email: string; name: string; role: Role }> = [
  { email: 'admin@example.com', name: 'Admin User', role: Role.ADMIN },
  { email: 'user@example.com', name: 'Regular User', role: Role.USER },
];

const SEED_RECIPES = [
  {
    title: 'Classic Margherita Pizza',
    description: 'Blistered dough, San Marzano tomatoes, fresh mozzarella and basil.',
    emoji: '🍕',
  },
  {
    title: 'Weeknight Veggie Stir-Fry',
    description: 'Crisp seasonal vegetables tossed in garlic-ginger soy sauce over rice.',
    emoji: '🥦',
  },
  {
    title: 'Grandma’s Banana Bread',
    description: 'Moist, lightly spiced loaf made with over-ripe bananas and walnuts.',
    emoji: '🍌',
  },
];

async function main(): Promise<void> {
  const creds: Array<{ role: string; email: string; password: string }> = [];
  for (const u of SEED_USERS) {
    const password = derivePassword(u.email);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role, password: hashPassword(password) },
      create: { email: u.email, name: u.name, role: u.role, password: hashPassword(password) },
    });
    console.log(`SEED_CRED ${u.role} ${u.email} ${password}`);
    creds.push({ role: u.role, email: u.email, password });
  }
  console.log(`SEED_CREDS_JSON ${JSON.stringify(creds)}`);

  // Seed the 3 example recipes only when the table is empty (idempotent). The
  // app also self-seeds at runtime (lib/recipes.ensureSeeded), so the recipe
  // list is never empty even if this job is skipped.
  const recipeCount = await prisma.recipe.count();
  if (recipeCount === 0) {
    await prisma.recipe.createMany({ data: SEED_RECIPES });
    console.log(`SEED_RECIPES ${SEED_RECIPES.length}`);
  }
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

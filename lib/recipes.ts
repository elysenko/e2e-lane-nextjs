import { prisma } from './prisma';

export interface Recipe {
  id: number;
  title: string;
  description: string;
  emoji: string;
}

// The 3 example recipes the box is seeded with so `/recipes` is never empty.
// Mirrors the mockup's SEED_RECIPES so the deployed app matches the preview.
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

const EMOJI_POOL = ['🍲', '🥗', '🍜', '🍰', '🥘', '🌮', '🍝', '🥧', '🍚', '🧁'];

/**
 * Insert the 3 example recipes when the table is empty. Idempotent — safe to
 * call on every list render. Guarantees the recipe list is never empty even on
 * a fresh / reset database.
 */
export async function ensureSeeded(): Promise<void> {
  const count = await prisma.recipe.count();
  if (count === 0) {
    await prisma.recipe.createMany({ data: SEED_RECIPES });
  }
}

/** Return every recipe, newest first (seeded rows first on a fresh box). */
export async function listRecipes(): Promise<Recipe[]> {
  const rows = await prisma.recipe.findMany({ orderBy: { id: 'asc' } });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    emoji: r.emoji,
  }));
}

/**
 * Insert a new recipe. Title is required (non-empty after trimming);
 * user-created recipes get an empty description and a rotating emoji.
 * Returns null if the title is blank.
 */
export async function createRecipe(title: string): Promise<Recipe | null> {
  const trimmed = title.trim();
  if (trimmed.length === 0) return null;
  const emoji = EMOJI_POOL[Math.abs(trimmed.length) % EMOJI_POOL.length];
  const row = await prisma.recipe.create({
    data: { title: trimmed, description: '', emoji },
  });
  return { id: row.id, title: row.title, description: row.description, emoji: row.emoji };
}

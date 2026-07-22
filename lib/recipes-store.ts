'use client';

/**
 * Mockup data store for the Recipe Box UI.
 *
 * This is a browser-only (localStorage) stand-in so the mockup renders and the
 * add-recipe flow works end-to-end in the static preview. The backend/service
 * agents replace this with the real data layer:
 *   - GET list  -> `app/recipes/page.tsx` server component + `lib/seed.ensureSeeded()`
 *   - create    -> `createRecipe(formData)` server action in `app/recipes/actions.ts`
 * The seed data below mirrors the 3 example recipes the DB seed provides.
 */

export interface Recipe {
  id: number;
  title: string;
  description: string;
  emoji?: string;
}

const STORAGE_KEY = 'recipe-box:recipes';

export const SEED_RECIPES: Recipe[] = [
  {
    id: 1,
    title: 'Classic Margherita Pizza',
    description: 'Blistered dough, San Marzano tomatoes, fresh mozzarella and basil.',
    emoji: '🍕',
  },
  {
    id: 2,
    title: 'Weeknight Veggie Stir-Fry',
    description: 'Crisp seasonal vegetables tossed in garlic-ginger soy sauce over rice.',
    emoji: '🥦',
  },
  {
    id: 3,
    title: 'Grandma’s Banana Bread',
    description: 'Moist, lightly spiced loaf made with over-ripe bananas and walnuts.',
    emoji: '🍌',
  },
];

const EMOJI_POOL = ['🍲', '🥗', '🍜', '🍰', '🥘', '🌮', '🍝', '🥧', '🍚', '🧁'];

function read(): Recipe[] {
  if (typeof window === 'undefined') return SEED_RECIPES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_RECIPES));
      return SEED_RECIPES;
    }
    const parsed = JSON.parse(raw) as Recipe[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_RECIPES;
  } catch {
    return SEED_RECIPES;
  }
}

function write(recipes: Recipe[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

/** Return all recipes (seeded so the list is never empty). */
export function getRecipes(): Recipe[] {
  return read();
}

/** Insert a new recipe (title required, empty description for user-created rows). */
export function addRecipe(title: string): Recipe {
  const recipes = read();
  const nextId = recipes.reduce((max, r) => Math.max(max, r.id), 0) + 1;
  const recipe: Recipe = {
    id: nextId,
    title: title.trim(),
    description: '',
    emoji: EMOJI_POOL[nextId % EMOJI_POOL.length],
  };
  write([...recipes, recipe]);
  return recipe;
}

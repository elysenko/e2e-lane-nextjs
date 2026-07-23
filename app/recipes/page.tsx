import Link from 'next/link';
import { RecipeList } from './recipe-list';
import { ensureSeeded, listRecipes } from '@/lib/recipes';

export const metadata = {
  title: 'My Recipe Collection · Recipe Box',
};

// Recipes are read from the database on every request; never statically cached.
export const dynamic = 'force-dynamic';

export default async function RecipesPage() {
  await ensureSeeded();
  const recipes = await listRecipes();

  return (
    <div data-testid="recipes-main">
      <div className="page-head">
        <div>
          <h1 className="page-title" data-testid="recipes-heading">
            My Recipe Collection
          </h1>
          <p className="page-sub">Everything in your box, all in one place.</p>
        </div>
        <Link href="/recipes/new" className="btn btn-primary" data-testid="add-recipe-link">
          + Add Recipe
        </Link>
      </div>

      <RecipeList recipes={recipes} />
    </div>
  );
}

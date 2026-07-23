import Link from 'next/link';
import type { Recipe } from '@/lib/recipes';

/**
 * Server-rendered recipe list. Rows come from the database
 * (`ensureSeeded()` + `listRecipes()` in `app/recipes/page.tsx`), so the list
 * is populated on first paint with no client fetch.
 */
export function RecipeList({ recipes }: { recipes: Recipe[] }) {
  // Empty state (shouldn't happen thanks to seeding, but handled anyway).
  if (recipes.length === 0) {
    return (
      <div className="state-card" data-testid="recipes-empty">
        <div className="state-emoji" aria-hidden="true">
          🍽️
        </div>
        <h2>No recipes yet</h2>
        <p>Add your first recipe to get started.</p>
        <p style={{ marginTop: 18 }}>
          <Link href="/recipes/new" className="btn btn-primary" data-testid="empty-add-link">
            + New Recipe
          </Link>
        </p>
      </div>
    );
  }

  return (
    <ul className="recipe-list" data-testid="recipes-list">
      {recipes.map((recipe) => (
        <li key={recipe.id} className="recipe-row" data-testid="recipe-row">
          <span className="recipe-emoji" aria-hidden="true">
            {recipe.emoji ?? '🍲'}
          </span>
          <div className="recipe-body">
            <p className="recipe-title" data-testid="recipe-title">
              {recipe.title}
            </p>
            {recipe.description ? (
              <p className="recipe-desc">{recipe.description}</p>
            ) : (
              <p className="recipe-desc">A tasty new addition to your box.</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRecipes, type Recipe } from '@/lib/recipes-store';

/**
 * Client renderer for the recipe list (mockup data layer).
 * Backend swap: replace this with server-rendered rows from
 * `ensureSeeded()` + a `SELECT * FROM recipes` in `app/recipes/page.tsx`.
 */
export function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);

  useEffect(() => {
    setRecipes(getRecipes());
  }, []);

  // Loading state (first client paint)
  if (recipes === null) {
    return (
      <ul className="recipe-list" aria-hidden="true" data-testid="recipes-loading">
        {[0, 1, 2].map((i) => (
          <li key={i} className="skeleton-row" />
        ))}
      </ul>
    );
  }

  // Empty state (shouldn't happen thanks to seeding, but handled anyway)
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
            + Add Recipe
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

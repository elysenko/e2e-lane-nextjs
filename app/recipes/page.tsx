import Link from 'next/link';
import { RecipeList } from './recipe-list';

export const metadata = {
  title: 'My Recipes · Recipe Box',
};

export default function RecipesPage() {
  return (
    <div data-testid="recipes-main">
      <div className="page-head">
        <div>
          <h1 className="page-title" data-testid="recipes-heading">
            My Recipes
          </h1>
          <p className="page-sub">Everything in your box, all in one place.</p>
        </div>
        <Link href="/recipes/new" className="btn btn-primary" data-testid="add-recipe-link">
          + Add Recipe
        </Link>
      </div>

      <RecipeList />
    </div>
  );
}

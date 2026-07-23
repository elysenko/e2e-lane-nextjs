/**
 * Route-level loading UI for /recipes. Next.js renders this automatically
 * while the async server page (`ensureSeeded()` + `listRecipes()`) resolves.
 */
export default function RecipesLoading() {
  return (
    <div className="state-card" data-testid="recipes-loading" aria-busy="true">
      <div className="state-emoji" aria-hidden="true">
        🍲
      </div>
      <h2>Loading recipes…</h2>
      <p>Fetching everything in your box.</p>
    </div>
  );
}

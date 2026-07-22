'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addRecipe } from '@/lib/recipes-store';

/**
 * Add Recipe form.
 *
 * Mockup wiring: uses the client `addRecipe()` store so the flow works in the
 * preview. Backend/service swap: bind this form to the `createRecipe(formData)`
 * server action (`app/recipes/actions.ts`) via `<form action={createRecipe}>`;
 * the action validates the title, inserts the row, `revalidatePath('/recipes')`
 * and `redirect('/recipes')`.
 */
export default function NewRecipePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (title.trim().length === 0) {
      setError('Please enter a title for your recipe.');
      return;
    }
    setError(null);
    setSubmitting(true);
    addRecipe(title);
    router.push('/recipes');
  }

  return (
    <div data-testid="new-recipe-main">
      <div className="page-head">
        <div>
          <h1 className="page-title">Add a Recipe</h1>
          <p className="page-sub">Give your recipe a name to save it to your box.</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} data-testid="new-recipe-form" noValidate>
          <div className="form-field">
            <label className="form-label" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              className="form-input"
              type="text"
              placeholder="e.g. Lemon Garlic Roast Chicken"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'title-error' : undefined}
              autoFocus
            />
            {error ? (
              <span id="title-error" className="form-error" data-testid="title-error" role="alert">
                {error}
              </span>
            ) : (
              <span className="form-hint">You can add ingredients and steps later.</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              data-testid="create-button"
              disabled={submitting}
            >
              {submitting ? 'Saving…' : 'Create'}
            </button>
            <Link href="/recipes" className="btn btn-ghost" data-testid="cancel-link">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

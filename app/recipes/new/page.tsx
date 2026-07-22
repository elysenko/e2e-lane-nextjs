'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { createRecipe } from '../actions';

/**
 * Add Recipe form. Bound to the `createRecipe` server action
 * (`app/recipes/actions.ts`) via `useActionState`: the action validates the
 * title, inserts the row, `revalidatePath('/recipes')` and
 * `redirect('/recipes')`. A blank title returns an inline error.
 */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn btn-primary"
      data-testid="create-button"
      disabled={pending}
    >
      {pending ? 'Saving…' : 'Create'}
    </button>
  );
}

export default function NewRecipePage() {
  const [state, formAction] = useActionState(createRecipe, {});
  const error = state?.error;

  return (
    <div data-testid="new-recipe-main">
      <div className="page-head">
        <div>
          <h1 className="page-title">Add a Recipe</h1>
          <p className="page-sub">Give your recipe a name to save it to your box.</p>
        </div>
      </div>

      <div className="card">
        <form action={formAction} data-testid="new-recipe-form">
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
            <SubmitButton />
            <Link href="/recipes" className="btn btn-ghost" data-testid="cancel-link">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

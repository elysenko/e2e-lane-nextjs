'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createRecipe as insertRecipe } from '@/lib/recipes';

/**
 * Server action bound to the Add Recipe form. Validates a non-empty title,
 * inserts the row, revalidates the list, and redirects back to `/recipes`.
 * On a blank title it returns an error string (rendered inline by the form).
 */
export async function createRecipe(
  _prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const title = String(formData.get('title') ?? '');
  if (title.trim().length === 0) {
    return { error: 'Please enter a title for your recipe.' };
  }
  await insertRecipe(title);
  revalidatePath('/recipes');
  redirect('/recipes');
}

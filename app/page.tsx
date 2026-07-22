import { redirect } from 'next/navigation';

export default function Home() {
  // `/` is not a real screen — send visitors straight to the recipe list.
  redirect('/recipes');
}

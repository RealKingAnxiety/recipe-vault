import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import RecipeForm from '@/components/RecipeForm';

export default async function NewRecipePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-10">New Recipe</h1>
      <RecipeForm />
    </div>
  );
}
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import clientPromise from '@/lib/db';
import RecipeCard from '@/components/RecipeCard';

export default async function RecipesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const client = await clientPromise;
  const db = client.db();
  
  const recipes = await db.collection('recipes')
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .toArray();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-10">
        <h1 className="text-5xl font-bold">My Recipes</h1>
        <a href="/recipes/new" className="bg-orange-600 text-white px-6 py-3 rounded-2xl hover:bg-orange-700">
          + New Recipe
        </a>
      </div>
      
      {recipes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl">
          <p className="text-2xl text-gray-500 mb-6">You don&apos;t have any recipes yet</p>
          <a href="/recipes/new" className="bg-orange-600 text-white px-8 py-4 rounded-2xl inline-block hover:bg-orange-700">
            Create your first recipe
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe: any) => (
            <RecipeCard 
              key={recipe._id.toString()} 
              recipe={{
                ...recipe,
                _id: recipe._id.toString()
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
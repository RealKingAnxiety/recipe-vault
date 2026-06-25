import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import clientPromise from '@/lib/db';
import RecipeForm from '@/components/RecipeForm';
import { ObjectId } from 'mongodb';

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const client = await clientPromise;
  const db = client.db();

  let recipe;
  try {
    recipe = await db.collection('recipes').findOne({ 
      _id: new ObjectId(id), 
      userId: session.user.id 
    });
  } catch (e) {
    redirect('/recipes');
  }

  if (!recipe) redirect('/recipes');

  // Convert MongoDB document to plain JavaScript object
  const plainRecipe = {
    _id: recipe._id.toString(),
    name: recipe.name,
    image: recipe.image,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-10">Edit Recipe</h1>
      <RecipeForm recipe={plainRecipe} />
    </div>
  );
}
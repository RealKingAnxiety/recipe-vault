import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import clientPromise from '@/lib/db';
import Image from 'next/image';
import { ObjectId } from 'mongodb';

type Recipe = {
  _id: string;
  name: string;
  image?: string;
  ingredients: string[];
  steps: string[];
};

export default async function RecipeDetail({ params }: { params: Promise<{ id: string }> }) {
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

  // Convert MongoDB document to plain typed object
  const plainRecipe: Recipe = {
    _id: recipe._id.toString(),
    name: recipe.name,
    image: recipe.image,
    ingredients: recipe.ingredients || [],
    steps: recipe.steps || [],
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {plainRecipe.image && (
        <div className="relative h-[500px] rounded-3xl overflow-hidden mb-10">
          <Image 
            src={plainRecipe.image} 
            alt={plainRecipe.name} 
            fill 
            className="object-cover" 
          />
        </div>
      )}

      <h1 className="text-5xl font-bold mb-8">{plainRecipe.name}</h1>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Ingredients</h2>
          <ul className="space-y-3 text-lg">
            {plainRecipe.ingredients.map((ing: string, i: number) => (
              <li key={i} className="flex gap-3">
                <span className="text-orange-500 font-bold">•</span> {ing}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Instructions</h2>
          <ol className="space-y-6 text-lg">
            {plainRecipe.steps.map((step: string, i: number) => (
              <li key={i} className="flex gap-4">
                <span className="font-mono text-orange-600 font-bold flex-shrink-0">{i + 1}.</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
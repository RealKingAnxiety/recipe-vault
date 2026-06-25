'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Recipe = {
  _id: string;
  name: string;
  image?: string;
  ingredients: string[];
  steps: string[];
};

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Delete this recipe?')) return;

    const res = await fetch(`/api/recipes/${recipe._id}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <div className="recipe-card bg-white rounded-3xl overflow-hidden shadow-sm border">
      {recipe.image && (
        <div className="relative h-56">
          <Image 
            src={recipe.image} 
            alt={recipe.name}
            fill 
            className="object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <h3 className="font-semibold text-2xl mb-4 line-clamp-2">{recipe.name}</h3>
        
        <div className="flex gap-3 mt-6">
          <Link
            href={`/recipes/${recipe._id}`}
            className="flex-1 text-center py-3 border border-gray-300 rounded-2xl hover:bg-gray-50"
          >
            View
          </Link>
          <Link
            href={`/recipes/${recipe._id}/edit`}
            className="flex-1 text-center py-3 bg-orange-100 text-orange-700 rounded-2xl hover:bg-orange-200 flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" /> Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex-1 text-center py-3 bg-red-100 text-red-700 rounded-2xl hover:bg-red-200 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
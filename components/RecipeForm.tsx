'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Recipe = {
  _id?: string;
  name: string;
  image?: string;
  ingredients: string[];
  steps: string[];
};

export default function RecipeForm({ recipe }: { recipe?: Recipe }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: recipe?.name || '',
    image: recipe?.image || '',
    ingredients: recipe?.ingredients || [''],
    steps: recipe?.steps || [''],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const payload = {
      name: formData.name,
      image: formData.image,
      ingredients: formData.ingredients.filter(i => i.trim() !== ''),
      steps: formData.steps.filter(s => s.trim() !== ''),
    };

    try {
      const url = recipe?._id 
        ? `/api/recipes/${recipe._id}` 
        : '/api/recipes';
      
      const method = recipe?._id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert(recipe ? 'Recipe updated successfully! 🎉' : 'Recipe created successfully! 🎉');
        router.push('/recipes');
        router.refresh();
      } else {
        setError(data.error || 'Failed to save recipe');
      }
    } catch (err: any) {
      console.error(err);
      setError('Network error - please check your connection and try again');
    } finally {
      setIsLoading(false);
    }
  };

  const addIngredient = () => {
    setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
  };

  const addStep = () => {
    setFormData(prev => ({ ...prev, steps: [...prev.steps, ''] }));
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length === 1) return;
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const removeStep = (index: number) => {
    if (formData.steps.length === 1) return;
    const newSteps = formData.steps.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Recipe Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Image URL (optional)</label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
          className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Ingredients</label>
        {formData.ingredients.map((ing, index) => (
          <div key={index} className="flex gap-3 mb-3">
            <input
              type="text"
              value={ing}
              onChange={(e) => updateIngredient(index, e.target.value)}
              className="flex-1 px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={`Ingredient ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="text-red-500 hover:text-red-700 px-3"
            >
              ✕
            </button>
          </div>
        ))}
        <button 
          type="button" 
          onClick={addIngredient}
          className="text-orange-600 hover:text-orange-700 text-sm font-medium"
        >
          + Add another ingredient
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Steps</label>
        {formData.steps.map((step, index) => (
          <div key={index} className="flex gap-3 mb-3">
            <textarea
              value={step}
              onChange={(e) => updateStep(index, e.target.value)}
              className="flex-1 px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 h-24"
              placeholder={`Step ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => removeStep(index)}
              className="text-red-500 hover:text-red-700 px-3"
            >
              ✕
            </button>
          </div>
        ))}
        <button 
          type="button" 
          onClick={addStep}
          className="text-orange-600 hover:text-orange-700 text-sm font-medium"
        >
          + Add another step
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-orange-600 text-white py-4 rounded-2xl font-semibold hover:bg-orange-700 disabled:opacity-70 transition"
      >
        {isLoading ? 'Saving Recipe...' : recipe ? 'Update Recipe' : 'Create Recipe'}
      </button>
    </form>
  );
}
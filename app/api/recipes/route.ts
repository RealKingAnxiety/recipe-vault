import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import clientPromise from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 });
    }

    const { name, image, ingredients, steps } = await request.json();

    if (!name || !ingredients || !steps) {
      return NextResponse.json({ error: 'Name, ingredients and steps are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const recipe = await db.collection('recipes').insertOne({
      userId: session.user.id,
      name: name.trim(),
      image: image || null,
      ingredients: ingredients.filter((i: string) => i.trim() !== ''),
      steps: steps.filter((s: string) => s.trim() !== ''),
      createdAt: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      _id: recipe.insertedId.toString() 
    });

  } catch (error: any) {
    console.error("Create Recipe Error:", error);
    return NextResponse.json({ 
      error: 'Failed to create recipe: ' + (error.message || 'Unknown error') 
    }, { status: 500 });
  }
}
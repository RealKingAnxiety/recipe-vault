import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, image, ingredients, steps } = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('recipes').updateOne(
      { _id: new ObjectId(id), userId: session.user.id },
      { $set: { name, image, ingredients, steps } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('recipes').deleteOne({ 
      _id: new ObjectId(id), 
      userId: session.user.id 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
  }
}
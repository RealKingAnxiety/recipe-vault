'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ChefHat, Plus, LogOut } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <ChefHat className="w-9 h-9 text-orange-600" />
          <span className="font-bold text-3xl tracking-tight">RecipeVault</span>
        </Link>

        <div className="flex items-center gap-6">
          {session ? (
            <>
              <Link 
                href="/recipes/new"
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-2xl font-medium transition"
              >
                <Plus className="w-5 h-5" />
                New Recipe
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Link 
              href="/login"
              className="font-medium text-orange-600 hover:text-orange-700"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
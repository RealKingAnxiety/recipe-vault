import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
        RecipeVault
      </h1>
      <p className="text-2xl text-gray-600 mb-10">Your personal kitchen, beautifully organized.</p>
      
      <div className="flex gap-6 justify-center">
        <Link href="/login" className="bg-orange-500 text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-orange-600 transition">
          Get Started
        </Link>
      </div>
    </div>
  );
}
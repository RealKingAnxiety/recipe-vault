'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn('credentials', { email, password, redirect: true, callbackUrl: '/recipes' });
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-8">Welcome Back</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 text-white py-4 rounded-2xl font-semibold hover:bg-orange-600 transition disabled:opacity-70"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Don't have an account? <Link href="/register" className="text-orange-600 hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/app/context/UserContext';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!login || !password) {
      setError('Please fill in both fields');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('authToken', data.token);
        setUser({
          id: data.id,
          login: data.login,
          status: data.status,
          permissao: 0
        });
        router.push(`/admin`);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white rounded-xl shadow-xl transform transition-all hover:scale-105 duration-300 ease-in-out"
      >
        <h2 className="text-4xl font-semibold text-center text-gray-800 mb-6 tracking-tight">
          Welcome Back
        </h2>

        <div className="mb-6">
          <Label htmlFor="login" className="block text-sm font-medium text-gray-700">
            Username
          </Label>
          <Input
            id="login"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="w-full px-5 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all ease-in-out duration-300"
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-6">
          <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all ease-in-out duration-300"
            placeholder="Enter your password"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <Button
          type="submit"
          className="w-full py-3 text-white bg-gradient-to-r from-indigo-600 to-indigo-800 hover:bg-gradient-to-l rounded-lg transition-all ease-in-out duration-300"
        >
          Login
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Dont have an account?{' '}
            <a href="/register" className="text-indigo-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/app/context/UserContext';
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();
  const { theme, setTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!login || !password) {
      setError('Please fill in both fields');
      setIsLoading(false);
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
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/20 transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <form
          onSubmit={handleSubmit}
          className="p-8 bg-card rounded-3xl shadow-2xl transition-all duration-300 ease-in-out hover:shadow-3xl relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl font-bold text-center text-foreground mb-8"
            >
              Welcome Back
            </motion.h2>

            <div className="space-y-6">
              <div className="relative">
                <Label htmlFor="login" className="text-sm font-medium text-muted-foreground">
                  Username
                </Label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="login"
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    className="block w-full pl-10 sm:text-sm border-muted-foreground/20 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ease-in-out bg-background"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                  Password
                </Label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 sm:text-sm border-muted-foreground/20 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ease-in-out bg-background"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-destructive text-sm mt-4 text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-3 text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isLoading ? (
                <motion.div
                  className="h-5 w-5 border-t-2 border-primary-foreground rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                'Login'
              )}
            </Button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center mt-6"
            >
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <a
                  href="/register"
                  className="font-medium text-primary hover:text-primary/80 transition-colors duration-300 ease-in-out"
                >
                  Sign Up
                </a>
              </p>
            </motion.div>
          </div>
        </form>

      </motion.div>
    </div>
  );
}


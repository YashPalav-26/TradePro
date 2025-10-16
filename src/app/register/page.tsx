'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        router.push('/login');
      } else {
        setError(response.data.error || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-sm p-6 space-y-4 bg-card border rounded-xl"
      >
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create account</h1>
          <p className="text-sm text-muted-foreground">Join TradePro</p>
        </div>

        {error && (
          <div className="p-2 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/30 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="username" className="text-sm text-foreground">Username</label>
            <input
              id="username"
              type="text"
              placeholder="johndoe"
              autoComplete="username"
              className="w-full h-10 px-3 bg-background text-foreground border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm text-foreground">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full h-10 px-3 bg-background text-foreground border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm text-foreground">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full h-10 pr-9 px-3 bg-background text-foreground border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-10 inline-flex justify-center items-center gap-2 bg-primary text-primary-foreground rounded-md text-sm"
            aria-label="Sign up"
          >
            <UserPlus className="h-4 w-4" />
            Sign up
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-primary hover:underline">Sign in</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;

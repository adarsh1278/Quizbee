'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/component/ui/input';
import { Button } from '@/component/ui/button';
import { useAuthStore, Role } from '@/store/userAuthStore';

export default function SignInPage() {
  const router = useRouter();
  const { login, loading, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('STUDENT');
  const [localError, setLocalError] = useState('');

  const handleSignIn = async () => {
    setLocalError('');

    if (!email || !password) {
      setLocalError('Email and password are required.');
      return;
    }

    try {
      await login(email, password, role);

      if (role === 'STUDENT') {
        router.push('/student');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:8000/api/auth/google?role=${role}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-800 shadow-lg rounded-lg space-y-6">
        <h2 className="text-2xl font-bold text-center text-black dark:text-white">Sign In</h2>

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="w-full border rounded-md p-2 text-sm text-slate-700 dark:bg-slate-700 dark:text-white"
        >
          <option value="STUDENT">Student</option>
          <option value="TEACHER">Teacher</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPERADMIN">Superadmin</option>
        </select>

        {(localError || error) && (
          <p className="text-sm text-red-500">{localError || error}</p>
        )}

        <Button
          onClick={handleSignIn}
          className="w-full h-10"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white dark:bg-slate-800 px-2 text-gray-500">OR</span>
          </div>
        </div>

        <Button
          onClick={handleGoogleLogin}
          className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded"
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}

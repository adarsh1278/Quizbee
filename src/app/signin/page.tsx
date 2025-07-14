'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/app/component/ui/card';
import { Input } from '@/app/component/ui/input';
import { Button } from '@/app/component/ui/button';
import { useQuizStore } from '@/app/store/useQuizStore';

export default function SignInPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<'examiner' | 'student' | null>(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const router = useRouter();
  const setUsername = useQuizStore((state:any) => state.setUsername);
  const setRole = useQuizStore((state:any) => state.setRole);

  const handleRoleSelect = (role: 'examiner' | 'student') => {
    setSelectedRole(role);
    setStep(2);
  };

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleContinue = () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setUsername(email);
    setRole(selectedRole);
    
    if (selectedRole === 'examiner') {
      router.push('/dashboard');
    } else {
      router.push('/student');
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleContinue();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md border-0 shadow-lg bg-white/95 backdrop-blur-sm dark:bg-slate-900/95">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white dark:text-slate-900 font-bold text-lg">
                {step === 1 ? '👋' : selectedRole === 'student' ? '🎓' : '👨‍🏫'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {step === 1 ? 'Welcome Back' : `Sign in as ${selectedRole}`}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {step === 1 ? 'Choose your role to continue' : 'Enter your email to access your account'}
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full py-6 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800 transition-all duration-200"
                onClick={() => handleRoleSelect('student')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-lg">🎓</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900 dark:text-white">Student</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Access your exams and results</div>
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="w-full py-6 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800 transition-all duration-200"
                onClick={() => handleRoleSelect('examiner')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 dark:text-emerald-400 text-lg">👨‍🏫</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900 dark:text-white">Examiner</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Manage your examinations</div>
                  </div>
                </div>
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`w-full h-12 px-4 border-2 rounded-lg transition-all ${
                    error 
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                      : 'border-slate-200 focus:border-slate-400 dark:border-slate-600 dark:focus:border-slate-500'
                  }`}
                  autoFocus
                />
                {error && <p className="text-red-500 text-xs mt-2 ml-1">{error}</p>}
              </div>
              
              <Button 
                onClick={handleContinue} 
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-lg transition-all duration-200"
              >
                Continue to {selectedRole === 'student' ? 'Dashboard' : 'Exam Portal'}
              </Button>
              
              <Button
                variant="ghost"
                className="w-full h-10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => {
                  setStep(1);
                  setEmail('');
                  setError('');
                  setSelectedRole(null);
                }}
              >
                ← Back to role selection
              </Button>
              
              <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Don't have an account? 
                  <button className="text-slate-900 dark:text-white hover:underline ml-1 font-medium">
                    Sign Up
                  </button>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  🚀 Google Auth coming soon
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
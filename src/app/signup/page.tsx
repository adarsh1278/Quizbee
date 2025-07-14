'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/app/component/ui/card';
import { Input } from '@/app/component/ui/input';
import { Button } from '@/app/component/ui/button';
import { useQuizStore } from '@/app/store/useQuizStore';

export default function SignUpPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<'examiner' | 'student' | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    institution: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();
  const setUsername = useQuizStore((state) => state.setUsername);
  const setRole = useQuizStore((state) => state.setRole);

  const handleRoleSelect = (role: 'examiner' | 'student') => {
    setSelectedRole(role);
    setStep(2);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (selectedRole === 'examiner' && !formData.institution.trim()) {
      newErrors.institution = 'Institution is required for examiners';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = () => {
    if (!validateForm()) return;

    setUsername(formData.fullName);
    setRole(selectedRole);

    if (selectedRole === 'examiner') {
      router.push('/dashboard');
    } else {
      router.push('/student');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSignUp();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md border-0 shadow-lg bg-white/95 backdrop-blur-sm dark:bg-slate-900/95">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white dark:text-slate-900 font-bold text-lg">
                {step === 1 ? '✨' : selectedRole === 'student' ? '🎓' : '👨‍🏫'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {step === 1 ? 'Get Started' : `Welcome, ${selectedRole}!`}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {step === 1 ? 'Choose your role to begin' : 'Complete your profile to continue'}
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
                    <div className="text-xs text-slate-500 dark:text-slate-400">Join to take exams and quizzes</div>
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
                    <div className="text-xs text-slate-500 dark:text-slate-400">Create and manage examinations</div>
                  </div>
                </div>
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <Input
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full h-12 px-4 border-2 rounded-lg transition-all ${errors.fullName
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                      : 'border-slate-200 focus:border-slate-400 dark:border-slate-600 dark:focus:border-slate-500'
                    }`}
                  autoFocus
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-2 ml-1">{errors.fullName}</p>}
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full h-12 px-4 border-2 rounded-lg transition-all ${errors.email
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                      : 'border-slate-200 focus:border-slate-400 dark:border-slate-600 dark:focus:border-slate-500'
                    }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-2 ml-1">{errors.email}</p>}
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full h-12 px-4 border-2 rounded-lg transition-all ${errors.password
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                      : 'border-slate-200 focus:border-slate-400 dark:border-slate-600 dark:focus:border-slate-500'
                    }`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-2 ml-1">{errors.password}</p>}
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`w-full h-12 px-4 border-2 rounded-lg transition-all ${errors.confirmPassword
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                      : 'border-slate-200 focus:border-slate-400 dark:border-slate-600 dark:focus:border-slate-500'
                    }`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-2 ml-1">{errors.confirmPassword}</p>}
              </div>

              {selectedRole === 'examiner' && (
                <div>
                  <Input
                    placeholder="Institution/Organization"
                    value={formData.institution}
                    onChange={(e) => handleInputChange('institution', e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`w-full h-12 px-4 border-2 rounded-lg transition-all ${errors.institution
                        ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                        : 'border-slate-200 focus:border-slate-400 dark:border-slate-600 dark:focus:border-slate-500'
                      }`}
                  />
                  {errors.institution && <p className="text-red-500 text-xs mt-2 ml-1">{errors.institution}</p>}
                </div>
              )}

              <Button
                onClick={handleSignUp}
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-lg transition-all duration-200"
              >
                Create Account
              </Button>

              <Button
                variant="ghost"
                className="w-full h-10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => {
                  setStep(1);
                  setFormData({
                    fullName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    institution: ''
                  });
                  setErrors({});
                  setSelectedRole(null);
                }}
              >
                ← Back to role selection
              </Button>

              <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Already have an account?
                  <button className="text-slate-900 dark:text-white hover:underline ml-1 font-medium">
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
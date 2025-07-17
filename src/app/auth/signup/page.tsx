'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/component/ui/card';
import { Input } from '@/component/ui/input';
import { Button } from '@/component/ui/button';
import { useQuizStore } from '@/store/useQuizStore';
import api from '@/lib/axios';
import Router from 'next/router';
export default function SignUpPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<'Teacher' | 'student' | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    institution: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();
  const setUsername = useQuizStore((state) => state.setUsername);
  const setRole = useQuizStore((state) => state.setRole);

  const handleRoleSelect = (role: 'Teacher' | 'student') => {
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
    if (selectedRole === 'Teacher' && !formData.institution.trim()) {
      newErrors.institution = 'Institution is required for Teachers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      const response = await api.post('auth/register', {
        name:formData.fullName,
        email: formData.email,
        password: formData.password,
        role: selectedRole?.toUpperCase(),
      });

      const { user } = response.data;

      setUsername(formData.fullName);
      setRole(selectedRole);

      if (selectedRole === 'Teacher') {
        router.push('/dashboard');
      } else {
        router.push('/student');
      }
    } catch (err: any) {
      console.error('Signup failed:', err);
      alert(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
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
                className="w-full py-6"
                onClick={() => handleRoleSelect('student')}
              >
                🎓 Student
              </Button>

              <Button
                variant="outline"
                className="w-full py-6"
                onClick={() => handleRoleSelect('Teacher')}
              >
                👨‍🏫 Teacher
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <Input
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={errors.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}

              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

              <Input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                onKeyPress={handleKeyPress}
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
              )}

              {selectedRole === 'Teacher' && (
                <div>
                  <Input
                    placeholder="Institution/Organization"
                    value={formData.institution}
                    onChange={(e) => handleInputChange('institution', e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={errors.institution ? 'border-red-500' : ''}
                  />
                  {errors.institution && <p className="text-red-500 text-xs">{errors.institution}</p>}
                </div>
              )}

              <Button
                onClick={handleSignUp}
                className="w-full h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-lg"
              >
                Create Account
              </Button>

              <Button
                variant="ghost"
                className="w-full h-10"
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

              <div className="text-center pt-4 border-t">
                <p className="text-xs">
                  Already have an account?
                  <button onClick={()=>{router.push('/auth/signin')}} className="hover:underline ml-1 font-medium">Sign In</button>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

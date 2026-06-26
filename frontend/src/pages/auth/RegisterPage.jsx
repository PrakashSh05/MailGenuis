import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Toast from '../../components/ui/Toast';
import Card from '../../components/ui/Card';

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .max(100, 'Full name must be less than 100 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email format')
      .max(255, 'Email must be less than 255 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(100, 'Password must be less than 100 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function RegisterPage() {
  const { register: registerApi } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setToast(null);
    try {
      await registerApi(data.fullName, data.email, data.password);
      setToast({ message: 'Registration successful! Redirecting to login...', type: 'success' });
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setToast({ 
        message: err.message || 'Registration failed. Email might already be in use.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-secondary dark:bg-warm-secondary p-6 transition-colors duration-200">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-2">
            <Mail className="h-8 w-8" />
            <span className="text-2xl font-black tracking-tight select-none">MailGenius AI</span>
          </div>
          <p className="text-sm text-editorial-secondary dark:text-editorial-secondary font-medium">
            AI-powered email generation for everyone
          </p>
        </div>

        <Card className="shadow-xl">
          <h2 className="text-xl font-bold text-editorial-primary dark:text-editorial-primary mb-6 text-center select-none">
            Create your account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Full Name"
              id="fullName"
              type="text"
              placeholder="John Doe"
              error={errors.fullName?.message}
              required
              disabled={loading}
              {...register('fullName')}
            />

            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="name@company.com"
              error={errors.email?.message}
              required
              disabled={loading}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Password"
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                required
                disabled={loading}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-[2.1rem] text-editorial-secondary hover:text-editorial-secondary dark:text-slate-550 dark:hover:text-slate-350 transition-colors focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm Password"
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                required
                disabled={loading}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-[2.1rem] text-editorial-secondary hover:text-editorial-secondary dark:text-slate-550 dark:hover:text-slate-350 transition-colors focus:outline-none"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              loading={loading}
              disabled={loading}
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-editorial-secondary dark:text-slate-405 font-medium border-t border-slate-100 dark:border-editorial-border pt-4">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-brand-600 dark:text-brand-400 font-bold hover:underline focus:outline-none focus:ring-1 focus:ring-brand-500 rounded px-0.5"
            >
              Sign in here
            </Link>
          </div>
        </Card>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

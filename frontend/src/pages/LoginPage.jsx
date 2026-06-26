import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In Module 1, redirect to dashboard directly for mock navigation
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-warm-secondary flex items-center justify-center p-4 selection:bg-brand-500 selection:text-editorial-primary">
      <div className="absolute top-0 inset-x-0 h-64 bg-[radial-gradient(circle_600px_at_50%_-100px,#1e1b4b,transparent)] pointer-events-none" />
      
      <div className="w-full max-w-md bg-warm-primary border border-editorial-border rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-brand-950 border border-brand-800 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-6 w-6 text-brand-400" />
          </div>
          <h2 className="text-2xl font-bold text-editorial-primary">Welcome back</h2>
          <p className="text-editorial-secondary text-sm mt-1">Sign in to generate and tweak drafts</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-editorial-secondary text-sm font-semibold mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-editorial-secondary" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-warm-secondary border border-editorial-border focus:border-brand-500 rounded-xl py-3 pl-11 pr-4 text-editorial-primary text-sm placeholder:text-editorial-secondary outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-editorial-secondary text-sm font-semibold">Password</label>
              <a href="#" className="text-brand-400 hover:text-brand-300 text-xs font-semibold">Forgot?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-editorial-secondary" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-warm-secondary border border-editorial-border focus:border-brand-500 rounded-xl py-3 pl-11 pr-4 text-editorial-primary text-sm placeholder:text-editorial-secondary outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-editorial-primary rounded-xl py-3.5 text-sm font-bold shadow-lg shadow-brand-900/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            Sign In <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-editorial-border/80 text-sm text-editorial-secondary">
          New to MailGenius?{' '}
          <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

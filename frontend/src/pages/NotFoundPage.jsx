import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-warm-secondary dark:bg-warm-secondary flex flex-col items-center justify-center p-6 text-center select-none transition-colors duration-200">
      <div className="max-w-md w-full bg-warm-primary dark:bg-warm-primary border border-editorial-border dark:border-editorial-border rounded-3xl p-8 shadow-2xl">
        <h1 className="text-8xl font-black text-brand-600 dark:text-brand-400 mb-2">
          404
        </h1>
        <h2 className="text-xl font-bold text-editorial-primary dark:text-editorial-primary mb-2">
          Page Not Found
        </h2>
        <p className="text-sm text-editorial-secondary dark:text-editorial-secondary mb-6">
          The page you are looking for doesn't exist or has been moved to another path.
        </p>
        <Button
          variant="primary"
          className="w-full animate-pulse"
          onClick={() => navigate('/')}
        >
          Back to Safety
        </Button>
      </div>
    </div>
  );
}

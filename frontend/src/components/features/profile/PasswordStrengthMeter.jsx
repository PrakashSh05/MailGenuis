import React from 'react';

export default function PasswordStrengthMeter({ password }) {
  const calculateStrength = (pwd) => {
    let score = 0;
    if (!pwd) return score;
    if (pwd.length > 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score; // Max 4
  };

  const strength = calculateStrength(password);

  const getStrengthLabel = (score) => {
    switch (score) {
      case 0: return 'Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  const getStrengthColor = (score) => {
    switch (score) {
      case 0:
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-brand-500';
      case 4: return 'bg-green-500';
      default: return 'bg-slate-200 dark:bg-slate-700';
    }
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1 text-sm">
      <div className="flex justify-between items-center text-xs text-editorial-secondary">
        <span>Password strength</span>
        <span className="font-medium">{getStrengthLabel(strength)}</span>
      </div>
      <div className="flex gap-1 h-1.5">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`flex-1 rounded-full transition-colors ${
              level <= strength ? getStrengthColor(strength) : 'bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

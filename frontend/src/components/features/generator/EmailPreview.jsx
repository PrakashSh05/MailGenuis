import React from 'react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import Spinner from '../../ui/Spinner';
import CopyButton from '../../ui/CopyButton';
import DownloadButton from '../../ui/DownloadButton';
import FavoriteButton from '../../ui/FavoriteButton';
import { RefreshCw, Zap, Save, Check } from 'lucide-react';

const AI_ACTIONS = [
  { type: 'IMPROVE', label: 'Improve' },
  { type: 'MAKE_PROFESSIONAL', label: 'Professional' },
  { type: 'MAKE_FRIENDLY', label: 'Friendly' },
  { type: 'FIX_GRAMMAR', label: 'Grammar' },
  { type: 'EXPAND', label: 'Expand' },
  { type: 'SHORTEN', label: 'Shorten' },
  { type: 'SIMPLIFY', label: 'Simplify' },
  { type: 'SUMMARIZE', label: 'Summarize' },
  { type: 'BULLET_POINTS', label: 'Bullet Points' }
];

export default function EmailPreview({ 
  email, 
  isLoading, 
  onAction, 
  onRegenerate, 
  onSave, 
  onToggleFavorite,
  isSaving
}) {
  if (!email && !isLoading) {
    return (
      <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-editorial-border dark:border-editorial-border rounded-xl bg-warm-secondary/50 dark:bg-black/20 text-editorial-secondary dark:text-editorial-secondary">
        <div className="text-center p-6">
          <Zap className="h-10 w-10 mx-auto text-editorial-secondary dark:text-editorial-secondary mb-3" />
          <p className="font-medium text-editorial-secondary dark:text-editorial-secondary">No email generated yet</p>
          <p className="text-sm mt-1">Fill out the form to generate your AI email.</p>
        </div>
      </div>
    );
  }

  const charCount = email?.body?.length || 0;
  const wordCount = email?.body?.trim().split(/\s+/).filter(Boolean).length || 0;

  return (
    <Card className="flex flex-col h-full bg-warm-primary dark:bg-warm-primary overflow-hidden relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-warm-primary/60 dark:bg-warm-primary/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
          <Spinner size="lg" className="mb-4" />
          <p className="text-sm font-medium text-editorial-secondary dark:text-editorial-secondary animate-pulse">
            AI is writing...
          </p>
        </div>
      )}

      {/* Toolbar */}
      {email && (
        <div className="border-b border-slate-100 dark:border-editorial-border p-3 bg-warm-secondary dark:bg-warm-secondary flex flex-wrap gap-2 items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRegenerate}
            disabled={isLoading}
            icon={RefreshCw}
            className="text-xs"
          >
            Regenerate
          </Button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
          {AI_ACTIONS.map(action => (
            <Button
              key={action.type}
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => onAction(action.type)}
              disabled={isLoading}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <label className="block text-xs font-bold text-editorial-secondary dark:text-editorial-secondary uppercase tracking-wider mb-2">
            Subject
          </label>
          <div className="text-lg font-bold text-editorial-primary dark:text-editorial-primary">
            {email?.subject || '...'}
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-editorial-secondary dark:text-editorial-secondary uppercase tracking-wider mb-2">
            Body
          </label>
          <div className="whitespace-pre-wrap text-editorial-secondary dark:text-editorial-secondary leading-relaxed font-serif">
            {email?.body || '...'}
          </div>
        </div>
      </div>

      {/* Footer Meta & Actions */}
      {email && (
        <div className="border-t border-slate-100 dark:border-editorial-border p-4 bg-warm-secondary/50 dark:bg-warm-secondary/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-4 text-xs font-medium text-editorial-secondary dark:text-editorial-secondary">
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
            <Badge variant="brand">{email.tone}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <FavoriteButton 
              isFavorite={email.isFavorite} 
              onClick={onToggleFavorite}
              disabled={isLoading || isSaving}
            />
            <CopyButton text={`${email.subject}\n\n${email.body}`} />
            <DownloadButton text={`${email.subject}\n\n${email.body}`} subject={email.subject} />
            {!email.id && (
              <Button 
                size="sm" 
                variant="primary" 
                icon={Save} 
                onClick={onSave}
                loading={isSaving}
                disabled={isLoading || isSaving}
                className="ml-2"
              >
                Save Draft
              </Button>
            )}
            {email.id && (
              <Badge variant="success" className="ml-2 px-2.5 py-1 text-xs">
                <Check className="h-3 w-3 mr-1 inline" /> Saved
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

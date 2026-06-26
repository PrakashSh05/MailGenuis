import React from 'react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import FavoriteButton from '../../ui/FavoriteButton';
import CopyButton from '../../ui/CopyButton';
import { Eye, Trash2, RefreshCw } from 'lucide-react';
import { formatRelativeTime } from '../../../utils/date';

export default function EmailCard({ 
  email, 
  onView, 
  onDelete, 
  onToggleFavorite, 
  onRegenerate 
}) {
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow group p-5">
      <div className="flex justify-between items-start mb-3">
        <Badge variant="brand">{email.tone}</Badge>
        <span className="text-xs text-editorial-secondary dark:text-editorial-secondary whitespace-nowrap ml-2">
          {formatRelativeTime(email.createdAt)}
        </span>
      </div>
      
      <div className="flex-1 cursor-pointer" onClick={() => onView(email)}>
        <h3 className="font-bold text-editorial-primary dark:text-editorial-primary line-clamp-2 mb-2" title={email.subject}>
          {email.subject}
        </h3>
        <p className="text-sm text-editorial-secondary dark:text-editorial-secondary line-clamp-3 font-serif">
          {email.body}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-editorial-border flex items-center justify-between">
        <div className="flex items-center gap-1">
          <FavoriteButton 
            isFavorite={email.isFavorite} 
            onClick={() => onToggleFavorite(email.id, email.isFavorite)} 
          />
          <CopyButton text={`${email.subject}\n\n${email.body}`} />
        </div>
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={() => onView(email)} title="View full email" className="px-2">
            <Eye className="h-4 w-4 text-editorial-secondary" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onRegenerate(email)} title="Regenerate from this" className="px-2">
            <RefreshCw className="h-4 w-4 text-brand-500" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(email)} title="Delete email" className="px-2 hover:bg-red-50 dark:hover:text-red-600">
            <Trash2 className="h-4 w-4 text-accent" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

import React from 'react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import { formatRelativeTime } from '../../../utils/date';
import { Edit2, Trash2, Edit3 } from 'lucide-react';

export default function TemplateCard({ template, onEdit, onDelete, onUse }) {
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow group p-5 border-l-4 border-l-brand-500">
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-editorial-primary dark:text-editorial-primary line-clamp-1 flex-1 pr-2" title={template.name}>
            {template.name}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="brand">{template.tone}</Badge>
          <Badge variant="default">{template.language}</Badge>
          <Badge variant="default">{template.length}</Badge>
        </div>
        <p className="text-xs text-editorial-secondary dark:text-editorial-secondary mb-2">
          Updated {formatRelativeTime(template.updatedAt)}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-editorial-border flex items-center justify-between">
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(template)} className="px-2" title="Edit template">
            <Edit2 className="h-4 w-4 text-editorial-secondary hover:text-editorial-primary" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(template)} className="px-2 hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete template">
            <Trash2 className="h-4 w-4 text-accent" />
          </Button>
        </div>
        <Button size="sm" onClick={() => onUse(template)} className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit3 className="h-4 w-4 mr-1.5" /> Use
        </Button>
      </div>
    </Card>
  );
}

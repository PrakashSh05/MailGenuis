import React from 'react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import { Eye, Edit3 } from 'lucide-react';

export default function PromptCard({ prompt, onPreview, onUse }) {
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow group p-5 border-l-4 border-l-indigo-500">
      <div className="flex-1">
        <h3 className="font-bold text-editorial-primary dark:text-editorial-primary mb-2 line-clamp-1" title={prompt.title}>
          {prompt.title}
        </h3>
        <p className="text-sm text-editorial-secondary dark:text-editorial-secondary line-clamp-2 mb-4 h-10">
          {prompt.description}
        </p>
        <div className="flex gap-2 mb-2">
          <Badge variant="brand">{prompt.defaultTone}</Badge>
          <Badge variant="default">{prompt.defaultLength}</Badge>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-editorial-border flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => onPreview(prompt)} className="text-editorial-secondary hover:text-editorial-primary">
          <Eye className="h-4 w-4 mr-1.5" /> Preview
        </Button>
        <Button size="sm" onClick={() => onUse(prompt)} className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit3 className="h-4 w-4 mr-1.5" /> Use Template
        </Button>
      </div>
    </Card>
  );
}

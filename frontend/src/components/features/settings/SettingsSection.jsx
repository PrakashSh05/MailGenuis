import React from 'react';
import Card from '../../ui/Card';

export default function SettingsSection({ title, description, children }) {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-editorial-primary dark:text-editorial-primary">{title}</h3>
        {description && (
          <p className="text-sm text-editorial-secondary dark:text-editorial-secondary mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </Card>
  );
}

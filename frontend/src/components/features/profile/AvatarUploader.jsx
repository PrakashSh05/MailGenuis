import React, { useState } from 'react';
import Input from '../../ui/Input';
import { Image as ImageIcon } from 'lucide-react';

export default function AvatarUploader({ value, onChange, error, disabled }) {
  const [imgError, setImgError] = useState(false);

  const handleInputChange = (e) => {
    setImgError(false);
    onChange(e);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="flex-shrink-0 h-16 w-16 rounded-full bg-warm-secondary dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-editorial-border dark:border-editorial-border">
        {value && !imgError ? (
          <img 
            src={value} 
            alt="Avatar Preview" 
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <ImageIcon className="h-6 w-6 text-editorial-secondary" />
        )}
      </div>
      <div className="flex-1 w-full">
        <Input
          label="Profile Picture URL"
          placeholder="https://example.com/avatar.jpg"
          value={value || ''}
          onChange={handleInputChange}
          error={error || (imgError ? "Invalid image URL" : undefined)}
          disabled={disabled}
        />
        <p className="text-xs text-editorial-secondary mt-1">Provide a direct link to an image file.</p>
      </div>
    </div>
  );
}

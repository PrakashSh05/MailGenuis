import React, { useState, useRef } from 'react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { Image as ImageIcon, Upload } from 'lucide-react';

export default function AvatarUploader({ value, onChange, error, disabled }) {
  const [imgError, setImgError] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setImgError(false);
    onChange(e);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    setIsCompressing(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress heavily (e.g. 0.6 quality) to keep Base64 footprint small
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        
        // Pass the new data URL up
        onChange({ target: { value: dataUrl } });
        setImgError(false);
        setIsCompressing(false);
      };
      img.onerror = () => {
        alert('Failed to load image for compression.');
        setIsCompressing(false);
      };
    };
    reader.onerror = () => {
      alert('Failed to read file.');
      setIsCompressing(false);
    };

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="flex-shrink-0 h-16 w-16 rounded-full bg-warm-secondary dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-editorial-border dark:border-editorial-border relative">
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
        
        {isCompressing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1 w-full space-y-2">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              label="Profile Picture URL"
              placeholder="https://example.com/avatar.jpg"
              value={value || ''}
              onChange={handleInputChange}
              error={error || (imgError ? "Invalid image URL" : undefined)}
              disabled={disabled || isCompressing}
            />
          </div>
          <div className="mb-0.5">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              disabled={disabled || isCompressing}
            />
            <Button 
              type="button" 
              variant="outline" 
              icon={Upload} 
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isCompressing}
              className="h-[42px]"
              title="Upload from device"
            />
          </div>
        </div>
        <p className="text-xs text-editorial-secondary">Provide a direct link or upload an image file (auto-compressed).</p>
      </div>
    </div>
  );
}

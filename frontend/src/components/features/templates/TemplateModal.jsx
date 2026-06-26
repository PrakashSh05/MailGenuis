import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../../ui/Modal';
import Input from '../../ui/Input';
import Textarea from '../../ui/Textarea';
import Select from '../../ui/Select';
import Button from '../../ui/Button';

const templateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Maximum 100 characters'),
  tone: z.string().min(1, 'Tone is required'),
  length: z.string().min(1, 'Length is required'),
  language: z.string().min(1, 'Language is required'),
  body: z.string().min(1, 'Template body is required').max(5000, 'Maximum 5000 characters')
});

const TONE_OPTIONS = [
  { value: 'PROFESSIONAL', label: 'Professional' },
  { value: 'CASUAL', label: 'Casual' },
  { value: 'FRIENDLY', label: 'Friendly' },
  { value: 'PERSUASIVE', label: 'Persuasive' },
  { value: 'URGENT', label: 'Urgent' },
  { value: 'EMPATHETIC', label: 'Empathetic' }
];

const LENGTH_OPTIONS = [
  { value: 'SHORT', label: 'Short' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LONG', label: 'Long' }
];

const LANGUAGE_OPTIONS = [
  { value: 'ENGLISH', label: 'English' },
  { value: 'SPANISH', label: 'Spanish' },
  { value: 'FRENCH', label: 'French' },
  { value: 'GERMAN', label: 'German' },
  { value: 'ITALIAN', label: 'Italian' }
];

export default function TemplateModal({ isOpen, onClose, onSave, template, isLoading }) {
  const isEditing = !!template;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: '',
      tone: 'PROFESSIONAL',
      length: 'MEDIUM',
      language: 'ENGLISH',
      body: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (template) {
        reset({
          name: template.name,
          tone: template.tone,
          length: template.length,
          language: template.language,
          body: template.body
        });
      } else {
        reset({
          name: '',
          tone: 'PROFESSIONAL',
          length: 'MEDIUM',
          language: 'ENGLISH',
          body: ''
        });
      }
    }
  }, [isOpen, template, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Template' : 'Create Template'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSave)} className="space-y-4 p-2">
        <Input
          label="Template Name"
          placeholder="e.g., Weekly Project Update"
          error={errors.name?.message}
          disabled={isLoading}
          {...register('name')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Controller
            name="tone"
            control={control}
            render={({ field }) => (
              <Select
                label="Tone"
                options={TONE_OPTIONS}
                error={errors.tone?.message}
                disabled={isLoading}
                {...field}
              />
            )}
          />
          <Controller
            name="length"
            control={control}
            render={({ field }) => (
              <Select
                label="Length"
                options={LENGTH_OPTIONS}
                error={errors.length?.message}
                disabled={isLoading}
                {...field}
              />
            )}
          />
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <Select
                label="Language"
                options={LANGUAGE_OPTIONS}
                error={errors.language?.message}
                disabled={isLoading}
                {...field}
              />
            )}
          />
        </div>

        <Textarea
          label="Template Body"
          placeholder="Write the reusable structure of your email here..."
          error={errors.body?.message}
          rows={6}
          disabled={isLoading}
          {...register('body')}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-editorial-border">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isLoading}>
            {isEditing ? 'Save Changes' : 'Create Template'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles } from 'lucide-react';
import Input from '../../ui/Input';
import Textarea from '../../ui/Textarea';
import Select from '../../ui/Select';
import Button from '../../ui/Button';

// Validation Schema based on backend constraints
const generateSchema = z.object({
  purpose: z.string().min(1, 'Purpose is required').max(500, 'Maximum 500 characters'),
  recipient: z.string().max(100, 'Maximum 100 characters').optional(),
  tone: z.string().min(1, 'Tone is required'),
  length: z.string().min(1, 'Length is required'),
  language: z.string().min(1, 'Language is required'),
  additionalInstructions: z.string().max(1000, 'Maximum 1000 characters').optional()
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

export default function EmailForm({ defaultValues, onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      purpose: '',
      recipient: '',
      tone: 'PROFESSIONAL',
      length: 'MEDIUM',
      language: 'ENGLISH',
      ...defaultValues
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textarea
        label="Email Purpose"
        placeholder="e.g., Ask the team for a status update on the Q3 marketing campaign..."
        error={errors.purpose?.message}
        rows={3}
        required
        disabled={isLoading}
        {...register('purpose')}
      />

      <Input
        label="Recipient (Optional)"
        placeholder="e.g., John Doe, Marketing Team"
        error={errors.recipient?.message}
        disabled={isLoading}
        {...register('recipient')}
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
        label="Additional Instructions (Optional)"
        placeholder="e.g., Mention the budget constraints..."
        error={errors.additionalInstructions?.message}
        rows={2}
        disabled={isLoading}
        {...register('additionalInstructions')}
      />

      <Button
        type="submit"
        className="w-full mt-4"
        icon={Sparkles}
        loading={isLoading}
      >
        Generate Email
      </Button>
    </form>
  );
}

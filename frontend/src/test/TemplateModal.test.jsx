import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TemplateModal from '../components/features/templates/TemplateModal';

describe('TemplateModal', () => {
  it('renders create mode when no template is provided', () => {
    render(
      <TemplateModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        template={null}
        isLoading={false}
      />
    );

    expect(screen.getByText('Create Template')).toBeInTheDocument();
    expect(screen.getByLabelText('Template Name')).toBeInTheDocument();
  });

  it('renders edit mode when a template is provided', () => {
    const template = {
      name: 'My Template',
      tone: 'PROFESSIONAL',
      length: 'MEDIUM',
      language: 'ENGLISH',
      body: 'Template body content'
    };

    render(
      <TemplateModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        template={template}
        isLoading={false}
      />
    );

    expect(screen.getByText('Edit Template')).toBeInTheDocument();
    expect(screen.getByDisplayValue('My Template')).toBeInTheDocument();
  });

  it('shows validation error for empty name on submit', async () => {
    const onSave = vi.fn();

    render(
      <TemplateModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={onSave}
        template={null}
        isLoading={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Create Template/i }));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    expect(onSave).not.toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <TemplateModal
        isOpen={false}
        onClose={vi.fn()}
        onSave={vi.fn()}
        template={null}
        isLoading={false}
      />
    );

    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });
});

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GeneratorPage from '../pages/GeneratorPage';
import emailService from '../services/emailService';

vi.mock('../services/emailService');

describe('GeneratorPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the generator form and empty preview state', () => {
    render(
      <MemoryRouter>
        <GeneratorPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Email Generator')).toBeInTheDocument();
    expect(screen.getByText('Email Parameters')).toBeInTheDocument();
    expect(screen.getByText('No email generated yet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate Email/i })).toBeInTheDocument();
  });

  it('generates an email successfully', async () => {
    emailService.generateEmail.mockResolvedValue({
      data: {
        id: '1',
        subject: 'AI Subject',
        body: 'AI Body Content',
        tone: 'PROFESSIONAL'
      }
    });

    render(
      <MemoryRouter>
        <GeneratorPage />
      </MemoryRouter>
    );

    // Fill form
    const purposeInput = screen.getByLabelText(/Email Purpose/i);
    fireEvent.change(purposeInput, { target: { value: 'Test purpose' } });

    // Submit
    const generateBtn = screen.getByRole('button', { name: /Generate Email/i });
    fireEvent.click(generateBtn);

    await waitFor(() => {
      expect(emailService.generateEmail).toHaveBeenCalled();
      expect(screen.getByText('AI Subject')).toBeInTheDocument();
      expect(screen.getByText('AI Body Content')).toBeInTheDocument();
    });
  });

  it('handles generation errors', async () => {
    emailService.generateEmail.mockRejectedValue(new Error('Generation failed'));

    render(
      <MemoryRouter>
        <GeneratorPage />
      </MemoryRouter>
    );

    const purposeInput = screen.getByLabelText(/Email Purpose/i);
    fireEvent.change(purposeInput, { target: { value: 'Fail test' } });

    fireEvent.click(screen.getByRole('button', { name: /Generate Email/i }));

    await waitFor(() => {
      expect(screen.getByText('Failed to generate email. Please try again.')).toBeInTheDocument();
    });
  });
});

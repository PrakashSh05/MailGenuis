import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TemplatesPage from '../pages/TemplatesPage';
import templateService from '../services/templateService';

vi.mock('../services/templateService');

describe('TemplatesPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the library tab by default and fetches categories', async () => {
    templateService.getLibrary.mockResolvedValue({
      data: {
        categories: [
          {
            category: 'Business',
            items: [
              { id: '1', title: 'Sales Pitch', description: 'Pitch description', defaultTone: 'PROFESSIONAL', defaultLength: 'MEDIUM' }
            ]
          }
        ]
      }
    });

    render(
      <MemoryRouter>
        <TemplatesPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Templates & Library')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Business')).toBeInTheDocument();
      expect(screen.getByText('Sales Pitch')).toBeInTheDocument();
    });
  });

  it('shows error toast on library fetch failure', async () => {
    templateService.getLibrary.mockRejectedValue(new Error('Network error'));

    render(
      <MemoryRouter>
        <TemplatesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load prompt library.')).toBeInTheDocument();
    });
  });
});

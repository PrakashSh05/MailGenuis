import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HistoryPage from '../pages/HistoryPage';
import emailService from '../services/emailService';

vi.mock('../services/emailService');

describe('HistoryPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders empty state when no history exists', async () => {
    emailService.getEmailHistory.mockResolvedValue({
      data: { content: [], totalPages: 0 }
    });

    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Email History')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Your history is empty')).toBeInTheDocument();
    });
  });

  it('renders a list of emails', async () => {
    emailService.getEmailHistory.mockResolvedValue({
      data: {
        content: [
          {
            id: '1',
            subject: 'Meeting Request',
            body: 'Let us meet tomorrow.',
            tone: 'PROFESSIONAL',
            createdAt: new Date().toISOString(),
            isFavorite: false
          }
        ],
        totalPages: 1
      }
    });

    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Meeting Request')).toBeInTheDocument();
      expect(screen.getByText('Let us meet tomorrow.')).toBeInTheDocument();
    });
  });

  it('displays error toast on fetch failure', async () => {
    emailService.getEmailHistory.mockRejectedValue(new Error('Network Error'));

    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load history.')).toBeInTheDocument();
    });
  });
});

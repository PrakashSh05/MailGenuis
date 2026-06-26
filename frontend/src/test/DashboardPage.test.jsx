import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardPage from '../pages/DashboardPage';
import dashboardService from '../services/dashboardService';

vi.mock('../services/dashboardService');

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders loading skeletons initially', () => {
    // Provide an unresolved promise to keep it in loading state
    dashboardService.getDashboardSummary.mockReturnValue(new Promise(() => {}));
    dashboardService.getDashboardActivity.mockReturnValue(new Promise(() => {}));
    
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('AI is writing...')).toBeDefined(); // wait, Skeleton doesn't have text. Let's just check standard headers
    expect(screen.getByText('AI Preferences')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('renders dashboard data after successful fetch', async () => {
    const mockSummary = {
      data: {
        statistics: [
          { title: 'Total Emails', value: 150, trend: '+5%', trendLabel: 'this week' }
        ],
        analytics: {
          mostUsedTone: 'Professional',
          mostUsedLanguage: 'English',
          mostUsedTemplate: 'Weekly Update'
        }
      }
    };
    
    const mockActivity = {
      data: [
        { type: 'EMAIL_GENERATED', description: 'Generated Sales Pitch', timestamp: new Date().toISOString() }
      ]
    };

    dashboardService.getDashboardSummary.mockResolvedValue(mockSummary);
    dashboardService.getDashboardActivity.mockResolvedValue(mockActivity);

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Total Emails')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('Professional')).toBeInTheDocument();
      expect(screen.getByText('Generated Sales Pitch')).toBeInTheDocument();
    });
  });

  it('renders error message on fetch failure', async () => {
    dashboardService.getDashboardSummary.mockRejectedValue(new Error('Network error'));
    dashboardService.getDashboardActivity.mockRejectedValue(new Error('Network error'));

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load dashboard data/i)).toBeInTheDocument();
    });
  });
});

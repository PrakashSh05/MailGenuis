import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PublicRoute from '../routes/PublicRoute';
import { useAuth } from '../context/AuthContext';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('PublicRoute', () => {
  it('renders loading spinner when auth is loading', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: true,
    });

    render(
      <MemoryRouter>
        <PublicRoute>
          <div>Public Content</div>
        </PublicRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('spinner-svg')).toBeInTheDocument();
  });

  it('redirects to dashboard when authenticated', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <div data-testid="login-content">Login Page</div>
              </PublicRoute>
            }
          />
          <Route path="/dashboard" element={<div data-testid="dashboard-content">Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
    expect(screen.queryByTestId('login-content')).not.toBeInTheDocument();
  });

  it('renders content when unauthenticated', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
    });

    render(
      <MemoryRouter>
        <PublicRoute>
          <div data-testid="login-content">Login Page</div>
        </PublicRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-content')).toBeInTheDocument();
  });
});

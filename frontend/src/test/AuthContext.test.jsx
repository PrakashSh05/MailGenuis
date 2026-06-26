import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { describe, it, expect, beforeEach, vi } from 'vitest';

function AuthTestComponent() {
  const { user, token, login, logout, isAuthenticated, loading } = useAuth();
  if (loading) return <div data-testid="loading">Loading...</div>;
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'logged-in' : 'logged-out'}</span>
      <span data-testid="username">{user?.fullName || 'guest'}</span>
      <span data-testid="token">{token || 'none'}</span>
      <button onClick={() => login('mock.token.exp', { fullName: 'Alice' })} data-testid="login-btn">Login</button>
      <button onClick={logout} data-testid="logout-btn">Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  it('initially loads as logged-out', async () => {
    render(
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-out');
  });

  it('performs login and logout correctly', async () => {
    render(
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    fireEvent.click(screen.getByTestId('login-btn'));

    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in');
    expect(screen.getByTestId('username')).toHaveTextContent('Alice');
    expect(sessionStorage.getItem('token')).toBe('mock.token.exp');

    fireEvent.click(screen.getByTestId('logout-btn'));

    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-out');
    expect(sessionStorage.getItem('token')).toBeNull();
  });
});

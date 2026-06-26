import api from '../services/api';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Axios Client & Interceptors', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('injects Bearer token from sessionStorage in request headers', async () => {
    sessionStorage.setItem('token', 'mock_jwt_token');

    const reqInterceptor = api.interceptors.request.handlers[0];
    const config = await reqInterceptor.fulfilled({ headers: {} });

    expect(config.headers.Authorization).toBe('Bearer mock_jwt_token');
  });

  it('dispatches custom event on 401 response status', () => {
    const logoutListener = vi.fn();
    window.addEventListener('auth-logout', logoutListener);

    const resInterceptor = api.interceptors.response.handlers[0];
    const errorResponse = {
      response: {
        status: 401,
        data: { error: { message: 'Unauthorized' } }
      }
    };

    resInterceptor.rejected(errorResponse).catch(() => {});

    expect(logoutListener).toHaveBeenCalled();
    window.removeEventListener('auth-logout', logoutListener);
  });
});

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProfilePage from '../pages/ProfilePage';
import profileService from '../services/profileService';
import { AuthProvider } from '../context/AuthContext';

vi.mock('../services/profileService');

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders profile data successfully', async () => {
    profileService.getProfile.mockResolvedValue({
      data: {
        fullName: 'Jane Doe',
        email: 'jane@example.com'
      }
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <ProfilePage />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      // getByDisplayValue finds inputs with value
      expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
    });
  });

  it('displays validation error if password confirm does not match', async () => {
    profileService.getProfile.mockResolvedValue({
      data: { fullName: 'Test', email: 't@t.com' }
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <ProfilePage />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('General Information')).toBeInTheDocument();
    });

    // We can't query by label "Current Password" easily if it's hidden under custom Input, but we can query by placeholder or Role if setup right. 
    // Wait, the label prop passed to Input should render a standard label element.
    const currentInput = screen.getByLabelText(/Current Password/i);
    const newPasswordInput = screen.getByLabelText(/^New Password/i);
    const confirmInput = screen.getByLabelText(/Confirm New Password/i);

    fireEvent.change(currentInput, { target: { value: 'oldpass123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpass123' } });
    fireEvent.change(confirmInput, { target: { value: 'mismatch123' } });

    fireEvent.click(screen.getByRole('button', { name: /Update Password/i }));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });
});

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SettingsPage from '../pages/SettingsPage';
import profileService from '../services/profileService';
import { ThemeProvider } from '../context/ThemeContext';

vi.mock('../services/profileService');

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders settings fields and fetches defaults', async () => {
    profileService.getProfile.mockResolvedValue({
      data: {
        defaultTone: 'CASUAL',
        defaultLanguage: 'SPANISH',
        defaultEmailLength: 'SHORT',
        themePreference: 'DARK',
        darkModeEnabled: true
      }
    });

    render(
      <MemoryRouter>
        <ThemeProvider>
          <SettingsPage />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Preferences')).toBeInTheDocument();

    await waitFor(() => {
      // Inputs are rendered via radio buttons, check if the checked one has the right label
      const casualRadio = screen.getByLabelText('Casual');
      expect(casualRadio).toBeChecked();
      
      const spanishRadio = screen.getByLabelText('Spanish');
      expect(spanishRadio).toBeChecked();

      const darkRadio = screen.getByLabelText('Dark');
      expect(darkRadio).toBeChecked();
    });
  });

  it('calls updateSettings on save', async () => {
    profileService.getProfile.mockResolvedValue({
      data: {
        defaultTone: 'PROFESSIONAL',
        defaultLanguage: 'ENGLISH',
        defaultEmailLength: 'MEDIUM',
        themePreference: 'SYSTEM'
      }
    });

    profileService.updateSettings.mockResolvedValue({
      data: {
        defaultTone: 'FRIENDLY',
        defaultLanguage: 'ENGLISH',
        defaultEmailLength: 'MEDIUM',
        themePreference: 'SYSTEM'
      }
    });

    render(
      <MemoryRouter>
        <ThemeProvider>
          <SettingsPage />
        </ThemeProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Professional')).toBeChecked();
    });

    // Change tone to Friendly
    fireEvent.click(screen.getByLabelText('Friendly'));

    // Save
    fireEvent.click(screen.getByRole('button', { name: /Save Preferences/i }));

    await waitFor(() => {
      expect(profileService.updateSettings).toHaveBeenCalled();
      expect(screen.getByText('Settings saved successfully.')).toBeInTheDocument();
    });
  });
});

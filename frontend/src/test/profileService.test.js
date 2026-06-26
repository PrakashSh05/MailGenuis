import { describe, it, expect, vi, beforeEach } from 'vitest';
import profileService from '../services/profileService';
import api from '../services/api';

vi.mock('../services/api');

describe('profileService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('getProfile calls GET /api/v1/profile', async () => {
    api.get.mockResolvedValue({ data: { data: {} } });
    await profileService.getProfile();
    expect(api.get).toHaveBeenCalledWith('/api/v1/profile');
  });

  it('updateProfile calls PUT /api/v1/profile', async () => {
    api.put.mockResolvedValue({ data: {} });
    const payload = { fullName: 'New Name' };
    await profileService.updateProfile(payload);
    expect(api.put).toHaveBeenCalledWith('/api/v1/profile', payload);
  });

  it('changePassword calls PUT /api/v1/profile/password', async () => {
    api.put.mockResolvedValue({ data: {} });
    const payload = { currentPassword: 'old', newPassword: 'new', confirmPassword: 'new' };
    await profileService.changePassword(payload);
    expect(api.put).toHaveBeenCalledWith('/api/v1/profile/password', payload);
  });

  it('updateSettings calls PUT /api/v1/profile/settings', async () => {
    api.put.mockResolvedValue({ data: {} });
    const payload = { defaultTone: 'FRIENDLY' };
    await profileService.updateSettings(payload);
    expect(api.put).toHaveBeenCalledWith('/api/v1/profile/settings', payload);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import templateService from '../services/templateService';
import api from '../services/api';

vi.mock('../services/api');

describe('templateService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('getLibrary calls GET /api/v1/templates/library', async () => {
    api.get.mockResolvedValue({ data: { data: { categories: [] } } });
    await templateService.getLibrary();
    expect(api.get).toHaveBeenCalledWith('/api/v1/templates/library');
  });

  it('getTemplates calls GET /api/v1/templates with params', async () => {
    api.get.mockResolvedValue({ data: { data: { content: [] } } });
    await templateService.getTemplates({ page: 0, size: 10 });
    expect(api.get).toHaveBeenCalledWith('/api/v1/templates', { params: { page: 0, size: 10 } });
  });

  it('createTemplate calls POST /api/v1/templates', async () => {
    api.post.mockResolvedValue({ data: {} });
    const payload = { name: 'Test', tone: 'CASUAL' };
    await templateService.createTemplate(payload);
    expect(api.post).toHaveBeenCalledWith('/api/v1/templates', payload);
  });

  it('updateTemplate calls PUT /api/v1/templates/:id', async () => {
    api.put.mockResolvedValue({ data: {} });
    await templateService.updateTemplate('abc-123', { name: 'Updated' });
    expect(api.put).toHaveBeenCalledWith('/api/v1/templates/abc-123', { name: 'Updated' });
  });

  it('deleteTemplate calls DELETE /api/v1/templates/:id', async () => {
    api.delete.mockResolvedValue({ data: {} });
    await templateService.deleteTemplate('abc-123');
    expect(api.delete).toHaveBeenCalledWith('/api/v1/templates/abc-123');
  });
});

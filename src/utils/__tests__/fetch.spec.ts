import axios from 'axios';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { baseGetAxios, basePostAxios, API_BASE, WL_API_KEY, exportBibliography } from '../fetch';

const mockResolved = {
  status: 200
};

describe('fetch', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });
  describe('postApi', () => {
    describe('success', () => {
      beforeEach(() => {
        vi.spyOn(axios, 'post').mockResolvedValue(mockResolved);
      });

      it('should call axios.post', async () => {
        await basePostAxios('/endpoint');
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(
          `${API_BASE}/api/v1/endpoint`,
          {},
          { headers: { 'X-API-Key': WL_API_KEY, 'X-Session-Id': '' }, withCredentials: true }
        );
      });

      it('should call axios.post with filter', async () => {
        await basePostAxios('/endpoint', { filter: 'i am a filter' });

        expect(axios.post).toHaveBeenCalledWith(
          `${API_BASE}/api/v1/endpoint`,
          {
            filter: 'i am a filter'
          },
          { headers: { 'X-API-Key': WL_API_KEY, 'X-Session-Id': '' }, withCredentials: true }
        );
      });
    });

    describe('error', () => {
      beforeEach(() => {
        vi.spyOn(axios, 'post').mockRejectedValue(new Error('Error fetching data'));
      });

      it('should throw an error', async () => {
        await expect(basePostAxios('/endpoint')).rejects.toThrow('Error fetching data');
      });
    });
  });

  describe('getApi', () => {
    describe('success', () => {
      beforeEach(() => {
        vi.spyOn(axios, 'get').mockResolvedValue(mockResolved);
      });
      it('should call window.fetch', async () => {
        await baseGetAxios('/endpoint');
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(`${API_BASE}/api/v1/endpoint`, {
          headers: { 'X-API-Key': WL_API_KEY, 'X-Session-Id': '' },
          withCredentials: true
        });
      });
    });

    describe('error', () => {
      beforeEach(() => {
        vi.spyOn(axios, 'get').mockRejectedValue(new Error('Error fetching data'));
      });

      it('should throw an error', async () => {
        await expect(baseGetAxios('/endpoint')).rejects.toThrow('Error fetching data');
      });
    });
  });

  describe('exportBibliography', () => {
    beforeEach(() => {
      vi.spyOn(axios, 'post').mockResolvedValue(mockResolved);
    });

    it('should send documents_ids to the bibliography endpoint', async () => {
      const documentsIds = ['a4a8911f-007f-4353-a362-a25b6673f738', 'a4eeeba0-a965-4edf-8fe7-ee4c7fa01338'];

      await exportBibliography(documentsIds);

      expect(axios.post).toHaveBeenCalledWith(
        `${API_BASE}/api/v1/bibliography/export_bibliography`,
        { documents_ids: documentsIds },
        {
          headers: { 'X-API-Key': WL_API_KEY, 'X-Session-Id': '' },
          responseType: 'blob',
          withCredentials: true
        }
      );
    });

    it('should throw when documentsIds is empty', async () => {
      await expect(exportBibliography([])).rejects.toThrow('No document ids provided');
    });
  });
});

// import axios from 'axios';
import http from '../api';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { baseGetAxios, basePostAxios, exportBibliography } from '../fetch';

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
        vi.spyOn(http, 'post').mockResolvedValue(mockResolved);
      });

      it('should call axios.post', async () => {
        await basePostAxios('/endpoint');
        expect(http.post).toHaveBeenCalledTimes(1);
        expect(http.post).toHaveBeenCalledWith(`/endpoint`, {}, undefined);
      });

      it('should call axios.post with filter', async () => {
        await basePostAxios('/endpoint', { filter: 'i am a filter' });

        expect(http.post).toHaveBeenCalledWith(
          `/endpoint`,
          {
            filter: 'i am a filter'
          },
          undefined
        );
      });
    });

    describe('error', () => {
      beforeEach(() => {
        vi.spyOn(http, 'post').mockRejectedValue(new Error('Error fetching data'));
      });

      it('should throw an error', async () => {
        await expect(basePostAxios('/endpoint')).rejects.toThrow('Error fetching data');
      });
    });
  });

  describe('getApi', () => {
    describe('success', () => {
      beforeEach(() => {
        vi.spyOn(http, 'get').mockResolvedValue(mockResolved);
      });
      it('should call window.fetch', async () => {
        await baseGetAxios('/endpoint');
        expect(http.get).toHaveBeenCalledTimes(1);
        expect(http.get).toHaveBeenCalledWith(`/endpoint`);
      });
    });

    describe('error', () => {
      beforeEach(() => {
        vi.spyOn(http, 'get').mockRejectedValue(new Error('Error fetching data'));
      });

      it('should throw an error', async () => {
        await expect(baseGetAxios('/endpoint')).rejects.toThrow('Error fetching data');
      });
    });
  });

  describe('exportBibliography', () => {
    beforeEach(() => {
      vi.spyOn(http, 'post').mockResolvedValue(mockResolved);
    });

    it('should send documents_ids to the bibliography endpoint', async () => {
      const documentsIds = [
        'a4a8911f-007f-4353-a362-a25b6673f738',
        'a4eeeba0-a965-4edf-8fe7-ee4c7fa01338'
      ];

      await exportBibliography(documentsIds);

      expect(http.post).toHaveBeenCalledWith(
        `/bibliography/export_bibliography`,
        { documents_ids: documentsIds },
        {
          responseType: 'blob'
        }
      );
    });

    it('should throw when documentsIds is empty', async () => {
      await expect(exportBibliography([])).rejects.toThrow('No document ids provided');
    });
  });
});

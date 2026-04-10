import axios from 'axios';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { baseGetAxios, basePostAxios, API_BASE, WL_API_KEY } from '../fetch';

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
          { headers: { 'X-API-Key': WL_API_KEY }, withCredentials: true }
        );
      });

      it('should call axios.post with filter', async () => {
        await basePostAxios('/endpoint', { filter: 'i am a filter' });

        expect(axios.post).toHaveBeenCalledWith(
          `${API_BASE}/api/v1/endpoint`,
          {
            filter: 'i am a filter'
          },
          { headers: { 'X-API-Key': WL_API_KEY }, withCredentials: true }
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
          headers: { 'X-API-Key': WL_API_KEY },
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
});

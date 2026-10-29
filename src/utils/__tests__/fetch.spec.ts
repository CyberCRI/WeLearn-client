import axios from 'axios';
import http from '../api';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  baseDeleteAxios,
  baseGetAxios,
  basePostAxios,
  deleteAllBookmarks,
  deleteBookmark,
  exportBibliography,
  fetchStream,
  getBookmarks,
  getSDGsFromQuery,
  getSearch,
  postBookmark
} from '../fetch';

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
        vi.spyOn(console, 'error').mockImplementation(() => {});
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

describe('fetch helpers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getSDGsFromQuery', () => {
    it('returns the codes of the 3 best predictions, best first', async () => {
      vi.spyOn(axios, 'post').mockResolvedValue({
        data: {
          predictions: [
            { prediction: 0.2, sdg: { code: '4' } },
            { prediction: 0.9, sdg: { code: '13' } },
            { prediction: 0.5, sdg: { code: '15' } },
            { prediction: 0.7, sdg: { code: '6' } }
          ]
        }
      });

      expect(await getSDGsFromQuery('forests and water')).toEqual(['13', '6', '15']);
      expect(axios.post).toHaveBeenCalledWith(
        'https://aurora-sdg.labs.vu.nl/classifier/classify/aurora-sdg-multi',
        { text: 'forests and water' }
      );
    });

    it('returns no sdg when the classifier fails', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(axios, 'post').mockRejectedValue(new Error('Network Error'));

      expect(await getSDGsFromQuery('forests and water')).toEqual([]);
    });
  });

  describe('getSearch', () => {
    it('sends the options in the body and the settings in the query string', async () => {
      vi.spyOn(http, 'post').mockResolvedValue({ status: 200, data: { docs: [] } });
      const options = { query: 'forests', lang: ['en'], sdg_filter: [13], corpora: [] };

      const result = await getSearch(30, options, { subject: 'biology', relevanceFactor: 0.5 });

      expect(http.post).toHaveBeenCalledWith('/search/by_document', options, {
        params: { nb_results: 30, subject: 'biology', relevance_factor: 0.5 }
      });
      expect(result).toEqual({ status: 200, data: { docs: [] } });
    });
  });

  describe('bookmarks', () => {
    it('adds a bookmark', async () => {
      vi.spyOn(http, 'post').mockResolvedValue({ status: 200 });

      await postBookmark('doc-1');

      expect(http.post).toHaveBeenCalledWith(
        '/user/bookmarks/:document_id?document_id=doc-1',
        {},
        undefined
      );
    });

    it('deletes a bookmark', async () => {
      vi.spyOn(http, 'delete').mockResolvedValue({ status: 200 });

      await deleteBookmark('doc-1');

      expect(http.delete).toHaveBeenCalledWith('/user/bookmarks/:document_id?document_id=doc-1');
    });

    it('deletes every bookmark', async () => {
      vi.spyOn(http, 'delete').mockResolvedValue({ status: 200 });

      await deleteAllBookmarks();

      expect(http.delete).toHaveBeenCalledWith('/user/bookmarks');
    });

    it('fetches the bookmarked ids, then their documents', async () => {
      vi.spyOn(http, 'get').mockResolvedValue({
        status: 200,
        data: { bookmarks: [{ document_id: 'doc-1' }, { document_id: 'doc-2' }] }
      });
      vi.spyOn(http, 'post').mockResolvedValue({ status: 200, data: [{ id: 'doc-1' }] });

      const result = await getBookmarks();

      expect(http.get).toHaveBeenCalledWith('/user/bookmarks');
      expect(http.post).toHaveBeenCalledWith(
        '/search/documents/by_ids',
        ['doc-1', 'doc-2'],
        undefined
      );
      expect(result.data).toEqual([{ id: 'doc-1' }]);
    });
  });
});

describe('baseDeleteAxios', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls http.delete and returns the response', async () => {
    vi.spyOn(http, 'delete').mockResolvedValue({ status: 200, data: 'ok' });

    const response = await baseDeleteAxios('/endpoint', { params: { id: 1 } });

    expect(http.delete).toHaveBeenCalledWith('/endpoint', { params: { id: 1 } });
    expect(response).toEqual({ status: 200, data: 'ok' });
  });

  it('logs and rethrows the error', async () => {
    const error = new Error('Error deleting data');
    vi.spyOn(http, 'delete').mockRejectedValue(error);
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(baseDeleteAxios('/endpoint')).rejects.toThrow('Error deleting data');
    expect(console.error).toHaveBeenCalledWith('Error in baseDeleteAxios:', error);
  });
});

describe('fetchStream', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('posts the body and returns the streamed response body', async () => {
    localStorage.setItem('sessionId', JSON.stringify('session-1'));
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('data: hello'));
        controller.close();
      }
    });
    const fetchMock = vi.fn().mockResolvedValue({ body });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchStream('/qna/chat/agent_stream', { bodyContent: '{"query":"q"}' });

    expect(result).toBe(body);
    const { value } = await result!.getReader().read();
    expect(new TextDecoder().decode(value)).toBe('data: hello');

    const apiVersion = import.meta.env.VITE_API_VERSION || '/api/v1';
    expect(fetchMock).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_BASE}${apiVersion}/qna/chat/agent_stream`,
      expect.objectContaining({
        method: 'POST',
        body: '{"query":"q"}',
        credentials: 'include',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_WL_API_KEY,
          'X-Session-Id': 'session-1'
        })
      })
    );
  });

  it('throws when the response has no body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ body: null }));

    await expect(fetchStream('/endpoint', { bodyContent: '{}' })).rejects.toThrow(
      'Error fetching data'
    );
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useSourcesStore } from '../sources';
import { baseGetAxios, exportBibliography } from '@/utils/fetch';
import type { Corpus, Document } from '@/types';

vi.mock('@/utils/fetch', () => ({
  baseGetAxios: vi.fn(),
  exportBibliography: vi.fn()
}));

const corpus = (name: string, category: string | null) => ({ name, category }) as Corpus;
const doc = (id: string) => ({ payload: { document_id: id } }) as Document;

describe('sources store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  describe('getSourcesList', () => {
    it('groups the corpora by category, sorted by name', async () => {
      vi.mocked(baseGetAxios).mockResolvedValue([
        corpus('openalex', 'research'),
        corpus('bmj-open', 'research'),
        corpus('ted', 'video'),
        corpus('misc', null)
      ]);
      const store = useSourcesStore();

      const result = await store.getSourcesList();

      expect(baseGetAxios).toHaveBeenCalledWith('/search/collections');
      expect(result).toEqual({
        research: [corpus('bmj-open', 'research'), corpus('openalex', 'research')],
        video: [corpus('ted', 'video')],
        null: [corpus('misc', null)]
      });
      expect(store.sourcesList).toEqual(result);
      expect(store.sourceCategoryMap).toEqual({
        'bmj-open': 'research',
        openalex: 'research',
        ted: 'video',
        misc: 'null'
      });
    });

    it('fetches the corpora only once', async () => {
      vi.mocked(baseGetAxios).mockResolvedValue([corpus('ted', 'video')]);
      const store = useSourcesStore();

      await store.getSourcesList();
      await store.getSourcesList();

      expect(baseGetAxios).toHaveBeenCalledOnce();
    });

    it('rethrows a request error', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(baseGetAxios).mockRejectedValue(new Error('Network Error'));

      await expect(useSourcesStore().getSourcesList()).rejects.toThrow('Network Error');
    });
  });

  describe('getInfoPerCorpus', () => {
    it('stores the info and adds up the documents', async () => {
      const info = [
        { corpus: 'ted', qty_in_qdrant: 10 },
        { corpus: 'openalex', qty_in_qdrant: 32 }
      ];
      vi.mocked(baseGetAxios).mockResolvedValue(info);
      const store = useSourcesStore();

      await store.getInfoPerCorpus();
      await store.getInfoPerCorpus();

      expect(baseGetAxios).toHaveBeenCalledOnce();
      expect(baseGetAxios).toHaveBeenCalledWith('/metric/nb_docs_info_per_corpus');
      expect(store.infoPerCorpus).toEqual(info);
      expect(store.totalInQdrant).toBe(42);
    });

    it('keeps an empty list when the request fails', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(baseGetAxios).mockRejectedValue(new Error('Network Error'));
      const store = useSourcesStore();

      await store.getInfoPerCorpus();

      expect(store.infoPerCorpus).toEqual([]);
      expect(store.totalInQdrant).toBe(0);
    });
  });

  describe('handleBibliographyExport', () => {
    beforeEach(() => {
      // jsdom does not implement object urls
      window.URL.createObjectURL = vi.fn(() => 'blob:export');
      window.URL.revokeObjectURL = vi.fn();
    });

    it('exports each document once and downloads the file', async () => {
      const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
      vi.mocked(exportBibliography).mockResolvedValue({
        data: 'TY  - JOUR',
        headers: { 'content-type': 'application/x-research-info-systems' }
      } as unknown as Awaited<ReturnType<typeof exportBibliography>>);
      const store = useSourcesStore();

      await store.handleBibliographyExport([doc('doc-1'), doc('doc-2'), doc('doc-1')]);

      expect(exportBibliography).toHaveBeenCalledWith(['doc-1', 'doc-2']);
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
      expect(click).toHaveBeenCalledOnce();
      expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:export');
      expect(store.isExportingBibliography).toBe(false);
    });

    it('does nothing without document ids', async () => {
      await useSourcesStore().handleBibliographyExport([doc('')]);

      expect(exportBibliography).not.toHaveBeenCalled();
    });

    it('does not start a second export while one is running', async () => {
      const store = useSourcesStore();
      store.isExportingBibliography = true;

      await store.handleBibliographyExport([doc('doc-1')]);

      expect(exportBibliography).not.toHaveBeenCalled();
    });

    it('ends the export when the request fails', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(exportBibliography).mockRejectedValue(new Error('Network Error'));
      const store = useSourcesStore();

      await store.handleBibliographyExport([doc('doc-1')]);

      expect(store.isExportingBibliography).toBe(false);
      expect(window.URL.createObjectURL).not.toHaveBeenCalled();
    });
  });
});

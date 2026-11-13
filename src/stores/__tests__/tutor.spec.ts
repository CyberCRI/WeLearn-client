import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import axios from 'axios';
import { useTutorStore } from '../tutor';
import { useGuestQuotaStore } from '../guestQuota';
import { basePostAxios } from '@/utils/fetch';
import { convertMarkdownToDocx, downloadDocx } from '@/utils/md-to-docx';
import type { Document, TutorSearch } from '@/types';
import { track } from '@/utils/analytics';

vi.mock('@/utils/fetch', () => ({
  basePostAxios: vi.fn()
}));

vi.mock('@/utils/md-to-docx', () => ({
  convertMarkdownToDocx: vi.fn(),
  downloadDocx: vi.fn()
}));

vi.mock('@/utils/analytics', () => ({ track: vi.fn() }));

const auth = vi.hoisted(() => ({ isGuest: false, askToSignUp: vi.fn() }));
vi.mock('@/stores/auth', () => ({ useAuthStore: () => auth }));

type PostResult = Awaited<ReturnType<typeof basePostAxios>>;
const mockPost = (value: unknown) =>
  vi.mocked(basePostAxios).mockResolvedValueOnce(value as PostResult);
const mockPostError = (error: unknown) => vi.mocked(basePostAxios).mockRejectedValueOnce(error);
// a request that only answers when the test resolves it
const deferredPost = () => {
  let resolve: (value: unknown) => void = () => {};
  vi.mocked(basePostAxios).mockImplementationOnce(
    () => new Promise<unknown>((r) => (resolve = r)) as ReturnType<typeof basePostAxios>
  );
  return (value: unknown) => resolve(value);
};

const PDF = 'application/pdf';
const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const file = (name: string, type = PDF, size = 10) =>
  new File([new Uint8Array(size)], name, { type });

const doc = (id: string) => ({ id, payload: { document_id: id } }) as unknown as Document;
const search = (docs: Document[] = [doc('found-1')]) =>
  ({ extracts: [], nb_results: docs.length, documents: docs }) as unknown as TutorSearch;

const pedagogical = { source: 'PedagogicalEngineerAgent', content: '| a\\nb |\nline\\nnext' };

describe('tutor store', () => {
  beforeEach(() => {
    auth.isGuest = false;
    localStorage.clear();
    setActivePinia(createPinia());
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  describe('steps', () => {
    it('moves to the next step and sets a given step', () => {
      const store = useTutorStore();
      expect(store.step).toBe(1);

      store.goNext();
      expect(store.step).toBe(2);

      store.setStep(4);
      expect(store.step).toBe(4);
    });
  });

  describe('path (syllabus v2)', () => {
    it('starts with no path and keeps the one chosen', () => {
      const store = useTutorStore();
      expect(store.path).toBeNull();
      store.choosePath('existing');
      expect(store.path).toBe('existing');
    });

    it('counts files, course details or a later step as started work', () => {
      const store = useTutorStore();
      expect(store.hasStartedCourse).toBe(false);

      store.courseTitle = 'Sociolinguistics';
      expect(store.hasStartedCourse).toBe(true);
      store.courseTitle = '';

      store.addFiles([new File(['a'], 'a.pdf', { type: 'application/pdf' })]);
      expect(store.hasStartedCourse).toBe(true);
      store.newFilesToSearch = {};

      store.setStep(2);
      expect(store.hasStartedCourse).toBe(true);
    });

    it('goes back to the question and drops the work of the path', () => {
      const store = useTutorStore();
      store.choosePath('scratch');
      store.courseTitle = 'Sociolinguistics';
      store.setStep(3);

      store.resetPath();

      expect(store.path).toBeNull();
      expect(store.step).toBe(1);
      expect(store.courseTitle).toBe('');
      expect(store.hasStartedCourse).toBe(false);
    });

    it('keeps the path when the wizard starts over', () => {
      const store = useTutorStore();
      store.choosePath('scratch');
      store.restart();
      expect(store.path).toBe('scratch');
    });
  });

  describe('files', () => {
    it('adds pdf, text and docx files', () => {
      const store = useTutorStore();

      store.addFiles([file('a.pdf'), file('b.txt', 'text/plain'), file('c.docx', DOCX)]);

      expect(Object.keys(store.newFilesToSearch)).toEqual(['a.pdf', 'b.txt', 'c.docx']);
      expect(store.fileError).toEqual({ state: false, reason: null });
    });

    it('rejects a file over 5 MB', () => {
      const store = useTutorStore();

      store.addFiles([file('big.pdf', PDF, 5 * 1024 * 1024 + 1)]);

      expect(store.newFilesToSearch).toEqual({});
      expect(store.fileError).toEqual({ state: true, reason: 'BIG_FILE' });
    });

    it('rejects a file with a bad type', () => {
      const store = useTutorStore();

      store.addFiles([file('pic.png', 'image/png')]);

      expect(store.newFilesToSearch).toEqual({});
      expect(store.fileError).toEqual({ state: true, reason: 'BAD_EXTENSION' });
    });

    it('rejects a fourth file but accepts the same name again', () => {
      const store = useTutorStore();
      store.addFiles([file('1.pdf'), file('2.pdf'), file('3.pdf')]);

      store.addFiles([file('4.pdf')]);
      expect(Object.keys(store.newFilesToSearch)).toEqual(['1.pdf', '2.pdf', '3.pdf']);
      expect(store.fileError).toEqual({ state: true, reason: 'TOO_MANY_FILES' });

      const replacement = file('1.pdf', PDF, 20);
      store.addFiles([replacement]);
      expect(store.newFilesToSearch['1.pdf']).toBe(replacement);
      expect(store.fileError).toEqual({ state: false, reason: null });
    });

    it('removes a file and clears the error', () => {
      const store = useTutorStore();
      store.addFiles([file('a.pdf'), file('pic.png', 'image/png')]);
      expect(store.fileError.state).toBe(true);

      store.removeFile('a.pdf');

      expect(store.newFilesToSearch).toEqual({});
      expect(store.fileError).toEqual({ state: false, reason: null });
    });
  });

  describe('editing', () => {
    it('updates one summary', () => {
      const store = useTutorStore();
      store.summaries = ['one', 'two'];

      store.updateSummary(1, 'edited');

      expect(store.summaries).toEqual(['one', 'edited']);
    });

    it('updates the syllabus content only when there is one', () => {
      const store = useTutorStore();

      store.updateSyllabus('ignored');
      expect(store.syllabi).toBeUndefined();

      store.syllabi = { source: 'agent', content: 'old' };
      store.updateSyllabus('new');
      expect(store.syllabi).toEqual({ source: 'agent', content: 'new' });
    });

    it('selecting a language forgets the searched files', () => {
      const store = useTutorStore();
      store.searchedFiles = [file('a.pdf')];

      store.selectSyllabusLanguage('en');

      expect(store.syllabusLanguage).toBe('en');
      expect(store.searchedFiles).toEqual([]);
    });

    it('toggles a selected source', () => {
      const store = useTutorStore();

      store.appendSource(doc('1'));
      store.appendSource(doc('2'));
      expect(store.selectedSources.map((s) => s.id)).toEqual(['1', '2']);

      store.appendSource(doc('1'));
      expect(store.selectedSources.map((s) => s.id)).toEqual(['2']);
    });

    it('compares sources by id, not by object, and falls back to the document id', () => {
      const store = useTutorStore();
      const noId = (documentId: string) =>
        ({ id: null, payload: { document_id: documentId } }) as unknown as Document;

      store.appendSource(doc('1'));
      store.appendSource(noId('a'));
      store.appendSource(noId('b'));
      expect(store.selectedSources).toHaveLength(3);

      // other copies of the same documents, as a new search result would give
      store.appendSource(doc('1'));
      store.appendSource(noId('a'));
      expect(store.selectedSources.map((s) => s.payload.document_id)).toEqual(['b']);
    });
  });

  describe('handleSummaryFiles', () => {
    it('does nothing without files', async () => {
      const store = useTutorStore();
      store.setStep(3);
      store.selectedSources = [doc('1')];

      expect(await store.handleSummaryFiles()).toBe(false);

      expect(store.step).toBe(3);
      expect(store.selectedSources).toEqual([doc('1')]);
      expect(basePostAxios).not.toHaveBeenCalled();
    });

    it('sends the files and stores the summaries', async () => {
      mockPost({
        status: 200,
        data: { extracts: [{ summary: 's1' }, { summary: 's2' }] }
      });
      const store = useTutorStore();
      store.selectSyllabusLanguage('en');
      const files = [file('a.pdf'), file('b.txt', 'text/plain')];
      store.addFiles(files);
      store.tutorSearch = search();

      await store.handleSummaryFiles();

      const [url, body, options] = vi.mocked(basePostAxios).mock.calls[0];
      expect(url).toBe('/tutor/files/content?lang=en');
      expect((body as FormData).getAll('files')).toHaveLength(2);
      expect(options).toMatchObject({ headers: { 'content-type': 'multipart/form-data' } });
      expect(options?.signal).toBeInstanceOf(AbortSignal);
      expect(store.summaries).toEqual(['s1', 's2']);
      expect(store.searchedFiles).toEqual(files);
      expect(store.tutorSearch).toBeUndefined();
      expect(store.isLoading).toBe(false);
      expect(store.step).toBe(2);
    });

    it('keeps every later step when the files did not change (from step 4)', async () => {
      mockPost({ status: 200, data: { extracts: [{ summary: 's1' }] } });
      const store = useTutorStore();
      store.addFiles([file('a.pdf')]);
      await store.handleSummaryFiles();
      store.updateSummary(0, 'edited');
      const result = search([doc('1'), doc('2')]);
      store.tutorSearch = result;
      store.appendSource(doc('2'));
      store.syllabi = { source: 'PedagogicalEngineerAgent', content: 'my edited syllabus' };
      store.setStep(4);

      expect(await store.handleSummaryFiles()).toBe(true);

      expect(basePostAxios).toHaveBeenCalledOnce();
      expect(store.step).toBe(4);
      expect(store.summaries).toEqual(['edited']);
      expect(store.tutorSearch).toEqual(result);
      expect(store.selectedSources).toEqual([doc('2')]);
      expect(store.syllabi?.content).toBe('my edited syllabus');
    });

    it('moves on to the summaries when the same files are sent again from step 1', async () => {
      mockPost({ status: 200, data: { extracts: [{ summary: 's1' }] } });
      const store = useTutorStore();
      store.addFiles([file('a.pdf')]);
      await store.handleSummaryFiles();
      store.setStep(1);

      expect(await store.handleSummaryFiles()).toBe(true);

      expect(basePostAxios).toHaveBeenCalledOnce();
      expect(store.step).toBe(2);
    });

    it('starts over from the summaries when the files changed (from step 4)', async () => {
      mockPost({ status: 200, data: { extracts: [{ summary: 's1' }] } });
      mockPost({ status: 200, data: { extracts: [{ summary: 's2' }] } });
      const store = useTutorStore();
      store.addFiles([file('a.pdf')]);
      await store.handleSummaryFiles();
      store.tutorSearch = search();
      store.appendSource(doc('found-1'));
      store.setStep(4);

      store.addFiles([file('b.pdf')]);
      expect(await store.handleSummaryFiles()).toBe(false);

      expect(basePostAxios).toHaveBeenCalledTimes(2);
      expect(store.summaries).toEqual(['s2']);
      expect(store.tutorSearch).toBeUndefined();
      expect(store.selectedSources).toEqual([]);
      expect(store.step).toBe(2);
    });

    it('asks for a retry on a 204', async () => {
      mockPost({ status: 204 });
      const store = useTutorStore();
      store.addFiles([file('a.pdf')]);

      await store.handleSummaryFiles();

      expect(store.shouldRetryAction).toBe(true);
      expect(store.step).toBe(1);
      expect(store.searchedFiles).toEqual([]);
    });

    it('stays quiet when the request is cancelled', async () => {
      mockPostError(new axios.CanceledError());
      const store = useTutorStore();
      store.addFiles([file('a.pdf')]);

      await store.handleSummaryFiles();

      expect(store.shouldRetryAction).toBe(false);
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('retrieveTutorSearch', () => {
    it('stores the search result and goes to step 3', async () => {
      const result = search();
      mockPost({ status: 200, data: result });
      const store = useTutorStore();
      store.summaries = ['s1'];

      await store.retrieveTutorSearch();

      expect(basePostAxios).toHaveBeenCalledWith(
        '/tutor/search_extracts',
        { summaries: ['s1'] },
        { signal: expect.any(AbortSignal) }
      );
      expect(store.tutorSearch).toEqual(result);
      expect(store.hasSearchError).toBe(false);
      expect(store.isLoading).toBe(false);
      expect(store.step).toBe(3);
    });

    it('clears the selection made in the previous result', async () => {
      mockPost({ status: 200, data: search([doc('new-1')]) });
      const store = useTutorStore();
      store.tutorSearch = search([doc('old-1'), doc('old-2')]);
      store.appendSource(doc('old-1'));
      store.appendSource(doc('old-2'));

      await store.retrieveTutorSearch();

      expect(store.selectedSources).toEqual([]);
    });

    it('keeps the selection when the search has to be retried', async () => {
      mockPost({ status: 204 });
      const store = useTutorStore();
      store.appendSource(doc('old-1'));

      await store.retrieveTutorSearch();

      expect(store.selectedSources).toEqual([doc('old-1')]);
    });

    it('asks for a retry on a 204', async () => {
      mockPost({ status: 204 });
      const store = useTutorStore();

      await store.retrieveTutorSearch();

      expect(store.shouldRetryAction).toBe(true);
      expect(store.tutorSearch).toBeUndefined();
      expect(store.step).toBe(2);
    });

    it('flags a search error', async () => {
      mockPostError(new Error('boom'));
      const store = useTutorStore();

      await store.retrieveTutorSearch();

      expect(store.hasSearchError).toBe(true);
      expect(store.shouldRetryAction).toBe(true);
      expect(store.reloadError).toBe(false);
    });

    it('flags a reload error on a network error', async () => {
      mockPostError(Object.assign(new Error('offline'), { code: 'ERR_NETWORK' }));
      const store = useTutorStore();

      await store.retrieveTutorSearch();

      expect(store.reloadError).toBe(true);
    });

    it('ignores a cancelled request', async () => {
      mockPostError(new axios.CanceledError());
      const store = useTutorStore();

      await store.retrieveTutorSearch();

      expect(store.hasSearchError).toBe(false);
      expect(store.shouldRetryAction).toBe(false);
    });
  });

  describe('stopAction', () => {
    it('aborts the running request and stops loading', async () => {
      let signal: AbortSignal | undefined;
      vi.mocked(basePostAxios).mockImplementationOnce((_url, _body, options) => {
        signal = options?.signal as AbortSignal;
        return new Promise(() => {}) as ReturnType<typeof basePostAxios>;
      });
      const store = useTutorStore();
      void store.retrieveTutorSearch();
      expect(store.isLoading).toBe(true);

      store.stopAction();

      expect(signal?.aborted).toBe(true);
      expect(store.isLoading).toBe(false);
      expect(store.shouldRetryAction).toBe(false);
    });

    it('aborts the previous request when a new one starts', async () => {
      const signals: AbortSignal[] = [];
      vi.mocked(basePostAxios).mockImplementation((_url, _body, options) => {
        signals.push(options?.signal as AbortSignal);
        return new Promise(() => {}) as ReturnType<typeof basePostAxios>;
      });
      const store = useTutorStore();

      void store.retrieveTutorSearch();
      void store.retrieveTutorSearch();

      expect(signals[0].aborted).toBe(true);
      expect(signals[1].aborted).toBe(false);
    });
  });

  describe('syllabus', () => {
    it('does not create a syllabus without a search', async () => {
      const store = useTutorStore();

      await store.handleCreateSyllabus();

      expect(store.step).toBe(3);
      expect(basePostAxios).not.toHaveBeenCalled();
    });

    it('sends no WeLearn documents when none are selected', async () => {
      mockPost({
        data: { syllabus: [{ source: 'OtherAgent', content: 'x' }, pedagogical] }
      });
      const store = useTutorStore();
      store.selectSyllabusLanguage('fr');
      store.tutorSearch = search([doc('found-1')]);
      store.feedbackHistory = ['old'];

      await store.handleCreateSyllabus();

      const [url, body] = vi.mocked(basePostAxios).mock.calls[0];
      expect(url).toBe('/tutor/syllabus?lang=fr');
      expect(body).toEqual({ ...search([doc('found-1')]), documents: [], extracts: [] });
      expect(store.syllabi).toEqual({
        source: 'PedagogicalEngineerAgent',
        content: '| a<br>b |\nline\nnext'
      });
      expect(store.feedbackHistory).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.step).toBe(4);
    });

    it('sends the selected sources and the course details', async () => {
      mockPost({ data: { syllabus: [pedagogical] } });
      const store = useTutorStore();
      store.tutorSearch = search();
      store.appendSource(doc('picked'));
      store.courseTitle = 'Title';
      store.level = 'L1';
      store.duration = '10h';
      store.description = 'desc';

      expect(await store.retrieveSyllabus()).toBe(true);

      expect(vi.mocked(basePostAxios).mock.calls[0][1]).toMatchObject({
        documents: [doc('picked')],
        course_title: 'Title',
        level: 'L1',
        duration: '10h',
        description: 'desc'
      });
    });

    it('asks for a retry when the syllabus fails', async () => {
      mockPostError(new Error('boom'));
      const store = useTutorStore();
      store.tutorSearch = search();

      await store.handleCreateSyllabus();

      expect(store.shouldRetryAction).toBe(true);
      expect(store.step).toBe(3);
    });

    it.each([
      ['no syllabus from the pedagogical engineer', [{ source: 'OtherAgent', content: 'x' }]],
      ['an empty syllabus', [{ source: 'PedagogicalEngineerAgent', content: '' }]],
      ['no syllabus at all', []]
    ])('asks for a retry and keeps the guest quota on %s', async (_, syllabus) => {
      auth.isGuest = true;
      mockPost({ data: { syllabus } });
      const store = useTutorStore();
      store.tutorSearch = search();

      await store.handleCreateSyllabus();

      expect(store.syllabi).toBeUndefined();
      expect(store.shouldRetryAction).toBe(true);
      // the retry modal shows while loading
      expect(store.isLoading).toBe(true);
      expect(store.step).toBe(3);
      expect(useGuestQuotaStore().usage.syllabus).toBe(0);
      expect(track).toHaveBeenCalledWith('Tutor Step Failed', expect.objectContaining({ step: 3 }));
    });

    it('returns false quietly when the syllabus request is cancelled', async () => {
      mockPostError(new axios.CanceledError());
      const store = useTutorStore();

      expect(await store.retrieveSyllabus()).toBe(false);
      expect(store.shouldRetryAction).toBe(false);
    });
  });

  describe('giveFeedback', () => {
    const ready = () => {
      const store = useTutorStore();
      store.tutorSearch = search();
      store.syllabi = { source: 'agent', content: 'old' };
      return store;
    };

    it('fails without a search or a syllabus, and sends nothing', async () => {
      const store = useTutorStore();

      expect(await store.giveFeedback('more')).toBe(false);
      expect(basePostAxios).not.toHaveBeenCalled();
      expect(store.isLoading).toBe(false);
    });

    it('keeps loading when a newer request replaced the feedback', async () => {
      const resolve = deferredPost();
      vi.mocked(basePostAxios).mockImplementationOnce(
        () => new Promise(() => {}) as ReturnType<typeof basePostAxios>
      );
      const store = ready();
      const feedback = store.giveFeedback('shorter');
      void store.retrieveSyllabus();

      resolve({ data: { syllabus: [{ source: 'agent', content: 'late' }] } });

      expect(await feedback).toBeUndefined();
      expect(store.syllabi?.content).toBe('old');
      expect(store.isLoading).toBe(true);
    });

    it('applies the feedback', async () => {
      mockPost({ data: { syllabus: [{ source: 'agent', content: 'new\\nline' }] } });
      const store = ready();

      expect(await store.giveFeedback('shorter')).toBe(true);

      expect(vi.mocked(basePostAxios).mock.calls[0][1]).toMatchObject({
        feedback: 'shorter',
        syllabus: [{ source: 'agent', content: 'old' }],
        documents: []
      });
      expect(store.syllabi).toEqual({ source: 'agent', content: 'new\nline' });
      expect(store.feedbackHistory).toEqual(['shorter']);
      expect(store.isLoading).toBe(false);
    });

    it('returns false on failure', async () => {
      mockPostError(new Error('boom'));
      const store = ready();

      expect(await store.giveFeedback('shorter')).toBe(false);
      expect(store.syllabi?.content).toBe('old');
      expect(store.feedbackHistory).toEqual([]);
      expect(store.isLoading).toBe(false);
    });

    it('returns undefined when cancelled', async () => {
      mockPostError(new axios.CanceledError());
      const store = ready();

      expect(await store.giveFeedback('shorter')).toBeUndefined();
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('download and save', () => {
    it('does not download without a syllabus', async () => {
      const store = useTutorStore();

      await store.handleDownloadSyllabus();

      expect(convertMarkdownToDocx).not.toHaveBeenCalled();
      expect(basePostAxios).not.toHaveBeenCalled();
    });

    it('downloads the syllabus as docx and records the metric', async () => {
      const blob = new Blob(['docx']);
      vi.mocked(convertMarkdownToDocx).mockResolvedValueOnce(blob);
      mockPost({});
      const store = useTutorStore();
      store.syllabi = { source: 'agent', content: '# Course' };

      await store.handleDownloadSyllabus();

      expect(convertMarkdownToDocx).toHaveBeenCalledWith('# Course');
      expect(downloadDocx).toHaveBeenCalledWith(blob, 'syllabus.docx');
      expect(basePostAxios).toHaveBeenCalledWith('/metric/syllabus_downloaded');
    });

    it('still downloads when the metric fails', async () => {
      vi.mocked(convertMarkdownToDocx).mockResolvedValueOnce(new Blob(['docx']));
      mockPostError(new Error('boom'));
      const store = useTutorStore();
      store.syllabi = { source: 'agent', content: '# Course' };

      await store.handleDownloadSyllabus();

      expect(downloadDocx).toHaveBeenCalledOnce();
      expect(console.error).toHaveBeenCalledWith('Error during metrics update:', expect.any(Error));
    });

    it('shows an error and records nothing when the word file fails', async () => {
      vi.mocked(convertMarkdownToDocx).mockRejectedValueOnce(new Error('docx'));
      const store = useTutorStore();
      store.syllabi = { source: 'agent', content: '# Course' };

      await expect(store.handleDownloadSyllabus()).resolves.toBeUndefined();

      expect(store.hasDownloadError).toBe(true);
      expect(downloadDocx).not.toHaveBeenCalled();
      expect(basePostAxios).not.toHaveBeenCalled();
      expect(track).not.toHaveBeenCalled();
    });

    it('clears the download error on the next successful download', async () => {
      vi.mocked(convertMarkdownToDocx).mockResolvedValueOnce(new Blob(['docx']));
      mockPost({});
      const store = useTutorStore();
      store.syllabi = { source: 'agent', content: '# Course' };
      store.hasDownloadError = true;

      await store.handleDownloadSyllabus();

      expect(store.hasDownloadError).toBe(false);
    });

    it('asks a guest who used their syllabus to sign up before uploading files', async () => {
      auth.isGuest = true;
      localStorage.setItem('guestUsage', JSON.stringify({ chat: 0, syllabus: 1 }));
      const store = useTutorStore();
      store.addFiles([file('a.pdf')]);
      store.setStep(3);
      store.selectedSources = [doc('1')];

      expect(await store.handleSummaryFiles()).toBe(false);

      expect(auth.askToSignUp).toHaveBeenCalledWith('syllabusLimit');
      expect(basePostAxios).not.toHaveBeenCalled();
      expect(store.step).toBe(3);
      expect(store.selectedSources).toEqual([doc('1')]);
    });

    it('asks a guest who used their syllabus to sign up before generating another', async () => {
      auth.isGuest = true;
      localStorage.setItem('guestUsage', JSON.stringify({ chat: 0, syllabus: 1 }));
      const store = useTutorStore();
      store.tutorSearch = search();

      await store.handleCreateSyllabus();

      expect(auth.askToSignUp).toHaveBeenCalledWith('syllabusLimit');
      expect(basePostAxios).not.toHaveBeenCalled();
    });

    it('counts a generated syllabus in the guest quota', async () => {
      auth.isGuest = true;
      mockPost({ data: { syllabus: [pedagogical] } });
      const store = useTutorStore();
      store.tutorSearch = search();

      await store.handleCreateSyllabus();

      expect(store.step).toBe(4);
      expect(useGuestQuotaStore().usage.syllabus).toBe(1);
    });

    it('keeps a guest syllabus and asks to sign up instead of downloading', async () => {
      auth.isGuest = true;
      const store = useTutorStore();
      store.syllabi = { source: 'agent', content: '# Course' };

      await store.handleDownloadSyllabus();

      expect(auth.askToSignUp).toHaveBeenCalledWith('download');
      expect(convertMarkdownToDocx).not.toHaveBeenCalled();
      expect(JSON.parse(localStorage.getItem('pendingSyllabus') || '')).toBe('# Course');
    });

    it('downloads the kept syllabus once the guest is logged in, only once', async () => {
      localStorage.setItem('pendingSyllabus', JSON.stringify('# Course'));
      vi.mocked(convertMarkdownToDocx).mockResolvedValueOnce(new Blob(['docx']));
      mockPost({});
      const store = useTutorStore();

      await store.downloadPendingSyllabus();
      await store.downloadPendingSyllabus();

      expect(convertMarkdownToDocx).toHaveBeenCalledOnce();
      expect(convertMarkdownToDocx).toHaveBeenCalledWith('# Course');
      expect(downloadDocx).toHaveBeenCalledOnce();
      expect(localStorage.getItem('pendingSyllabus')).toBeNull();
    });

    it('keeps the kept syllabus and shows an error when its download fails', async () => {
      localStorage.setItem('pendingSyllabus', JSON.stringify('# Course'));
      vi.mocked(convertMarkdownToDocx).mockRejectedValueOnce(new Error('docx'));
      const store = useTutorStore();

      await expect(store.downloadPendingSyllabus()).resolves.toBeUndefined();

      expect(store.hasDownloadError).toBe(true);
      expect(JSON.parse(localStorage.getItem('pendingSyllabus') || '')).toBe('# Course');
    });

    it('does not download the kept syllabus while still a guest', async () => {
      auth.isGuest = true;
      localStorage.setItem('pendingSyllabus', JSON.stringify('# Course'));

      await useTutorStore().downloadPendingSyllabus();

      expect(convertMarkdownToDocx).not.toHaveBeenCalled();
      expect(localStorage.getItem('pendingSyllabus')).not.toBeNull();
    });

    it('does not save without a syllabus', async () => {
      const store = useTutorStore();

      await store.updateSyllabusInDB();

      expect(basePostAxios).not.toHaveBeenCalled();
    });

    it('saves the edited syllabus', async () => {
      mockPost({});
      const store = useTutorStore();
      store.syllabi = { source: 'agent', content: '# Course' };

      await store.updateSyllabusInDB();

      expect(basePostAxios).toHaveBeenCalledWith('/tutor/syllabus/user_update', {
        syllabus: '# Course'
      });
    });

    it('logs a failed save', async () => {
      mockPostError(new Error('boom'));
      const store = useTutorStore();
      store.syllabi = { source: 'agent', content: '# Course' };

      await store.updateSyllabusInDB();

      expect(console.error).toHaveBeenCalledWith(
        'Error during syllabus update:',
        expect.any(Error)
      );
    });
  });

  describe('restart', () => {
    it('resets the wizard', () => {
      const store = useTutorStore();
      store.setStep(4);
      store.tutorSearch = search();
      store.syllabi = { source: 'agent', content: 'x' };
      store.summaries = ['s'];
      store.appendSource(doc('1'));
      store.courseTitle = 'Title';
      store.level = 'L1';
      store.duration = '10h';
      store.description = 'desc';
      store.addFiles([file('a.pdf'), file('pic.png', 'image/png')]);
      store.searchedFiles = [file('a.pdf')];
      store.feedbackHistory = ['f'];
      store.hasSearchError = true;

      store.restart();

      expect(store.step).toBe(1);
      expect(store.tutorSearch).toBeUndefined();
      expect(store.syllabi).toBeUndefined();
      expect(store.summaries).toEqual([]);
      expect(store.selectedSources).toEqual([]);
      expect([store.courseTitle, store.level, store.duration, store.description]).toEqual([
        '',
        '',
        '',
        ''
      ]);
      expect(store.newFilesToSearch).toEqual({});
      expect(store.searchedFiles).toEqual([]);
      expect(store.feedbackHistory).toEqual([]);
      expect(store.hasSearchError).toBe(false);
      expect(store.fileError).toEqual({ state: false, reason: null });
    });

    it('stops the running request and clears the loading and error states', () => {
      let signal: AbortSignal | undefined;
      vi.mocked(basePostAxios).mockImplementationOnce((_url, _body, options) => {
        signal = options?.signal as AbortSignal;
        return new Promise(() => {}) as ReturnType<typeof basePostAxios>;
      });
      const store = useTutorStore();
      store.tutorSearch = search();
      void store.retrieveSyllabus();
      store.shouldRetryAction = true;
      store.reloadError = true;
      store.hasDownloadError = true;

      store.restart();

      expect(signal?.aborted).toBe(true);
      expect(store.isLoading).toBe(false);
      expect(store.shouldRetryAction).toBe(false);
      expect(store.reloadError).toBe(false);
      expect(store.hasDownloadError).toBe(false);
    });

    it.each([
      [
        'syllabus',
        { data: { syllabus: [pedagogical] } },
        (store: ReturnType<typeof useTutorStore>) => {
          store.tutorSearch = search();
          store.setStep(3);
          return store.handleCreateSyllabus();
        }
      ],
      [
        'search',
        { status: 200, data: search() },
        (store: ReturnType<typeof useTutorStore>) => store.retrieveTutorSearch()
      ],
      [
        'files',
        { status: 200, data: { extracts: [{ summary: 'late' }] } },
        (store: ReturnType<typeof useTutorStore>) => {
          store.addFiles([file('a.pdf')]);
          return store.handleSummaryFiles();
        }
      ]
    ])('ignores a %s response that comes back after the restart', async (_, response, run) => {
      const resolve = deferredPost();
      const store = useTutorStore();
      const pending = run(store);

      store.restart();
      resolve(response);
      await pending;

      expect(store.step).toBe(1);
      expect(store.syllabi).toBeUndefined();
      expect(store.tutorSearch).toBeUndefined();
      expect(store.summaries).toEqual([]);
      expect(store.searchedFiles).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.shouldRetryAction).toBe(false);
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('analytics', () => {
    it('tracks the files step with counts only', async () => {
      mockPost({ status: 200, data: { extracts: [{ summary: 's1' }, { summary: 's2' }] } });
      const store = useTutorStore();
      store.addFiles([file('a.pdf', PDF, 2048), file('b.docx', DOCX, 1024)]);

      await store.handleSummaryFiles();

      expect(track).toHaveBeenCalledWith('Tutor Step Completed', {
        step: 1,
        durationMs: expect.any(Number),
        filesCount: 2,
        fileTypes: [PDF, DOCX],
        totalSizeKb: 3
      });
    });

    it('tracks a failed files step', async () => {
      mockPostError(new Error('boom'));
      const store = useTutorStore();
      store.addFiles([file('a.pdf')]);

      await store.handleSummaryFiles();

      expect(track).toHaveBeenCalledWith('Tutor Step Failed', {
        step: 1,
        durationMs: expect.any(Number)
      });
    });

    it('tracks the search step and its failure', async () => {
      mockPost({ status: 200, data: search([doc('1'), doc('2')]) });
      const store = useTutorStore();

      await store.retrieveTutorSearch();
      mockPostError(new Error('boom'));
      await store.retrieveTutorSearch();

      expect(track).toHaveBeenCalledWith('Tutor Step Completed', {
        step: 2,
        durationMs: expect.any(Number),
        sourcesCount: 2
      });
      expect(track).toHaveBeenCalledWith('Tutor Step Failed', {
        step: 2,
        durationMs: expect.any(Number)
      });
    });

    it('tracks the syllabus step and its failure', async () => {
      mockPost({ data: { syllabus: [pedagogical] } });
      const store = useTutorStore();
      store.tutorSearch = search([doc('1')]);
      store.appendSource(doc('1'));

      await store.handleCreateSyllabus();
      mockPostError(new Error('boom'));
      await store.handleCreateSyllabus();

      expect(track).toHaveBeenCalledWith('Tutor Step Completed', {
        step: 3,
        durationMs: expect.any(Number),
        sourcesCount: 1
      });
      expect(track).toHaveBeenCalledWith('Tutor Step Failed', {
        step: 3,
        durationMs: expect.any(Number)
      });
    });

    it('tracks the feedback length, never its text', async () => {
      mockPost({ data: { syllabus: [{ source: 'agent', content: 'new' }] } });
      mockPostError(new Error('boom'));
      const store = useTutorStore();
      store.tutorSearch = search();
      store.syllabi = { source: 'agent', content: 'old' };

      await store.giveFeedback('shorter');
      await store.giveFeedback('shorter');

      expect(track).toHaveBeenCalledWith('Syllabus Feedback Sent', {
        feedbackLength: 7,
        isApplied: true
      });
      expect(track).toHaveBeenCalledWith('Syllabus Feedback Sent', {
        feedbackLength: 7,
        isApplied: false
      });
      expect(JSON.stringify(vi.mocked(track).mock.calls)).not.toContain('shorter');
    });

    it('tracks the download', async () => {
      mockPost({});
      const store = useTutorStore();
      store.syllabi = { source: 'agent', content: '# Course' };

      await store.handleDownloadSyllabus();

      expect(track).toHaveBeenCalledWith('Syllabus Downloaded', {});
    });
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import axios from 'axios';
import { MAX_COURSE_FILE_SIZE, useCourseStore } from '../course';
import { useGuestQuotaStore } from '../guestQuota';
import { useTutorStore } from '../tutor';
import { basePostAxios, getGuestQuota } from '@/utils/fetch';
import type { CourseReadResponse } from '@/types';

vi.mock('@/utils/fetch', () => ({
  basePostAxios: vi.fn(),
  getGuestQuota: vi.fn()
}));

const auth = vi.hoisted(() => ({ isGuest: false, askToSignUp: vi.fn() }));
vi.mock('@/stores/auth', () => ({ useAuthStore: () => auth }));

type PostResult = Awaited<ReturnType<typeof basePostAxios>>;
const mockPost = (value: unknown) =>
  vi.mocked(basePostAxios).mockResolvedValueOnce(value as PostResult);
const mockPostError = (error: unknown) => vi.mocked(basePostAxios).mockRejectedValueOnce(error);
const apiError = (status: number, code?: string, extra: Record<string, unknown> = {}) => ({
  response: { status, data: { detail: code ? { message: 'm', code, ...extra } : 'm' } }
});

const PDF = 'application/pdf';
const file = (name = 'syllabus.pdf', type = PDF, size = 10) =>
  new File([new Uint8Array(size)], name, { type });

const READ: CourseReadResponse = {
  text: 'Ecology',
  is_text_truncated: false,
  is_partial: false,
  reading: {
    title: 'Ecology',
    material_type: 'syllabus',
    courses_found: [],
    objectives: [],
    topics: [],
    sessions: []
  }
};

describe('course store', () => {
  beforeEach(() => {
    auth.isGuest = false;
    auth.askToSignUp.mockReset();
    vi.mocked(basePostAxios).mockReset();
    vi.mocked(getGuestQuota).mockReset();
    setActivePinia(createPinia());
  });

  describe('the course file', () => {
    it('keeps one pdf, docx or txt file of 5 MB at most', () => {
      const store = useCourseStore();
      store.setFile(file());
      expect(store.file?.name).toBe('syllabus.pdf');
      expect(store.fileError).toBeNull();

      store.setFile(file('big.pdf', PDF, MAX_COURSE_FILE_SIZE + 1));
      expect(store.fileError).toBe('BIG_FILE');
      store.setFile(file('photo.png', 'image/png'));
      expect(store.fileError).toBe('BAD_EXTENSION');
      // a refused file leaves the one picked before
      expect(store.file?.name).toBe('syllabus.pdf');

      store.setFile(file('course.txt', 'text/plain'));
      expect(store.file?.name).toBe('course.txt');
      expect(store.fileError).toBeNull();
    });

    it('removes the file and its error', () => {
      const store = useCourseStore();
      store.setFile(file('photo.png', 'image/png'));
      store.setFile(file());
      store.removeFile();
      expect(store.file).toBeNull();
      expect(store.fileError).toBeNull();
      expect(store.hasStarted).toBe(false);
    });

    it('answers in the language the teacher picks', () => {
      const store = useCourseStore();
      store.selectLanguage('en');
      expect(store.language).toBe('en');
    });
  });

  describe('readCourse', () => {
    it('sends the file and the language, then shows the review', async () => {
      const store = useCourseStore();
      store.setFile(file());
      store.selectLanguage('en');
      mockPost({ data: READ });

      await store.readCourse();

      const [url, body, config] = vi.mocked(basePostAxios).mock.calls[0];
      expect(url).toBe('/tutor/course/read');
      expect((body as FormData).get('file')).toBe(store.file);
      expect((body as FormData).get('lang')).toBe('en');
      expect(config?.headers).toEqual({ 'content-type': 'multipart/form-data' });
      expect(store.reading).toEqual(READ);
      expect(store.step).toBe(2);
      expect(store.phase).toBe('idle');
      expect(store.readError).toBeNull();
    });

    it('does not read the same file in the same language twice', async () => {
      const store = useCourseStore();
      store.setFile(file());
      mockPost({ data: READ });
      await store.readCourse();
      store.setStep(1);

      await store.readCourse();
      expect(basePostAxios).toHaveBeenCalledTimes(1);
      expect(store.step).toBe(2);

      // another language is another reading
      store.setStep(1);
      store.selectLanguage(store.language === 'fr' ? 'en' : 'fr');
      mockPost({ data: READ });
      await store.readCourse();
      expect(basePostAxios).toHaveBeenCalledTimes(2);
    });

    it('does nothing without a file', async () => {
      await useCourseStore().readCourse();
      expect(basePostAxios).not.toHaveBeenCalled();
    });

    it('moves from sending to reading once the file is sent', async () => {
      const store = useCourseStore();
      store.setFile(file());
      vi.mocked(basePostAxios).mockImplementationOnce(async (_url, _body, config) => {
        config?.onUploadProgress?.({ loaded: 5, total: 10 } as never);
        expect(store.phase).toBe('sending');
        expect(store.uploadProgress).toBe(50);
        config?.onUploadProgress?.({ loaded: 10, total: 10 } as never);
        expect(store.phase).toBe('reading');
        expect(store.readingStartedAt).not.toBeNull();
        return { data: READ } as PostResult;
      });

      await store.readCourse();

      expect(store.phase).toBe('idle');
    });

    it.each([
      ['a file without text (scanned pdf)', apiError(422, 'EMPTY_DOCUMENT_TEXT'), 'emptyText'],
      ['a reading that failed', apiError(502, 'UNUSABLE_READING'), 'error'],
      ['an unexpected error', apiError(500), 'error'],
      ['the api unreachable', { message: 'Network Error' }, 'unavailable'],
      ['the api down', apiError(503), 'unavailable']
    ])('tells %s', async (_case, error, expected) => {
      const store = useCourseStore();
      store.setFile(file());
      mockPostError(error);
      vi.spyOn(console, 'error').mockImplementation(() => {});

      await store.readCourse();

      expect(store.readError).toBe(expected);
      expect(store.step).toBe(1);
      expect(store.phase).toBe('idle');
      expect(store.reading).toBeNull();
    });

    it('can be cancelled: back to the upload, the file kept', async () => {
      const store = useCourseStore();
      store.setFile(file());
      let reject: (reason: unknown) => void = () => {};
      vi.mocked(basePostAxios).mockImplementationOnce(
        () => new Promise((_resolve, r) => (reject = r)) as ReturnType<typeof basePostAxios>
      );

      const pending = store.readCourse();
      expect(store.isReading).toBe(true);
      store.cancelReading();
      reject(new axios.CanceledError());
      await pending;

      expect(store.isReading).toBe(false);
      expect(store.readError).toBeNull();
      expect(store.reading).toBeNull();
      expect(store.file?.name).toBe('syllabus.pdf');
    });
  });

  describe('guests', () => {
    const quota = (syllabus: number) => ({
      limited: true,
      chat: { limit: 5, remaining: 5, resets_in: 0 },
      syllabus: { limit: 1, remaining: syllabus, resets_in: 0 }
    });

    it('counts a reading as one of their syllabi', async () => {
      auth.isGuest = true;
      const store = useCourseStore();
      store.setFile(file());
      mockPost({ data: READ });
      vi.mocked(getGuestQuota).mockResolvedValueOnce(quota(0) as never);

      await store.readCourse();

      expect(getGuestQuota).toHaveBeenCalled();
    });

    it('asks to sign up instead of reading when no syllabus is left', async () => {
      auth.isGuest = true;
      useGuestQuotaStore().quota = quota(0);
      const store = useCourseStore();
      store.setFile(file());

      await store.readCourse();

      expect(basePostAxios).not.toHaveBeenCalled();
      expect(auth.askToSignUp).toHaveBeenCalledWith('syllabusLimit');
    });

    it('asks to sign up when the api refuses past the quota', async () => {
      auth.isGuest = true;
      const store = useCourseStore();
      store.setFile(file());
      mockPostError(apiError(403, 'GUEST_QUOTA_EXCEEDED', { feature: 'syllabus' }));

      await store.readCourse();

      expect(auth.askToSignUp).toHaveBeenCalledWith('syllabusLimit');
      expect(store.readError).toBeNull();
      expect(store.step).toBe(1);
    });
  });

  describe('changing path', () => {
    it('counts a picked file as work to lose, and drops it on reset', () => {
      const store = useCourseStore();
      const tutor = useTutorStore();
      expect(tutor.hasStartedCourse).toBe(false);

      store.setFile(file());
      expect(tutor.hasStartedCourse).toBe(true);

      tutor.resetPath();
      expect(store.file).toBeNull();
      expect(store.step).toBe(1);
      expect(tutor.hasStartedCourse).toBe(false);
    });

    it('only opens the review once the course was read', () => {
      const store = useCourseStore();
      store.setStep(2);
      expect(store.step).toBe(1);
    });
  });
});

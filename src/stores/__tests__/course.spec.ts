import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import axios from 'axios';
import { useCourseStore } from '../course';
import { MAX_COURSE_FILE_SIZE } from '@/utils/courseFiles';
import { useGuestQuotaStore } from '../guestQuota';
import { useTutorStore } from '../tutor';
import { useConnectionsStore } from '../connections';
import { basePostAxios, getGuestQuota } from '@/utils/fetch';
import { track } from '@/utils/analytics';
import type { CourseReadResponse } from '@/types';

vi.mock('@/utils/fetch', () => ({
  basePostAxios: vi.fn(),
  getGuestQuota: vi.fn()
}));

const auth = vi.hoisted(() => ({ isGuest: false, askToSignUp: vi.fn() }));
vi.mock('@/stores/auth', () => ({ useAuthStore: () => auth }));
vi.mock('@/utils/analytics', () => ({ track: vi.fn() }));

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

    it('counts what was read: the kind of document, its topics and objectives', async () => {
      vi.mocked(track).mockClear();
      const store = useCourseStore();
      store.setFile(file());
      mockPost({
        data: {
          ...READ,
          reading: {
            ...READ.reading,
            material_type: 'course_plan',
            objectives: [{ text: 'Define soils.', scope: 'course' }],
            topics: [
              { title: 'Soils', subtopics: [], source: null },
              { title: 'Water', subtopics: [], source: null }
            ]
          }
        }
      });

      await store.readCourse();

      expect(track).toHaveBeenCalledWith('Course Read', {
        materialType: 'course_plan',
        topicsCount: 2,
        objectivesCount: 1
      });
    });

    it('starts the connections over for another course, not for the same one', async () => {
      const store = useCourseStore();
      const connections = useConnectionsStore();
      store.setFile(file());
      mockPost({ data: READ });
      await store.readCourse();
      connections.status = 'ready';
      store.setStep(1);

      // the same reading again: the teacher's work stays
      await store.readCourse();
      expect(connections.status).toBe('ready');

      // another file: what was found for the former course does not apply
      store.setFile(file('other.pdf'));
      mockPost({ data: READ });
      await store.readCourse();
      expect(connections.status).toBe('idle');
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
      ['the api down', apiError(503), 'unavailable'],
      ['the api busy', apiError(429), 'unavailable']
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

  describe('the review', () => {
    const TEXT = 'Macroeconomics\nLicence 1\nObjectives:\n- Define GDP.\nTheme 1: GDP';
    const FULL: CourseReadResponse = {
      text: TEXT,
      is_text_truncated: false,
      is_partial: false,
      reading: {
        title: 'Macroeconomics',
        level: 'Licence 1',
        discipline_suggested: 'Economics',
        description: 'A course on growth.',
        material_type: 'syllabus',
        courses_found: [],
        objectives: [{ text: 'Define GDP.', scope: 'course' }],
        topics: [{ title: 'GDP', subtopics: [], source: 'Theme 1: GDP' }],
        sessions: [{ label: 'Week 1', title: 'GDP' }]
      }
    };

    const readFull = async (response: CourseReadResponse = FULL) => {
      const store = useCourseStore();
      store.setFile(file());
      mockPost({ data: response });
      await store.readCourse();
      return store;
    };

    it('fills the review and the course information from the reading', async () => {
      const store = await readFull();
      expect(store.courseObjectives).toEqual([
        expect.objectContaining({ value: 'Define GDP.', group: 'objective' })
      ]);
      expect(store.courseTopics.map(({ value }) => value)).toEqual(['GDP']);
      expect(store.coursePlan).toEqual(['Week 1 – GDP']);
      expect(store.courseDescription?.verification).toBe('unverified');
      expect(store.teachingContext).toMatchObject({
        title: 'Macroeconomics',
        level: 'l1',
        discipline: 'Economics'
      });
      expect(store.prefilled).toEqual(['title', 'level']);
      expect(store.aiSuggested).toEqual(['discipline']);
      expect(store.contextEvidence).toEqual({ title: 'Macroeconomics', level: 'Licence 1' });
      expect(store.canConfirm).toBe(true);
    });

    it("keeps the teacher's own course information when another reading comes", async () => {
      const store = await readFull();
      store.updateContext('title', 'My macro course');
      expect(store.prefilled).toEqual(['level']);
      expect(store.contextEvidence).toEqual({ level: 'Licence 1' });

      store.setFile(file('other.pdf'));
      mockPost({ data: { ...FULL, reading: { ...FULL.reading, discipline_suggested: null } } });
      await store.readCourse();

      expect(store.teachingContext.title).toBe('My macro course');
      // the suggestion of the previous reading is gone
      expect(store.teachingContext.discipline).toBe('');
    });

    it('reads again, alone, the course the teacher picks in a document holding several', async () => {
      const store = await readFull({
        ...FULL,
        reading: { ...FULL.reading, courses_found: ['UE 1 Economics', 'UE 2 Law'] }
      });
      expect(store.coursesFound).toEqual(['UE 1 Economics', 'UE 2 Law']);

      mockPost({ data: FULL });
      await store.chooseCourse('UE 2 Law');

      const body = vi.mocked(basePostAxios).mock.calls[1][1] as FormData;
      expect(body.get('focus')).toBe('UE 2 Law');
      expect(store.focus).toBe('UE 2 Law');
      expect(store.coursesFound).toEqual([]);
      expect(store.step).toBe(2);

      // a new file: no course chosen in it
      store.setFile(file('other.pdf'));
      expect(store.focus).toBeNull();
    });

    it("applies the teacher's corrections", async () => {
      const store = await readFull();

      store.setDescription('About growth.');
      expect(store.courseDescription).toMatchObject({ value: 'About growth.', origin: 'edited' });
      store.restoreDescription();
      expect(store.courseDescription?.value).toBe('A course on growth.');
      store.setDescription('  ');
      expect(store.courseDescription).toBeNull();
      store.setDescription('Mine.');
      expect(store.courseDescription).toEqual({ value: 'Mine.', origin: 'added' });

      store.setObjective(0, 'Define GDP and its limits.');
      expect(store.courseObjectives[0].origin).toBe('edited');
      store.setObjective(0, '  ');
      expect(store.courseObjectives[0].value).toBe('Define GDP and its limits.');
      store.restoreObjective(0);
      expect(store.courseObjectives[0].value).toBe('Define GDP.');
      store.addObjective(' Work in a team. ', 'competency');
      store.addObjective('  ');
      expect(store.courseObjectives[1]).toEqual({
        value: 'Work in a team.',
        origin: 'added',
        group: 'competency'
      });
      store.setGroup(0, 'programme');
      expect(store.courseToUpdate.objectives).toEqual([]);
      expect(store.courseToUpdate.competencies).toEqual(['Work in a team.']);
      store.removeObjective(1);
      expect(store.courseObjectives).toHaveLength(1);

      store.saveTopics([{ from: 0, title: 'GDP', subtopics: ['Measure'] }]);
      expect(store.courseTopics[0].subtopics).toEqual(['Measure']);
      store.setCoursePlan(['Week 1', ' ', 'Week 2 ']);
      expect(store.coursePlan).toEqual(['Week 1', 'Week 2']);
      expect(store.courseParts).toEqual(['GDP', 'Measure', 'Week 1', 'Week 2']);
      expect(store.confirmedCourse.topics).toEqual([{ title: 'GDP', subtopics: ['Measure'] }]);
    });

    it('edits the summary only with words, and restores it', async () => {
      const store = await readFull({
        ...FULL,
        reading: { ...FULL.reading, summary: 'WeLearn summary.' }
      });
      store.setSummary(' ');
      expect(store.courseSummary?.value).toBe('WeLearn summary.');
      store.setSummary('Mine.');
      expect(store.courseSummary?.origin).toBe('edited');
      store.restoreSummary();
      expect(store.courseSummary?.value).toBe('WeLearn summary.');
    });

    it('reads the teaching context the syllabus states, without overwriting anything', async () => {
      const text = 'Titre du cours : Macro\nLicence 1\n12 séances de 3 h, en présentiel\nTD';
      const store = useCourseStore();
      store.setFile(file());
      store.updateContext('sessionMode', 'HYBRIDE');
      mockPost({ data: { ...FULL, text, reading: { ...FULL.reading, title: 'Macro' } } });
      await store.readCourse();

      expect(store.teachingContext).toMatchObject({
        title: 'Macro',
        level: 'l1',
        sessions: 12,
        sessionLength: 3,
        sessionType: 'tutorial',
        // the teacher's own choice stays
        sessionMode: 'HYBRIDE'
      });
      expect(store.prefilled).toEqual(
        expect.arrayContaining(['title', 'level', 'sessions', 'sessionLength', 'sessionType'])
      );
      expect(store.prefilled).not.toContain('sessionMode');
      // WeLearn's reading of the title comes first, its line kept as evidence
      expect(store.contextEvidence.title).toBe('Macro');
      expect(store.contextEvidence.sessions).toBe('12 séances de 3 h, en présentiel');
    });

    it('moves on only with something to work on', async () => {
      const store = useCourseStore();
      store.confirmReview();
      expect(store.step).toBe(1);

      await readFull();
      store.confirmReview();
      expect(store.step).toBe(3);
    });

    it('drops the review on reset', async () => {
      const store = await readFull();
      store.$reset();
      expect(store.courseObjectives).toEqual([]);
      expect(store.courseTopics).toEqual([]);
      expect(store.teachingContext.title).toBe('');
      expect(store.prefilled).toEqual([]);
      expect(store.focus).toBeNull();
    });
  });

  describe('the whole text', () => {
    it('is the text the API read, unless it was cut or is too short for a syllabus', () => {
      const store = useCourseStore();
      expect(store.wholeText).toBeNull();
      const long = 'A line of the syllabus with enough letters in it. '.repeat(10);
      store.reading = { ...READ, text: long };
      expect(store.wholeText).toBe(long);
      store.reading = { ...READ, text: long, is_text_truncated: true };
      expect(store.wholeText).toBeNull();
      store.reading = { ...READ, text: 'Ecology' };
      expect(store.wholeText).toBeNull();
    });
  });
});

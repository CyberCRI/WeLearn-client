import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import axios from 'axios';
import { useTutorStore } from '../tutor';
import { basePostAxios } from '@/utils/fetch';
import { convertMarkdownToDocx, downloadDocx } from '@/utils/md-to-docx';
import type { Document, TutorSearch } from '@/types';

vi.mock('@/utils/fetch', () => ({
  basePostAxios: vi.fn()
}));

vi.mock('@/utils/md-to-docx', () => ({
  convertMarkdownToDocx: vi.fn(),
  downloadDocx: vi.fn()
}));

type PostResult = Awaited<ReturnType<typeof basePostAxios>>;
const mockPost = (value: unknown) =>
  vi.mocked(basePostAxios).mockResolvedValueOnce(value as PostResult);
const mockPostError = (error: unknown) => vi.mocked(basePostAxios).mockRejectedValueOnce(error);

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

  describe('new flow: path, syllabus and teaching context', () => {
    const syllabusText = (text: string) => new File([text], 'syllabus.txt', { type: 'text/plain' });

    it('starts on the chosen path, at its first screen', () => {
      const store = useTutorStore();
      store.setStep(3);
      store.choosePath('existing');
      expect(store.path).toBe('existing');
      expect(store.step).toBe(1);
    });

    it('refuses a syllabus that is too big or of the wrong type', async () => {
      const store = useTutorStore();
      await store.setSyllabusFile(file('big.pdf', PDF, 6 * 1024 * 1024));
      expect(store.fileError).toEqual({ state: true, reason: 'BIG_FILE' });
      await store.setSyllabusFile(file('pic.png', 'image/png'));
      expect(store.fileError).toEqual({ state: true, reason: 'BAD_EXTENSION' });
      expect(store.syllabusFile).toBeNull();
    });

    it('keeps a pdf syllabus without reading anything from it', async () => {
      const store = useTutorStore();
      await store.setSyllabusFile(file('syllabus.pdf'));
      expect(store.syllabusFile?.name).toBe('syllabus.pdf');
      expect(store.prefilled).toEqual([]);
      expect(store.hasStartedCourse).toBe(true);
    });

    it('fills in what a text syllabus states, without overwriting the teacher', async () => {
      const store = useTutorStore();
      store.updateContext('sessionLength', 2);
      await store.setSyllabusFile(syllabusText('12 sessions of 3 hours'));
      expect(store.teachingContext.sessions).toBe(12);
      expect(store.teachingContext.sessionLength).toBe(2);
      expect(store.prefilled).toEqual(['sessions']);
    });

    it('treats a changed value as the teacher’s own', async () => {
      const store = useTutorStore();
      await store.setSyllabusFile(syllabusText('12 sessions of 3 hours'));
      store.updateContext('sessions', 10);
      expect(store.prefilled).toEqual(['sessionLength']);
    });

    it('removes what was read when the syllabus is removed, keeps what the teacher gave', async () => {
      const store = useTutorStore();
      store.updateContext('title', 'Macroeconomics');
      await store.setSyllabusFile(syllabusText('12 sessions of 3 hours'));
      store.removeSyllabusFile();
      expect(store.syllabusFile).toBeNull();
      expect(store.teachingContext.sessions).toBeNull();
      expect(store.teachingContext.sessionLength).toBeNull();
      expect(store.teachingContext.title).toBe('Macroeconomics');
      expect(store.prefilled).toEqual([]);
    });

    it('reads nothing when a text syllabus cannot be read', async () => {
      const store = useTutorStore();
      vi.spyOn(FileReader.prototype, 'readAsText').mockImplementation(function (this: FileReader) {
        this.onerror?.(new ProgressEvent('error') as ProgressEvent<FileReader>);
      });
      await store.setSyllabusFile(syllabusText('12 sessions of 3 hours'));
      expect(store.syllabusFile?.name).toBe('syllabus.txt');
      expect(store.prefilled).toEqual([]);
    });

    describe('readSyllabus', () => {
      const reading = (objectives: string[], description: string | null = 'About GDP.') => ({
        data: {
          detected_document_type: 'syllabus',
          confidence: 0.99,
          summary: null,
          description,
          objectives,
          reasoning: null
        }
      });

      // the full reading's answer: one JSON object in the text, as the endpoint returns it
      const fullReading = (fields: Record<string, unknown>) => ({
        data: { answer: JSON.stringify({ material_type: 'syllabus', ...fields }) }
      });

      it('does nothing without a syllabus', async () => {
        const store = useTutorStore();
        await store.readSyllabus();
        expect(basePostAxios).not.toHaveBeenCalled();
      });

      it('reads the syllabus in syllabus mode, in the course language', async () => {
        const store = useTutorStore();
        store.selectSyllabusLanguage('en');
        await store.setSyllabusFile(file('syllabus.pdf'));
        mockPost(reading(['Define GDP.']));
        await store.readSyllabus();
        expect(vi.mocked(basePostAxios).mock.calls[0][0]).toBe(
          '/tutor/mas_files/content?lang=en&mode=mode_2'
        );
        // a pdf cannot be compared here: what WeLearn read is kept, marked as not compared
        expect(store.documentText).toBeNull();
        expect(store.courseDescription).toEqual({
          value: 'About GDP.',
          origin: 'extracted',
          original: 'About GDP.',
          verification: 'unchecked'
        });
        expect(store.courseObjectives.map((objective) => objective.value)).toEqual(['Define GDP.']);
        expect(store.detectedType).toBe('syllabus');
        expect(store.isLoading).toBe(false);
        expect(store.step).toBe(2);
      });

      it('reads a text syllabus fully: overview, topics, sessions, checked and sorted', async () => {
        const store = useTutorStore();
        await store.setSyllabusFile(
          syllabusText(
            'Course title: Macro\nFirst-year Bachelor\nAbout GDP.\nObjectives:\n1. Define GDP.\n2. Explain inflation.\nCompetencies:\n- Work in a team\nDegree objectives:\n- Think like an economist'
          )
        );
        mockPost(
          fullReading({
            title: 'Macro',
            discipline: 'Economics',
            level: 'First-year Bachelor',
            description: 'About GDP.',
            topics: ['GDP', 'Inflation'],
            sessions: [
              { label: 'Session 1', title: 'GDP' },
              { label: null, title: 'Review' }
            ],
            objectives: [
              { text: 'Define GDP.', scope: 'course' },
              { text: 'Explain inflation.', scope: 'course' },
              { text: 'Model climate policy.', scope: 'course' },
              { text: 'Work in a team.', scope: 'unspecified' },
              { text: 'Think like an economist.', scope: 'programme' }
            ]
          })
        );
        await store.readSyllabus();
        expect(vi.mocked(basePostAxios).mock.calls[0][0]).toBe('/qna/chat/answer');
        expect(basePostAxios).toHaveBeenCalledTimes(1);
        expect(
          store.courseObjectives.map((field) => [field.value, field.verification, field.group])
        ).toEqual([
          ['Define GDP.', 'verified', 'objective'],
          ['Explain inflation.', 'verified', 'objective'],
          // not in the syllabus: kept and flagged
          ['Model climate policy.', 'unverified', 'objective'],
          // the heading tells a competency apart; the reading tells the degree-level one
          ['Work in a team.', 'verified', 'competency'],
          ['Think like an economist.', 'verified', 'programme']
        ]);
        expect(store.courseDescription?.verification).toBe('verified');
        expect(store.courseTopics.map((topic) => [topic.value, topic.verification])).toEqual([
          ['GDP', 'verified'],
          ['Inflation', 'verified']
        ]);
        expect(store.coursePlan).toEqual(['Session 1 – GDP', 'Review']);
        expect(store.detectedType).toBe('syllabus');
        // found word for word: read from the syllabus; not found: read by the ai, to check
        expect(store.teachingContext).toMatchObject({
          title: 'Macro',
          discipline: 'Economics',
          level: 'l1'
        });
        expect(store.prefilled).toEqual(expect.arrayContaining(['title', 'level']));
        expect(store.aiFilled).toEqual(['discipline']);
        expect(store.readingPhase).toBe('idle');
        expect(store.step).toBe(2);
      });

      it('shows every topic, session and objective it is given, and only those', async () => {
        const store = useTutorStore();
        const objectives = Array.from({ length: 23 }, (_, i) => `Objective ${i + 1}.`);
        await store.setSyllabusFile(
          syllabusText(
            'Course content\n- Inflation\n- Public debt\nWeek 1: GDP\nWeek 2:\n' +
              objectives.join('\n')
          )
        );
        mockPost(
          fullReading({
            topics: ['Inflation', 'Public debt'],
            sessions: [
              { label: 'Week 1', title: 'GDP' },
              { label: 'Week 2', title: null }
            ],
            objectives: objectives.map((text) => ({ text, scope: 'course' }))
          })
        );
        await store.readSyllabus();
        expect(store.courseObjectives).toHaveLength(23);
        expect(store.courseTopics.map((topic) => [topic.value, topic.verification])).toEqual([
          ['Inflation', 'verified'],
          ['Public debt', 'verified']
        ]);
        // a week with no title is still in the plan
        expect(store.coursePlan).toEqual(['Week 1 – GDP', 'Week 2']);
        expect(store.isReadingPartial).toBe(false);

        store.addTopic(' inflation ');
        store.addTopic('  ');
        store.addTopic('Growth');
        expect(store.courseTopics.map((topic) => topic.value)).toEqual([
          'Inflation',
          'Public debt',
          'Growth'
        ]);
        store.removeTopic(0);
        expect(store.courseTopics.map((topic) => topic.value)).toEqual(['Public debt', 'Growth']);

        store.removeSyllabusFile();
        expect(store.courseTopics).toEqual([]);
        expect(store.coursePlan).toEqual([]);
      });

      it('does not overwrite what the teacher or the syllabus already gave', async () => {
        const store = useTutorStore();
        await store.setSyllabusFile(syllabusText('Course title: Macro\nDefine GDP.'));
        store.updateContext('discipline', 'Econ');
        mockPost(fullReading({ title: 'Other title', discipline: 'Economics', objectives: [] }));
        await store.readSyllabus();
        expect(store.teachingContext.title).toBe('Macro');
        expect(store.teachingContext.discipline).toBe('Econ');
        expect(store.aiFilled).toEqual([]);
      });

      it('asks for the topics the reading could not give, keeping everything it gave', async () => {
        const store = useTutorStore();
        await store.setSyllabusFile(syllabusText('Objectives:\n1. Define GDP.\nChapter 1: GDP'));
        // the answer stopped before its topics
        mockPost({
          data: {
            answer:
              '{"material_type": "syllabus", "objectives": [{"text": "Define GDP.", "scope": "course"}], "topics": [{"title": "GD'
          }
        });
        mockPost({
          data: {
            answer:
              '{"summary": "About GDP.", "topics": [{"title": "GDP", "subtopics": [], "source": "Chapter 1: GDP"}]}'
          }
        });
        await store.readSyllabus();
        expect(store.courseObjectives.map((field) => field.value)).toEqual(['Define GDP.']);
        expect(store.courseTopics.map((topic) => topic.value)).toEqual(['GDP']);
        expect(store.courseSummary?.value).toBe('About GDP.');
        expect(store.step).toBe(2);
      });

      it('fills an unstated discipline with the AI suggestion, marked as such', async () => {
        const store = useTutorStore();
        await store.setSyllabusFile(syllabusText('Introduction à la gestion\nDefine GDP.'));
        mockPost(
          fullReading({
            discipline: null,
            discipline_suggested: 'Gestion',
            topics: [{ title: 'Stratégie', subtopics: [], source: 'Stratégie' }],
            objectives: []
          })
        );
        await store.readSyllabus();
        expect(store.teachingContext.discipline).toBe('Gestion');
        expect(store.aiSuggested).toEqual(['discipline']);
        expect(store.prefilled).not.toContain('discipline');
        // the teacher's own value replaces it, and the mark goes
        store.updateContext('discipline', 'Sciences de gestion');
        expect(store.aiSuggested).toEqual([]);
      });

      it('falls back on the basic reading when the full reading cannot be used twice', async () => {
        const store = useTutorStore();
        await store.setSyllabusFile(syllabusText('About GDP.\nDefine GDP.'));
        mockPost({ data: { answer: 'not json' } });
        mockPost({ data: { answer: 'still not json' } });
        mockPost(reading(['Define GDP.']));
        await store.readSyllabus();
        expect(vi.mocked(basePostAxios).mock.calls.map((call) => call[0])).toEqual([
          '/qna/chat/answer',
          '/qna/chat/answer',
          expect.stringContaining('/tutor/mas_files/content')
        ]);
        expect(store.courseObjectives[0].verification).toBe('verified');
        expect(store.step).toBe(2);
      });

      it('clears what the reading filled in when another syllabus is chosen', async () => {
        const store = useTutorStore();
        await store.setSyllabusFile(syllabusText('Define GDP.'));
        mockPost(fullReading({ discipline: 'Economics', objectives: [] }));
        await store.readSyllabus();
        expect(store.aiFilled).toEqual(['discipline']);
        await store.setSyllabusFile(file('other.pdf'));
        expect(store.teachingContext.discipline).toBe('');
        expect(store.aiFilled).toEqual([]);
      });

      it('keeps a word syllabus it cannot read, without comparing it', async () => {
        const store = useTutorStore();
        const docx = new File(['not really a zip'], 'syllabus.docx', {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
        await store.setSyllabusFile(docx);
        // a damaged word file is kept, its text simply not compared
        expect(store.syllabusFile?.name).toBe('syllabus.docx');
        expect(store.documentText).toBeNull();
      });

      it('does not read the same file again, so corrections are kept', async () => {
        const store = useTutorStore();
        await store.setSyllabusFile(file('syllabus.pdf'));
        mockPost(reading(['Define GDP.']));
        await store.readSyllabus();
        store.setObjective(0, 'Define GDP and its limits.');
        store.setStep(1);
        await store.readSyllabus();
        expect(basePostAxios).toHaveBeenCalledTimes(1);
        expect(store.courseObjectives[0].value).toBe('Define GDP and its limits.');
        expect(store.step).toBe(2);
      });

      it('reads again when the language changes', async () => {
        const store = useTutorStore();
        await store.setSyllabusFile(file('syllabus.pdf'));
        mockPost(reading(['Define GDP.']));
        await store.readSyllabus();
        store.selectSyllabusLanguage(store.syllabusLanguage === 'fr' ? 'en' : 'fr');
        mockPost(reading(['Définir le PIB.']));
        await store.readSyllabus();
        expect(basePostAxios).toHaveBeenCalledTimes(2);
      });

      it('says when WeLearn could not be reached, and when it could not read the syllabus', async () => {
        const store = useTutorStore();
        await store.setSyllabusFile(file('syllabus.pdf'));
        mockPost({ data: null });
        await store.readSyllabus();
        expect(store.readError).toBe('error');
        expect(store.readingPhase).toBe('idle');
        expect(store.step).toBe(1);

        mockPostError(new Error('network down'));
        await store.readSyllabus();
        expect(store.readError).toBe('unavailable');

        mockPostError({ response: { status: 500 } });
        await store.readSyllabus();
        expect(store.readError).toBe('error');
      });

      it('stays quiet when the reading is cancelled, and can be cancelled from the page', async () => {
        const store = useTutorStore();
        await store.setSyllabusFile(file('syllabus.pdf'));
        mockPostError(new axios.Cancel('cancelled'));
        await store.readSyllabus();
        expect(store.readError).toBeNull();

        store.readingPhase = 'reading';
        store.cancelReading();
        expect(store.readingPhase).toBe('idle');
        expect(store.isLoading).toBe(false);
      });

      it('shows the real progress of sending, then the reading', async () => {
        const store = useTutorStore();
        await store.setSyllabusFile(file('syllabus.pdf'));
        vi.mocked(basePostAxios).mockImplementationOnce(async (_url, _body, config) => {
          config?.onUploadProgress?.({ loaded: 50, total: 100 } as never);
          expect(store.uploadProgress).toBe(50);
          expect(store.readingPhase).toBe('sending');
          config?.onUploadProgress?.({ loaded: 100, total: 100 } as never);
          expect(store.readingPhase).toBe('reading');
          expect(store.readingStartedAt).not.toBeNull();
          return reading(['Define GDP.']) as never;
        });
        await store.readSyllabus();
        expect(store.step).toBe(2);
      });

      it('forgets the reading when another syllabus is chosen', async () => {
        const store = useTutorStore();
        await store.setSyllabusFile(file('syllabus.pdf'));
        mockPost(reading(['Define GDP.']));
        await store.readSyllabus();
        await store.setSyllabusFile(file('other.pdf'));
        expect(store.courseObjectives).toEqual([]);
        expect(store.courseDescription).toBeNull();
      });
    });

    it('applies corrections to what was read', () => {
      const store = useTutorStore();
      store.courseObjectives = [
        { value: 'Define GDP.', origin: 'extracted', original: 'Define GDP.', group: 'objective' }
      ];
      store.setObjective(0, '  ');
      expect(store.courseObjectives[0].value).toBe('Define GDP.');
      store.setObjective(0, 'Define GDP and its limits.');
      store.restoreObjective(0);
      expect(store.courseObjectives[0].origin).toBe('extracted');
      store.addObjective('  ');
      store.addObjective('Read a table.');
      expect(store.courseObjectives).toHaveLength(2);
      store.addObjective('Work in a team.', 'competency');
      store.setGroup(0, 'programme');
      // an item that is not there is ignored
      store.setGroup(9, 'programme');
      expect(store.courseOnlyObjectives.map((objective) => objective.value)).toEqual([
        'Read a table.'
      ]);
      expect(store.courseCompetencies.map((objective) => objective.value)).toEqual([
        'Work in a team.'
      ]);
      store.removeObjective(1);
      expect(store.courseOnlyObjectives).toEqual([]);

      store.courseDescription = {
        value: 'Read text.',
        origin: 'edited',
        original: 'Read.',
        verification: 'verified'
      };
      store.removeDescription();
      expect(store.courseDescription).toBeNull();
      expect(store.removedDescription?.value).toBe('Read.');
      store.bringBackDescription();
      expect(store.courseDescription?.origin).toBe('extracted');
      expect(store.removedDescription).toBeNull();

      store.setDescription('  ');
      expect(store.courseDescription).toBeNull();
      store.setDescription('About GDP.');
      store.setDescription('About GDP and growth.');
      store.restoreDescription();
      expect(store.courseDescription).toEqual({ value: 'About GDP and growth.', origin: 'added' });
      // an added description is not kept when removed: it was never read from the syllabus
      store.removeDescription();
      expect(store.removedDescription).toBeNull();
    });

    it('discards everything when the path is changed', async () => {
      const store = useTutorStore();
      store.choosePath('existing');
      await store.setSyllabusFile(syllabusText('12 sessions of 3 hours'));
      store.updateContext('level', 'l1');
      store.goNext();
      store.resetCourse();
      expect(store.path).toBeNull();
      expect(store.step).toBe(1);
      expect(store.syllabusFile).toBeNull();
      expect(store.teachingContext.level).toBe('');
      expect(store.hasStartedCourse).toBe(false);
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
  });

  describe('handleSummaryFiles', () => {
    it('does nothing without files', async () => {
      const store = useTutorStore();
      store.setStep(3);
      store.selectedSources = [doc('1')];

      await store.handleSummaryFiles();

      expect(store.step).toBe(1);
      expect(store.selectedSources).toEqual([]);
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

    it('keeps the summaries when the files did not change', async () => {
      mockPost({ status: 200, data: { extracts: [{ summary: 's1' }] } });
      const store = useTutorStore();
      store.addFiles([file('a.pdf')]);
      await store.handleSummaryFiles();
      store.updateSummary(0, 'edited');

      await store.handleSummaryFiles();

      expect(basePostAxios).toHaveBeenCalledOnce();
      expect(store.summaries).toEqual(['edited']);
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

    it('creates the syllabus from all found documents by default', async () => {
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
      expect(body).toEqual({ ...search([doc('found-1')]), extracts: [] });
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

    it('throws without a search or a syllabus', async () => {
      const store = useTutorStore();

      await expect(store.giveFeedback('more')).rejects.toThrow('Body is empty');
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
  });
});

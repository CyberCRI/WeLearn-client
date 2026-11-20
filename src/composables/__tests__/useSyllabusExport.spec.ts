import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useSyllabusExport } from '@/composables/useSyllabusExport';
import { saveSyllabusFile } from '@/utils/syllabusDownload';
import { PENDING_COURSE_EXPORT_KEY, type CourseExport } from '@/utils/courseExport';
import { getFromStorage } from '@/utils/storage';
import {
  proposal,
  seedAccepted,
  seedCourse,
  seedReading,
  WHOLE_TEXT
} from '@/components/__tests__/developmentFixtures';

vi.mock('@/utils/fetch', () => ({ basePostAxios: vi.fn() }));
vi.mock('@/utils/syllabusDownload', () => ({ saveSyllabusFile: vi.fn() }));
const auth = vi.hoisted(() => ({ isGuest: false, askToSignUp: vi.fn() }));
vi.mock('@/stores/auth', () => ({ useAuthStore: () => auth }));

const TOPIC = proposal({ kind: 'topic', original: 'GDP', suggested: 'Add the footprint.' });
const NOTED = proposal({
  kind: 'teaching',
  original: 'GDP',
  suggested: 'Compare indicators in class.',
  guidance: {
    learning: 'Compare indicators.',
    greencomp: { id: 'systems_thinking', how: 'Links economy and nature.' },
    teaching: null,
    check: null
  }
});
const lastExport = () => vi.mocked(saveSyllabusFile).mock.calls.at(-1);

describe('useSyllabusExport', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorage.clear();
    auth.isGuest = false;
    vi.mocked(saveSyllabusFile).mockResolvedValue(true);
    const course = seedCourse();
    course.teachingContext.title = 'Macro économie 101';
  });

  it('offers the complete syllabus when the whole text was read and nothing is lost', async () => {
    seedReading();
    seedAccepted(TOPIC);
    const syllabus = useSyllabusExport();
    expect(syllabus.isCompleteReady.value).toBe(true);
    expect(syllabus.completePlan.value?.toPlace).toEqual([]);

    await syllabus.exportWord('complete', false);
    expect(lastExport()?.[1]).toBe('Macro-économie-101-complet-mis-a-jour.docx');
    expect(syllabus.hasExportError.value).toBe(false);
  });

  it('falls back to the outline when the text was cut, or is not there', async () => {
    seedReading(WHOLE_TEXT, true);
    seedAccepted(TOPIC);
    const syllabus = useSyllabusExport();
    expect(syllabus.isCompleteReady.value).toBe(false);

    // asked for the complete one, the outline is what can be made
    await syllabus.exportWord('complete', false);
    expect(lastExport()?.[1]).toBe('Macro-économie-101-mis-a-jour.docx');
  });

  it('says when the word file could not be made', async () => {
    seedAccepted(TOPIC);
    vi.mocked(saveSyllabusFile).mockResolvedValueOnce(false);
    const syllabus = useSyllabusExport();
    await syllabus.exportWord('outline', false);
    expect(syllabus.hasExportError.value).toBe(true);
    expect(syllabus.isExporting.value).toBe(false);
  });

  it('adds the pedagogical appendix only when asked, and only when a change has notes', async () => {
    seedAccepted(TOPIC);
    const syllabus = useSyllabusExport();
    expect(syllabus.hasNotes.value).toBe(false);

    seedAccepted(TOPIC, NOTED);
    expect(syllabus.hasNotes.value).toBe(true);
    auth.isGuest = true;
    await syllabus.exportWord('outline', false);
    expect((getFromStorage(PENDING_COURSE_EXPORT_KEY) as CourseExport).appendix).toBeNull();
    await syllabus.exportWord('outline', true);
    const kept = getFromStorage(PENDING_COURSE_EXPORT_KEY) as CourseExport;
    expect(kept.appendix?.changes).toHaveLength(2);
    // only the competences cited, named in the syllabus's language
    expect(Object.keys(kept.appendix?.labels.greencompNames || {})).toEqual(['systems_thinking']);
  });

  it('asks a guest to sign up first, the export kept for right after', async () => {
    seedReading();
    seedAccepted(TOPIC);
    auth.isGuest = true;
    await useSyllabusExport().exportWord('complete', false);

    expect(saveSyllabusFile).not.toHaveBeenCalled();
    expect(auth.askToSignUp).toHaveBeenCalledWith('download');
    expect(getFromStorage(PENDING_COURSE_EXPORT_KEY)).toMatchObject({
      kind: 'complete',
      fileName: 'Macro-économie-101-complet-mis-a-jour.docx'
    });
  });

  it('copies the changes as text, and says when the copy failed', async () => {
    seedAccepted(TOPIC);
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const syllabus = useSyllabusExport();

    await syllabus.copyChanges();
    expect(writeText.mock.calls[0][0]).toContain('Add the footprint.');
    expect(syllabus.isCopied.value).toBe(true);

    writeText.mockRejectedValueOnce(new Error('denied'));
    await syllabus.copyChanges();
    expect(syllabus.hasCopyError.value).toBe(true);
  });
});

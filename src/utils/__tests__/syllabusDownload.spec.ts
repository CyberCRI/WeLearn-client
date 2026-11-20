import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  downloadPendingSyllabus,
  exportSyllabus,
  PENDING_SYLLABUS_KEY,
  type SyllabusExport
} from '@/utils/syllabusDownload';
import { planComplete, type CompleteLabels } from '@/utils/completeSyllabus';
import type { AppendixLabels } from '@/utils/pedagogicalAppendix';
import { convertMarkdownToDocx, downloadDocx } from '@/utils/md-to-docx';
import { basePostAxios } from '@/utils/fetch';
import { track } from '@/utils/analytics';
import { getFromStorage } from '@/utils/storage';
import type { CourseToUpdate } from '@/types';
import { approvedChange } from '@/__tests__/coursePathFixtures';

vi.mock('@/utils/md-to-docx', () => ({ convertMarkdownToDocx: vi.fn(), downloadDocx: vi.fn() }));
vi.mock('@/utils/fetch', () => ({ basePostAxios: vi.fn() }));
vi.mock('@/utils/analytics', () => ({ track: vi.fn() }));
const auth = vi.hoisted(() => ({ isGuest: false, askToSignUp: vi.fn() }));
vi.mock('@/stores/auth', () => ({ useAuthStore: () => auth }));

const COURSE: CourseToUpdate = {
  title: 'Gestion',
  discipline: null,
  level: null,
  overview: null,
  topics: [{ title: 'Stratégie', subtopics: [], source: 'CM2 « Stratégie »' }],
  objectives: [],
  competencies: [],
  sessions: []
};
const CHANGE = approvedChange(1, {
  placement: 'Stratégie',
  guidance: { learning: 'Comparer.', greencomp: null, teaching: null, check: null }
});
const LABELS = {
  title: 'Syllabus',
  note: 'Note.',
  change: 'Modification',
  sources: 'Sources',
  toPlace: 'À placer',
  toPlaceNote: 'À placer.',
  kinds: { objective: 'O', topic: 'T', teaching: 'E', assessment: 'A' }
} satisfies CompleteLabels;
const APPENDIX = {
  ...LABELS,
  title: 'Annexe',
  learning: 'Apprentissage',
  greencomp: 'GreenComp',
  teaching: 'Idée',
  check: 'Vérifier',
  greencompNames: {}
} satisfies AppendixLabels;

const MARKDOWN: SyllabusExport = {
  kind: 'markdown',
  fileName: 'syllabus.docx',
  markdown: '# Course',
  appendix: null
};
const COMPLETE: SyllabusExport = {
  kind: 'complete',
  fileName: 'Gestion-complet.docx',
  plan: planComplete(['CONTENU', 'CM2 « Stratégie »'].join('\n'), COURSE, [CHANGE]),
  labels: LABELS,
  appendix: null
};

describe('syllabus downloads', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.clear();
    auth.isGuest = false;
    vi.mocked(convertMarkdownToDocx).mockResolvedValue(new Blob(['docx']));
  });

  it('saves a markdown syllabus under its name, then counts the download', async () => {
    expect(await exportSyllabus(MARKDOWN)).toBe(true);
    expect(convertMarkdownToDocx).toHaveBeenCalledWith('# Course');
    expect(downloadDocx).toHaveBeenCalledWith(expect.any(Blob), 'syllabus.docx');
    expect(track).toHaveBeenCalledWith('Syllabus Downloaded', {});
    expect(basePostAxios).toHaveBeenCalledWith('/metric/syllabus_downloaded');
  });

  it('writes the complete syllabus itself, and the appendix after a markdown one', async () => {
    await exportSyllabus(COMPLETE);
    expect(convertMarkdownToDocx).not.toHaveBeenCalled();
    expect(vi.mocked(downloadDocx).mock.calls[0][0].size).toBeGreaterThan(1000);

    await exportSyllabus({ ...MARKDOWN, appendix: { changes: [CHANGE], labels: APPENDIX } });
    const markdown = vi.mocked(convertMarkdownToDocx).mock.calls[0][0];
    expect(markdown.startsWith('# Course')).toBe(true);
    expect(markdown).toContain('- Apprentissage : Comparer.');
  });

  it('counts nothing when the file could not be made, and still saves when the count fails', async () => {
    vi.mocked(convertMarkdownToDocx).mockRejectedValueOnce(new Error('docx'));
    expect(await exportSyllabus(MARKDOWN)).toBe(false);
    expect(downloadDocx).not.toHaveBeenCalled();
    expect(track).not.toHaveBeenCalled();

    vi.mocked(basePostAxios).mockRejectedValueOnce(new Error('network'));
    expect(await exportSyllabus(MARKDOWN)).toBe(true);
    expect(downloadDocx).toHaveBeenCalledOnce();
  });

  it('asks a guest to sign up, the syllabus kept for right after', async () => {
    auth.isGuest = true;
    expect(await exportSyllabus(COMPLETE)).toBe(true);
    expect(downloadDocx).not.toHaveBeenCalled();
    expect(auth.askToSignUp).toHaveBeenCalledWith('download');
    expect(getFromStorage(PENDING_SYLLABUS_KEY)).toMatchObject({
      kind: 'complete',
      fileName: 'Gestion-complet.docx'
    });
  });

  it('downloads the kept syllabus once signed in, only once, and keeps it on a failure', async () => {
    auth.isGuest = true;
    await exportSyllabus(MARKDOWN);
    await downloadPendingSyllabus();
    expect(downloadDocx).not.toHaveBeenCalled();

    auth.isGuest = false;
    vi.mocked(convertMarkdownToDocx).mockRejectedValueOnce(new Error('docx'));
    await downloadPendingSyllabus();
    expect(getFromStorage(PENDING_SYLLABUS_KEY)).toEqual(MARKDOWN);

    await downloadPendingSyllabus();
    await downloadPendingSyllabus();
    expect(downloadDocx).toHaveBeenCalledOnce();
    expect(getFromStorage(PENDING_SYLLABUS_KEY)).toBeNull();
  });

  it('still asks a guest to sign up when the storage refuses the syllabus', async () => {
    auth.isGuest = true;
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new Error('QuotaExceededError');
    });
    expect(await exportSyllabus(MARKDOWN)).toBe(true);
    expect(auth.askToSignUp).toHaveBeenCalledWith('download');
    setItem.mockRestore();
  });
});

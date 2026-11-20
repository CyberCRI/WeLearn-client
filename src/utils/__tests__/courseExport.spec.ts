import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildCourseExport,
  downloadPendingCourseExport,
  keepCourseExport,
  PENDING_COURSE_EXPORT_KEY,
  type CourseExport
} from '@/utils/courseExport';
import { planComplete, type CompleteLabels } from '@/utils/completeSyllabus';
import { convertMarkdownToDocx } from '@/utils/md-to-docx';
import { saveSyllabusFile } from '@/utils/syllabusDownload';
import { getFromStorage } from '@/utils/storage';
import type { CourseToUpdate } from '@/types';
import type { AppendixLabels } from '@/utils/pedagogicalAppendix';
import { approvedChange } from './approvedChange';

vi.mock('@/utils/md-to-docx', () => ({ convertMarkdownToDocx: vi.fn() }));
vi.mock('@/utils/syllabusDownload', () => ({ saveSyllabusFile: vi.fn() }));
const auth = vi.hoisted(() => ({ isGuest: false }));
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
const TEXT = ['CONTENU', 'CM2 « Stratégie »', 'x'.repeat(10)].join('\n');
const CHANGE = approvedChange(1, {
  placement: 'Stratégie',
  guidance: { learning: 'Comparer.', greencomp: null, teaching: null, check: null }
});
const LABELS = {
  title: 'Syllabus',
  note: 'Note.',
  change: 'Modification',
  replaces: 'Remplace',
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

const complete: CourseExport = {
  kind: 'complete',
  fileName: 'Gestion-complet.docx',
  plan: planComplete(TEXT, COURSE, [CHANGE]),
  labels: LABELS,
  appendix: null
};
const outline: CourseExport = {
  kind: 'outline',
  fileName: 'Gestion.docx',
  markdown: '# Gestion',
  appendix: { changes: [CHANGE], labels: APPENDIX }
};

describe('course exports', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    auth.isGuest = false;
  });

  it('writes the complete syllabus as a word document', async () => {
    const blob = await buildCourseExport(complete);
    expect(blob.size).toBeGreaterThan(1000);
    expect(convertMarkdownToDocx).not.toHaveBeenCalled();
  });

  it('writes the outline through markdown, the appendix after it', async () => {
    await buildCourseExport(outline);
    const markdown = vi.mocked(convertMarkdownToDocx).mock.calls[0][0];
    expect(markdown.startsWith('# Gestion')).toBe(true);
    expect(markdown).toContain('## Annexe');
    expect(markdown).toContain('- Apprentissage : Comparer.');
  });

  it('downloads the export a guest kept once they are signed in, then forgets it', async () => {
    keepCourseExport(outline);
    auth.isGuest = true;
    await downloadPendingCourseExport();
    expect(saveSyllabusFile).not.toHaveBeenCalled();

    auth.isGuest = false;
    vi.mocked(saveSyllabusFile).mockResolvedValueOnce(false);
    await downloadPendingCourseExport();
    // kept on a failure, so the next visit tries again
    expect(getFromStorage(PENDING_COURSE_EXPORT_KEY)).toEqual(outline);

    vi.mocked(saveSyllabusFile).mockResolvedValueOnce(true);
    await downloadPendingCourseExport();
    expect(vi.mocked(saveSyllabusFile).mock.calls[1][1]).toBe('Gestion.docx');
    expect(getFromStorage(PENDING_COURSE_EXPORT_KEY)).toBeNull();
  });

  it('does nothing without a kept export', async () => {
    await downloadPendingCourseExport();
    expect(saveSyllabusFile).not.toHaveBeenCalled();
  });

  it('loses only that export when the storage refuses it', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new Error('QuotaExceededError');
    });
    expect(() => keepCourseExport(outline)).not.toThrow();
    setItem.mockRestore();
  });
});

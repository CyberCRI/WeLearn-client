import {
  completeSyllabusDocx,
  type CompleteLabels,
  type CompletePlan
} from '@/utils/completeSyllabus';
import {
  appendixMarkdown,
  appendixParagraphs,
  type AppendixLabels
} from '@/utils/pedagogicalAppendix';
import { convertMarkdownToDocx } from '@/utils/md-to-docx';
import { saveSyllabusFile } from '@/utils/syllabusDownload';
import { clearFromStorage, getFromStorage, saveToStorage } from '@/utils/storage';
import { useAuthStore } from '@/stores/auth';
import type { ApprovedChange } from '@/types';

// a word export of the updated syllabus as plain data: the complete syllabus (its whole text with
// the changes in place) or the outline with the changes, and the optional pedagogical appendix.
// built at once, or kept for a guest until they sign in
export type CourseExport = {
  fileName: string;
  appendix: { changes: ApprovedChange[]; labels: AppendixLabels } | null;
} & (
  | { kind: 'complete'; plan: CompletePlan; labels: CompleteLabels }
  | { kind: 'outline'; markdown: string }
);

export const buildCourseExport = (courseExport: CourseExport): Promise<Blob> => {
  const { appendix } = courseExport;
  if (courseExport.kind === 'complete') {
    return completeSyllabusDocx(
      courseExport.plan,
      courseExport.labels,
      appendix ? appendixParagraphs(appendix.changes, appendix.labels) : []
    );
  }
  return convertMarkdownToDocx(
    courseExport.markdown + (appendix ? appendixMarkdown(appendix.changes, appendix.labels) : '')
  );
};

export const PENDING_COURSE_EXPORT_KEY = 'pendingCourseExport';

// the course lives in memory only, so the guest's export is kept before the sign-up takes them
// away. a storage failure (full, blocked) only loses that export
export const keepCourseExport = (courseExport: CourseExport) => {
  try {
    saveToStorage(PENDING_COURSE_EXPORT_KEY, courseExport);
  } catch (error) {
    console.error('Could not keep the export for after the sign-up:', error);
  }
};

// once signed in, the export the guest asked for is downloaded. kept on a failure, so the next
// visit tries again
export const downloadPendingCourseExport = async () => {
  if (useAuthStore().isGuest) return;
  const courseExport = getFromStorage(PENDING_COURSE_EXPORT_KEY) as CourseExport | null;
  if (!courseExport?.fileName) return;
  const isSaved = await saveSyllabusFile(
    () => buildCourseExport(courseExport),
    courseExport.fileName
  );
  if (isSaved) clearFromStorage(PENDING_COURSE_EXPORT_KEY);
};

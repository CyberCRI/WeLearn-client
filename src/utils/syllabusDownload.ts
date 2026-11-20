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
import { convertMarkdownToDocx, downloadDocx } from '@/utils/md-to-docx';
import { basePostAxios } from '@/utils/fetch';
import { track } from '@/utils/analytics';
import { clearFromStorage, getFromStorage, saveToStorage } from '@/utils/storage';
import { useAuthStore } from '@/stores/auth';
import type { ApprovedChange } from '@/types';

// a syllabus word document as plain data, the same for every path: markdown (the syllabus made
// from scratch, or the updated course's outline) or the complete updated syllabus (its whole
// text with the changes in place), with the optional pedagogical appendix. plain data, so a
// guest's can wait in storage until they sign in
export type SyllabusExport = {
  fileName: string;
  appendix: { changes: ApprovedChange[]; labels: AppendixLabels } | null;
} & (
  | { kind: 'markdown'; markdown: string }
  | { kind: 'complete'; plan: CompletePlan; labels: CompleteLabels }
);

// a guest's syllabus waiting for a login (cleared on logout, so it never downloads for someone
// else)
export const PENDING_SYLLABUS_KEY = 'pendingSyllabus';

export const buildSyllabusFile = (syllabus: SyllabusExport): Promise<Blob> => {
  const { appendix } = syllabus;
  if (syllabus.kind === 'complete') {
    return completeSyllabusDocx(
      syllabus.plan,
      syllabus.labels,
      appendix ? appendixParagraphs(appendix.changes, appendix.labels) : []
    );
  }
  return convertMarkdownToDocx(
    syllabus.markdown + (appendix ? appendixMarkdown(appendix.changes, appendix.labels) : '')
  );
};

// saves the word file and counts the download. resolves false when the file could not be made;
// a failed count is only logged
const downloadSyllabus = async (syllabus: SyllabusExport): Promise<boolean> => {
  try {
    downloadDocx(await buildSyllabusFile(syllabus), syllabus.fileName);
  } catch (error) {
    console.error('Error during syllabus download:', error);
    return false;
  }
  track('Syllabus Downloaded', {});
  try {
    await basePostAxios('/metric/syllabus_downloaded');
  } catch (error) {
    console.error('Error during metrics update:', error);
  }
  return true;
};

// the download button of every path. a guest is asked to sign up first: what lives in memory is
// lost on the way, so the syllabus is kept and downloaded right after the login. resolves false
// only when the file could not be made
export const exportSyllabus = async (syllabus: SyllabusExport): Promise<boolean> => {
  const auth = useAuthStore();
  if (!auth.isGuest) return downloadSyllabus(syllabus);
  try {
    saveToStorage(PENDING_SYLLABUS_KEY, syllabus);
  } catch (error) {
    // storage full or blocked: only this download is lost
    console.error('Could not keep the syllabus for after the sign-up:', error);
  }
  auth.askToSignUp('download');
  return true;
};

// back from the login: the syllabus the guest asked for. kept on a failure, so the next visit
// tries again
export const downloadPendingSyllabus = async () => {
  if (useAuthStore().isGuest) return;
  const syllabus = getFromStorage(PENDING_SYLLABUS_KEY) as SyllabusExport | null;
  if (!syllabus?.fileName) return;
  if (await downloadSyllabus(syllabus)) clearFromStorage(PENDING_SYLLABUS_KEY);
};

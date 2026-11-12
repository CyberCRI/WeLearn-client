import type { ContextReading } from '@/utils/teachingContext';
import type { CourseField, TeachingContext } from '@/types';
import type { Connection, ConnectionsStatus } from '@/stores/connections';
import type { ConfirmedCourse, CourseTopicParts } from '@/utils/connections';
import type { ReadingLanguage } from '@/utils/courseReading';
import { clearFromStorage, getFromStorage, saveToStorage } from '@/utils/storage';

// a draft of the syllabus adaptation, kept in this browser only when the teacher asks for it:
// the course as checked in step 2, the text read from the syllabus (the complete word document is
// built from it), the sustainability connections, the approved changes with their wording, place
// and notes. nothing is sent anywhere; the uploaded file itself is not kept. a draft is restored
// only when it is whole and consistent: same version, same course, same syllabus text
export const DRAFT_KEY = 'syllabusDraft';
// raised whenever the saved shape changes: an older draft is then refused, never half-restored
export const DRAFT_VERSION = 1;

export interface TutorDraft {
  step: number;
  syllabusLanguage: string;
  fileName: string | null;
  teachingContext: TeachingContext;
  prefilled: (keyof TeachingContext)[];
  aiFilled: (keyof TeachingContext)[];
  aiSuggested: (keyof TeachingContext)[];
  contextEvidence: ContextReading['evidence'];
  documentText: string | null;
  detectedType: string | null;
  courseDescription: CourseField | null;
  courseSummary: CourseField | null;
  removedDescription: CourseField | null;
  courseObjectives: CourseField[];
  courseTopics: CourseField[];
  coursePlan: string[];
  isReadingPartial: boolean;
}

export interface ConnectionsDraft {
  status: ConnectionsStatus;
  candidateCount: number;
  // ideas left out as forced for the discipline (absent from older drafts)
  leftOut?: number;
  noneReason?: string | null;
  connections: Connection[];
  confirmedFor: ConfirmedCourse | null;
  parts: string[];
  topics: CourseTopicParts[];
  language: ReadingLanguage;
  isCourseChanged: boolean;
}

export interface SyllabusDraft {
  version: number;
  savedAt: string;
  // what the draft is about, checked again on restore
  course: string;
  text: string;
  tutor: TutorDraft;
  connections: ConnectionsDraft;
}

// the course as the teacher confirmed it, without what depends on the interface's language
export const courseIdentity = (course: ConfirmedCourse | null) =>
  course
    ? JSON.stringify([
        course.title,
        course.topics,
        course.objectives,
        course.competencies,
        course.sessions
      ])
    : '';

// a short check of the syllabus text: its length and a hash of it
export const textFingerprint = (text: string | null) => {
  if (!text) return 'none';
  let hash = 5381;
  for (let i = 0; i < text.length; i++) hash = ((hash * 33) ^ text.charCodeAt(i)) >>> 0;
  return `${text.length}:${hash.toString(36)}`;
};

const isArray = (value: unknown) => Array.isArray(value);
const isObject = (value: unknown): value is Record<string, any> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

// the draft has every part a restore needs, in the shape this version saves
export const isWholeDraft = (value: unknown): value is SyllabusDraft => {
  if (!isObject(value) || value.version !== DRAFT_VERSION) return false;
  const { tutor, connections } = value;
  return (
    typeof value.savedAt === 'string' &&
    typeof value.course === 'string' &&
    typeof value.text === 'string' &&
    isObject(tutor) &&
    Number.isInteger(tutor.step) &&
    tutor.step >= 2 &&
    tutor.step <= 4 &&
    isObject(tutor.teachingContext) &&
    (tutor.documentText === null || typeof tutor.documentText === 'string') &&
    isArray(tutor.courseObjectives) &&
    isArray(tutor.courseTopics) &&
    isArray(tutor.coursePlan) &&
    isObject(connections) &&
    typeof connections.status === 'string' &&
    isArray(connections.connections) &&
    connections.connections.every(
      (connection: unknown) =>
        isObject(connection) &&
        Number.isInteger(connection.id) &&
        typeof connection.title === 'string' &&
        isArray(connection.resources)
    ) &&
    isArray(connections.parts) &&
    isArray(connections.topics)
  );
};

export type StoredDraft =
  | { state: 'none' }
  | { state: 'unavailable' }
  | { state: 'invalid' }
  | { state: 'found'; draft: SyllabusDraft };

// the draft saved in this browser, if any; storage that cannot be read is said, not hidden
export const readStoredDraft = (): StoredDraft => {
  try {
    if (!localStorage.getItem(DRAFT_KEY)) return { state: 'none' };
    const value = getFromStorage(DRAFT_KEY);
    return isWholeDraft(value) ? { state: 'found', draft: value } : { state: 'invalid' };
  } catch {
    return { state: 'unavailable' };
  }
};

export const writeDraft = (draft: SyllabusDraft): 'saved' | 'full' | 'unavailable' => {
  try {
    saveToStorage(DRAFT_KEY, draft);
    return 'saved';
  } catch (error: any) {
    // the browser's storage for this site is full
    return error?.name === 'QuotaExceededError' ? 'full' : 'unavailable';
  }
};

export const removeDraft = () => {
  try {
    clearFromStorage(DRAFT_KEY);
    return true;
  } catch {
    return false;
  }
};

// whether this browser lets the site keep anything at all (private modes, blocked storage)
export const canStore = () => {
  try {
    const probe = `${DRAFT_KEY}-probe`;
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
};

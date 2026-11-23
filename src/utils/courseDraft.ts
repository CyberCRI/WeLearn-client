import type { CourseDraft } from '@/stores/course';
import type { ConnectionsDraft } from '@/stores/connections';
import { clearFromStorage, getFromStorage, saveToStorage } from '@/utils/storage';

// a draft of the "I have a course" path, kept in this browser when a logged-in teacher asks for
// it: the course as checked, the whole text read from the syllabus (the complete word document is
// built from it), the connections and the changes with their wording and place. the uploaded file
// is not kept. removed on logout (with the rest of the account's data) and after DRAFT_MAX_AGE_MS
export const DRAFT_KEY = 'courseDraft';
// raised whenever the saved shape changes: an older draft is then refused, never half-restored
export const DRAFT_VERSION = 1;
export const DRAFT_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export interface SyllabusDraft {
  version: number;
  savedAt: string;
  // the syllabus text the draft was saved with, checked again on restore
  text: string;
  course: CourseDraft;
  connections: ConnectionsDraft;
}

// a short check of the syllabus text: its length and a hash of it
export const textFingerprint = (text: string | null | undefined) => {
  if (!text) return 'none';
  let hash = 5381;
  for (let i = 0; i < text.length; i++) hash = ((hash * 33) ^ text.charCodeAt(i)) >>> 0;
  return `${text.length}:${hash.toString(36)}`;
};

const isObject = (value: unknown): value is Record<string, any> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

// every part a restore needs, in the shape this version saves: a course read and not yet sent
// further than the last screen
export const isWholeDraft = (value: unknown): value is SyllabusDraft => {
  if (!isObject(value) || value.version !== DRAFT_VERSION) return false;
  const { course, connections } = value;
  return (
    typeof value.savedAt === 'string' &&
    !Number.isNaN(Date.parse(value.savedAt)) &&
    typeof value.text === 'string' &&
    isObject(course) &&
    Number.isInteger(course.step) &&
    course.step >= 2 &&
    course.step <= 4 &&
    isObject(course.reading) &&
    typeof course.reading.text === 'string' &&
    isObject(course.teachingContext) &&
    Array.isArray(course.courseObjectives) &&
    Array.isArray(course.courseTopics) &&
    Array.isArray(course.coursePlan) &&
    isObject(connections) &&
    typeof connections.status === 'string' &&
    Array.isArray(connections.connections) &&
    connections.connections.every(
      (connection: unknown) =>
        isObject(connection) &&
        typeof connection.id === 'string' &&
        typeof connection.title === 'string'
    )
  );
};

export type StoredDraft =
  | { state: 'none' }
  | { state: 'unavailable' }
  | { state: 'invalid' }
  | { state: 'found'; draft: SyllabusDraft };

export const removeDraft = () => {
  try {
    clearFromStorage(DRAFT_KEY);
    return true;
  } catch {
    return false;
  }
};

// the draft saved in this browser, if any. an expired one is removed and not offered; storage
// that cannot be read is said, not hidden
export const readStoredDraft = (now = Date.now()): StoredDraft => {
  try {
    if (!localStorage.getItem(DRAFT_KEY)) return { state: 'none' };
    const value = getFromStorage(DRAFT_KEY);
    if (!isWholeDraft(value)) return { state: 'invalid' };
    if (now - Date.parse(value.savedAt) > DRAFT_MAX_AGE_MS) {
      removeDraft();
      return { state: 'none' };
    }
    return { state: 'found', draft: value };
  } catch {
    return { state: 'unavailable' };
  }
};

export const writeDraft = (draft: SyllabusDraft): 'saved' | 'full' | 'unavailable' => {
  try {
    saveToStorage(DRAFT_KEY, draft);
    return 'saved';
  } catch (error) {
    // the browser's storage for this site is full
    return (error as { name?: string })?.name === 'QuotaExceededError' ? 'full' : 'unavailable';
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

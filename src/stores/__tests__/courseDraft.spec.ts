import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import { useCourseDraftStore } from '../courseDraft';
import { useConnectionsStore } from '../connections';
import { useCourseStore } from '../course';
import { useTutorStore } from '../tutor';
import { DRAFT_KEY, readStoredDraft, type SyllabusDraft } from '@/utils/courseDraft';
import { getFromStorage } from '@/utils/storage';
import {
  development,
  proposal,
  seedAccepted,
  seedCourse,
  seedReading
} from '@/__tests__/coursePathFixtures';
import type { ConfirmedCourse } from '@/types';

vi.mock('@/utils/fetch', () => ({ basePostAxios: vi.fn(), getGuestQuota: vi.fn() }));
const auth = vi.hoisted(() => ({ isAuthenticated: true, isGuest: false, askToSignUp: vi.fn() }));
vi.mock('@/stores/auth', () => ({ useAuthStore: () => auth }));

const CONFIRMED = { title: 'Macroeconomics' } as ConfirmedCourse;

// a logged-in teacher on screen 3 of the existing course path, one change accepted
const seedWork = () => {
  useTutorStore().path = 'existing';
  seedReading();
  const course = seedCourse();
  course.teachingContext.title = 'Macroeconomics';
  course.step = 3;
  const connections = seedAccepted(proposal());
  connections.status = 'ready';
  connections.confirmedFor = CONFIRMED;
  return { course, connections };
};

const stored = () => getFromStorage(DRAFT_KEY) as SyllabusDraft;

describe('course draft store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    auth.isAuthenticated = true;
    setActivePinia(createPinia());
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('keeps nothing before the teacher asks, then saves each change shortly after', async () => {
    const { course } = seedWork();
    const draft = useCourseDraftStore();
    expect(draft.isSavable).toBe(true);
    expect(localStorage.getItem(DRAFT_KEY)).toBeNull();

    draft.keep();
    expect(draft.isOn).toBe(true);
    expect(stored().course.step).toBe(3);
    expect(stored().course.reading?.text).toBe(course.reading?.text);
    expect(draft.savedAt).toBe(stored().savedAt);

    course.teachingContext.title = 'Macro 101';
    await nextTick();
    expect(stored().course.teachingContext.title).toBe('Macroeconomics');
    vi.advanceTimersByTime(1000);
    expect(stored().course.teachingContext.title).toBe('Macro 101');
  });

  it('keeps no draft for a guest, nor offers one', () => {
    auth.isAuthenticated = false;
    seedWork();
    const draft = useCourseDraftStore();
    expect(draft.isSavable).toBe(false);

    draft.keep();
    expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
  });

  it('resumes a kept draft: the course and its connections, on the same screen', () => {
    seedWork();
    useCourseDraftStore().keep();

    // a new visit
    setActivePinia(createPinia());
    const draft = useCourseDraftStore();
    draft.check();
    expect(draft.found?.course.teachingContext.title).toBe('Macroeconomics');

    expect(draft.restore()).toBe(true);
    const course = useCourseStore();
    const connections = useConnectionsStore();
    expect(useTutorStore().path).toBe('existing');
    expect(course.step).toBe(3);
    expect(course.teachingContext.title).toBe('Macroeconomics');
    expect(course.courseTopics.map((topic) => topic.value)).toEqual(['GDP']);
    expect(connections.acceptedChanges).toHaveLength(1);
    expect(connections.isFor(CONFIRMED)).toBe(true);
    expect(draft.isOn).toBe(true);
    expect(draft.found).toBeNull();
  });

  it('drops the calls that were running: a change being written, an idea not judged', () => {
    const { connections } = seedWork();
    connections.status = 'searching';
    connections.connections[0].development = development({ status: 'thinking', proposal: null });
    useCourseDraftStore().keep();

    setActivePinia(createPinia());
    const draft = useCourseDraftStore();
    draft.check();
    draft.restore();

    const restored = useConnectionsStore();
    expect(restored.status).toBe('ready');
    expect(restored.connections[0].development).toBeNull();
    // never judged: shown as unchecked, to check again
    expect(restored.connections[0].hasCheckFailed).toBe(true);
  });

  it('refuses a draft whose syllabus text does not match, and says so', () => {
    seedWork();
    useCourseDraftStore().keep();
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...stored(), text: '3:abc' }));

    setActivePinia(createPinia());
    const draft = useCourseDraftStore();
    draft.check();

    expect(draft.restore()).toBe(false);
    expect(draft.isUnusable).toBe(true);
    expect(useTutorStore().path).toBeNull();
    expect(useCourseStore().reading).toBeNull();
  });

  it('stops following the work when another course is read, the draft kept as it was', async () => {
    const { course } = seedWork();
    const draft = useCourseDraftStore();
    draft.keep();

    seedReading('Another syllabus');
    course.teachingContext.title = 'Another course';
    await nextTick();
    vi.advanceTimersByTime(1000);

    expect(draft.isOn).toBe(false);
    expect(stored().course.teachingContext.title).toBe('Macroeconomics');
  });

  it('starts a new syllabus without the draft, or removes it', () => {
    seedWork();
    useCourseDraftStore().keep();
    setActivePinia(createPinia());
    const draft = useCourseDraftStore();

    draft.check();
    draft.startNew();
    expect(draft.found).toBeNull();
    expect(readStoredDraft().state).toBe('found');

    draft.check();
    draft.discard();
    expect(draft.found).toBeNull();
    expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
  });

  it('says when this browser cannot keep a draft', () => {
    seedWork();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    const draft = useCourseDraftStore();

    draft.keep();

    expect(draft.problem).toBe('unavailable');
    expect(draft.isOn).toBe(false);
    vi.mocked(Storage.prototype.setItem).mockRestore();
  });
});

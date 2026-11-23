import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import DraftResume from '@/components/tutor/draft/DraftResume.vue';
import DraftControl from '@/components/tutor/draft/DraftControl.vue';
import { useCourseDraftStore } from '@/stores/courseDraft';
import { exists } from '@/__tests__/coursePathFixtures';
import type { SyllabusDraft } from '@/utils/courseDraft';

vi.mock('@/utils/fetch', () => ({ basePostAxios: vi.fn(), getGuestQuota: vi.fn() }));
vi.mock('@/stores/auth', () => ({ useAuthStore: () => ({ isAuthenticated: true }) }));

const FOUND = {
  savedAt: '2026-11-20T10:00:00.000Z',
  course: { teachingContext: { title: 'Ecology' }, fileName: 'ecology.pdf' }
} as unknown as SyllabusDraft;

describe('DraftResume', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('shows nothing without a draft', () => {
    expect(exists(mount(DraftResume), 'draft-resume')).toBe(false);
  });

  it('offers a kept draft: resume, start a new syllabus or remove it', async () => {
    const draft = useCourseDraftStore();
    draft.found = FOUND;
    const restore = vi.spyOn(draft, 'restore').mockReturnValue(true);
    // stubbed, so the banner stays for each click
    const startNew = vi.spyOn(draft, 'startNew').mockImplementation(() => {});
    const discard = vi.spyOn(draft, 'discard').mockImplementation(() => {});
    const wrapper = mount(DraftResume);

    expect(exists(wrapper, 'draft-summary')).toBe(true);
    await wrapper.find('[data-testid="draft-restore"]').trigger('click');
    await wrapper.find('[data-testid="draft-start-new"]').trigger('click');
    await wrapper.find('[data-testid="draft-remove"]').trigger('click');
    expect(restore).toHaveBeenCalled();
    expect(startNew).toHaveBeenCalled();
    expect(discard).toHaveBeenCalled();
  });

  it('says when the kept draft cannot be restored', () => {
    useCourseDraftStore().isUnusable = true;
    const wrapper = mount(DraftResume);

    expect(exists(wrapper, 'draft-unusable')).toBe(true);
    expect(exists(wrapper, 'draft-restore')).toBe(false);
  });
});

describe('DraftControl', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('keeps a draft only when asked', async () => {
    const draft = useCourseDraftStore();
    const keep = vi.spyOn(draft, 'keep');
    const wrapper = mount(DraftControl);
    expect(exists(wrapper, 'draft-saved')).toBe(false);

    await wrapper.find('[data-testid="save-draft"]').trigger('click');
    expect(keep).toHaveBeenCalled();
  });

  it('once kept, says when it was saved and can remove it', async () => {
    const draft = useCourseDraftStore();
    draft.isOn = true;
    draft.savedAt = '2026-11-20T10:00:00.000Z';
    const discard = vi.spyOn(draft, 'discard');
    const wrapper = mount(DraftControl);

    expect(wrapper.find('[data-testid="draft-saved"]').text()).toBe('tutor.draft.savedAt');
    await wrapper.find('[data-testid="remove-draft"]').trigger('click');
    expect(discard).toHaveBeenCalled();
  });

  it('says what went wrong when the draft could not be kept', () => {
    useCourseDraftStore().problem = 'full';

    expect(mount(DraftControl).find('[data-testid="draft-problem"]').text()).toBe(
      'tutor.draft.problem.full'
    );
  });
});

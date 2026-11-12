import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import DraftControl from '@/components/tutor/DraftControl.vue';
import DraftResume from '@/components/tutor/DraftResume.vue';
import { useDraftStore } from '@/stores/draft';
import { useTutorStore } from '@/stores/tutor';
import { DRAFT_KEY, readStoredDraft } from '@/utils/draft';

const startCourse = () => {
  const tutor = useTutorStore();
  tutor.choosePath('existing');
  tutor.teachingContext = { ...tutor.teachingContext, title: 'Chimie industrielle' };
  tutor.documentText = 'CHIMIE INDUSTRIELLE\nBilans de matière.';
  tutor.setStep(2);
  return tutor;
};

describe('draft controls', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it('saves a draft only when asked, says what it keeps, and removes it on request', async () => {
    startCourse();
    const wrapper = mount(DraftControl);
    expect(wrapper.find('details').text()).toContain('tutor.draft.explain');
    // nothing is stored before the teacher asks
    expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(false);
    await wrapper.find('[data-testid="save-draft"]').trigger('click');
    expect(useDraftStore().isOn).toBe(true);
    expect(readStoredDraft().state).toBe('found');
    expect(wrapper.find('[data-testid="draft-saved"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="save-draft"]').exists()).toBe(false);
    await wrapper.find('[data-testid="remove-draft"]').trigger('click');
    expect(useDraftStore().isOn).toBe(false);
    expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
    expect(wrapper.find('[data-testid="save-draft"]').exists()).toBe(true);
  });

  it('offers a saved draft to resume, and says when one cannot be restored', async () => {
    startCourse();
    useDraftStore().keep();
    setActivePinia(createPinia());
    useDraftStore().check();
    const wrapper = mount(DraftResume);
    // the course and file it is about, and when it was saved
    expect(wrapper.find('[data-testid="draft-summary"]').text()).toContain('Chimie industrielle');
    await wrapper.find('[data-testid="draft-restore"]').trigger('click');
    expect(useTutorStore().step).toBe(2);
    expect(wrapper.find('[data-testid="draft-resume"]').exists()).toBe(false);

    localStorage.setItem(DRAFT_KEY, JSON.stringify({ version: 999 }));
    setActivePinia(createPinia());
    useDraftStore().check();
    const unusable = mount(DraftResume);
    expect(unusable.find('[data-testid="draft-unusable"]').exists()).toBe(true);
    await unusable.find('[data-testid="draft-remove"]').trigger('click');
    expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
  });
});

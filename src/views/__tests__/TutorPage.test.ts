import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import TutorPage from '../TutorPage.vue';
import ScratchWizard from '@/components/tutor/ScratchWizard.vue';
import ExistingCourseFlow from '@/components/tutor/ExistingCourseFlow.vue';
import PathChoice from '@/components/tutor/PathChoice.vue';
import GuestQuotaNotice from '@/components/GuestQuotaNotice.vue';
import { useTutorStore } from '@/stores/tutor';

// the wizard scrolls to the current step on mount, but the wrapper isn't in the document
vi.mock('@/utils/navigation', () => ({ scrollToAnchor: vi.fn() }));

describe('TutorPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    localStorage.removeItem('featurePreview');
  });

  it('renders properly', () => {
    const wrapper = mount(TutorPage);
    expect(wrapper.element).toMatchSnapshot();
  });

  it('downloads the syllabus a guest kept before logging in', () => {
    const store = useTutorStore();
    const downloadPendingSyllabus = vi.spyOn(store, 'downloadPendingSyllabus');
    mount(TutorPage, { shallow: true });
    expect(downloadPendingSyllabus).toHaveBeenCalledOnce();
  });

  describe('with the syllabusV2 flag off', () => {
    it('is the current syllabus creator, with no path choice', () => {
      const wrapper = mount(TutorPage, { shallow: true });
      expect(wrapper.findComponent(ScratchWizard).exists()).toBe(true);
      expect(wrapper.findComponent(PathChoice).exists()).toBe(false);
    });
  });

  describe('with the syllabusV2 flag on', () => {
    beforeEach(() => {
      localStorage.setItem('featurePreview', JSON.stringify(['syllabusV2']));
    });

    const mountPage = () =>
      mount(TutorPage, { global: { stubs: { ScratchWizard: false, ExistingCourseFlow: false } } });

    it('asks whether the teacher already has a course', () => {
      const wrapper = mountPage();
      expect(wrapper.findComponent(PathChoice).props('path')).toBeNull();
      expect(wrapper.findComponent(GuestQuotaNotice).exists()).toBe(true);
      expect(wrapper.findComponent(ScratchWizard).exists()).toBe(false);
      expect(wrapper.findComponent(ExistingCourseFlow).exists()).toBe(false);
    });

    it('opens the current creator from scratch, under the chosen path', async () => {
      const wrapper = mountPage();
      await wrapper.find('[data-testid="option-scratch"]').trigger('click');
      const wizard = wrapper.findComponent(ScratchWizard);
      expect(wizard.exists()).toBe(true);
      expect(wizard.findComponent(PathChoice).props('path')).toBe('scratch');
    });

    it('opens the existing course path', async () => {
      const wrapper = mountPage();
      await wrapper.find('[data-testid="option-existing"]').trigger('click');
      const flow = wrapper.findComponent(ExistingCourseFlow);
      expect(flow.exists()).toBe(true);
      expect(flow.text()).toContain('tutor.existingCourse.comingSoon');
      expect(flow.findComponent(PathChoice).props('path')).toBe('existing');
    });

    it('goes back to the question when the path is changed', async () => {
      const store = useTutorStore();
      const wrapper = mountPage();
      await wrapper.find('[data-testid="option-existing"]').trigger('click');
      await wrapper.find('[data-testid="change-path"]').trigger('click');
      await flushPromises();
      expect(store.path).toBeNull();
      expect(wrapper.find('[data-testid="option-scratch"]').exists()).toBe(true);
    });
  });
});

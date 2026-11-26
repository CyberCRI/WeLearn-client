import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import TutorPage from '../TutorPage.vue';
import ScratchWizard from '@/components/tutor/ScratchWizard.vue';
import ExistingCourseFlow from '@/components/tutor/ExistingCourseFlow.vue';
import PathChoice from '@/components/tutor/PathChoice.vue';
import GuestQuotaNotice from '@/components/GuestQuotaNotice.vue';
import AutoEvaluationStart from '@/components/learn/discipline/AutoEvaluationStart.vue';
import { useTutorStore } from '@/stores/tutor';
import { downloadPendingSyllabus } from '@/utils/syllabusDownload';

// the page only starts the download a guest kept; the download itself has its own spec
vi.mock('@/utils/syllabusDownload', () => ({
  PENDING_SYLLABUS_KEY: 'pendingSyllabus',
  exportSyllabus: vi.fn(),
  downloadPendingSyllabus: vi.fn()
}));

// the wizard scrolls to the current step on mount, but the wrapper isn't in the document
vi.mock('@/utils/navigation', () => ({ scrollToAnchor: vi.fn() }));

describe('TutorPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.mocked(downloadPendingSyllabus).mockClear();
  });

  afterEach(() => {
    localStorage.removeItem('featurePreview');
    localStorage.removeItem('evalForm:syllabus_v2_pre');
  });

  it('renders properly', () => {
    const wrapper = mount(TutorPage);
    expect(wrapper.element).toMatchSnapshot();
  });

  it('downloads the syllabus a guest kept before logging in, from either path', () => {
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

  describe('the first time with the syllabusV2 flag on', () => {
    beforeEach(() => {
      localStorage.setItem('featurePreview', JSON.stringify(['syllabusV2']));
    });

    it('asks the self-evaluation first, then whether the teacher already has a course', async () => {
      const wrapper = mount(TutorPage);
      const form = wrapper.findComponent(AutoEvaluationStart);
      expect(form.props('linkQuestion')).toBe('autoEvaluation.syllabus.linkQuestion');
      expect(wrapper.findComponent(PathChoice).exists()).toBe(false);

      form.vm.$emit('skip');
      await flushPromises();

      expect(wrapper.findComponent(AutoEvaluationStart).exists()).toBe(false);
      expect(wrapper.findComponent(PathChoice).exists()).toBe(true);
    });
  });

  describe('with the syllabusV2 flag on', () => {
    beforeEach(() => {
      localStorage.setItem('featurePreview', JSON.stringify(['syllabusV2']));
      // the self-evaluation was done on a first visit
      localStorage.setItem('evalForm:syllabus_v2_pre', 'true');
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
      // its first screen: the upload of the course
      expect(flow.find('[data-testid="course-file-input"]').exists()).toBe(true);
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

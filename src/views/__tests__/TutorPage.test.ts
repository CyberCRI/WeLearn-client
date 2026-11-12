import { describe, it, expect, beforeEach, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import TutorPage from '../TutorPage.vue';
import { createPinia, setActivePinia } from 'pinia';
import ProgressBar from '@/components/microlearning/ProgressBar.vue';
import CursusInfo from '@/components/tutor/CursusInfo.vue';
import PathChoice from '@/components/tutor/PathChoice.vue';
import CourseCheck from '@/components/tutor/CourseCheck.vue';
import ReadingProgress from '@/components/tutor/ReadingProgress.vue';
import { useTutorStore } from '@/stores/tutor';
import { scrollToAnchor } from '@/utils/navigation';
import i18n from '@/localisation/i18n';

const { t } = i18n.global;

// the page scrolls to the current step on mount, but the wrapper isn't in the document
vi.mock('@/utils/navigation', () => ({ scrollToAnchor: vi.fn() }));

describe('TutorPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.mocked(scrollToAnchor).mockClear();
  });

  it('renders properly', () => {
    const wrapper = mount(TutorPage);
    expect(wrapper.element).toMatchSnapshot();
  });

  it('starts with the question only, without a step bar', () => {
    const wrapper = mount(TutorPage, { shallow: true });
    expect(wrapper.findComponent(PathChoice).props('path')).toBeNull();
    expect(wrapper.findComponent(ProgressBar).exists()).toBe(false);
    expect(wrapper.findComponent(CursusInfo).exists()).toBe(false);
  });

  it('shows the step bar of the chosen path', async () => {
    const store = useTutorStore();
    const wrapper = mount(TutorPage, { shallow: true });

    wrapper.findComponent(PathChoice).vm.$emit('choose', 'existing');
    await flushPromises();
    expect(wrapper.findComponent(ProgressBar).props('labels')).toEqual([
      t('tutor.steps.course'),
      t('tutor.steps.check'),
      t('tutor.steps.additions'),
      t('tutor.steps.updated')
    ]);
    expect(wrapper.findComponent(CursusInfo).exists()).toBe(true);

    store.resetCourse();
    store.choosePath('scratch');
    await flushPromises();
    expect(wrapper.findComponent(ProgressBar).props('labels')).toEqual([
      t('tutor.steps.idea'),
      t('tutor.steps.proposal'),
      t('tutor.steps.syllabus')
    ]);
  });

  it('goes back to the question when the path is changed', async () => {
    const store = useTutorStore();
    store.choosePath('existing');
    const wrapper = mount(TutorPage, { shallow: true });
    wrapper.findComponent(PathChoice).vm.$emit('reset');
    await flushPromises();
    expect(store.path).toBeNull();
    expect(wrapper.findComponent(ProgressBar).exists()).toBe(false);
  });

  it('scrolls to a finished step picked in the step bar', () => {
    const store = useTutorStore();
    store.choosePath('existing');
    store.setStep(2);
    const wrapper = mount(TutorPage, { shallow: true });
    wrapper.findComponent(ProgressBar).vm.$emit('select', 0);
    expect(scrollToAnchor).toHaveBeenLastCalledWith('target-1');
  });

  it('scrolls to the new step when the step changes', async () => {
    const store = useTutorStore();
    store.choosePath('existing');
    mount(TutorPage, { shallow: true });
    expect(scrollToAnchor).toHaveBeenLastCalledWith('target-1');
    store.goNext();
    await flushPromises();
    expect(scrollToAnchor).toHaveBeenLastCalledWith('target-2');
  });

  it('folds "Your course" into a recap that can be opened again', async () => {
    const store = useTutorStore();
    store.choosePath('existing');
    store.syllabusFile = new File(['a'], 'syllabus.pdf', { type: 'application/pdf' });
    const wrapper = mount(TutorPage, { shallow: true });

    store.goNext();
    await flushPromises();
    expect(wrapper.findComponent(CursusInfo).exists()).toBe(false);
    expect(wrapper.find('#target-1 .recap-text').text()).toContain('syllabus.pdf');

    const toggle = wrapper.find('#target-1 .recap button');
    await toggle.trigger('click');
    expect(wrapper.findComponent(CursusInfo).exists()).toBe(true);
    expect(toggle.text()).toBe('tutor.collapse');
  });

  it('reads the syllabus from "Your course", then shows "Check your course"', async () => {
    const store = useTutorStore();
    store.choosePath('existing');
    const wrapper = mount(TutorPage, { shallow: true });
    expect(wrapper.findComponent(CursusInfo).props('action')).toBe(store.readSyllabus);

    // while WeLearn reads, the reading progress takes the place of the upload, in the page
    store.syllabusFile = new File(['a'], 'syllabus.pdf', { type: 'application/pdf' });
    store.readingPhase = 'reading';
    await flushPromises();
    expect(wrapper.findComponent(CursusInfo).exists()).toBe(false);
    expect(wrapper.findComponent(ReadingProgress).props()).toMatchObject({
      fileName: 'syllabus.pdf',
      phase: 'reading'
    });
    wrapper.findComponent(ReadingProgress).vm.$emit('cancel');
    await flushPromises();
    expect(store.readingPhase).toBe('idle');

    // a failed reading is said above the upload, which "Continue" retries
    store.readError = 'unavailable';
    await flushPromises();
    expect(wrapper.find('[data-testid="read-error"]').text()).toContain(
      'tutor.reading.unavailable.title'
    );
    expect(wrapper.findComponent(CursusInfo).exists()).toBe(true);

    store.setStep(2);
    await flushPromises();
    expect(wrapper.findComponent(CourseCheck).props('action')).toBe(store.confirmCourse);
    expect(wrapper.find('#target-1 .recap-text').exists()).toBe(true);
  });
});

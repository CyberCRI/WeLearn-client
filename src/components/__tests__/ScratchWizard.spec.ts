import { describe, it, expect, beforeEach, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import ScratchWizard from '@/components/tutor/ScratchWizard.vue';
import { createPinia, setActivePinia } from 'pinia';
import TutorStepsBar from '@/components/tutor/TutorStepsBar.vue';
import CursusInfo from '@/components/tutor/CursusInfo.vue';
import ToasterComponent from '@/components/ToasterComponent.vue';
import { useTutorStore } from '@/stores/tutor';
import { scrollToAnchor } from '@/utils/navigation';

// the wizard scrolls to the current step on mount, but the wrapper isn't in the document
vi.mock('@/utils/navigation', () => ({ scrollToAnchor: vi.fn() }));

describe('ScratchWizard', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.mocked(scrollToAnchor).mockClear();
  });
  it('shows its four steps in the steps bar', () => {
    const store = useTutorStore();
    store.step = 3;
    const wrapper = mount(ScratchWizard, { shallow: true });
    const bar = wrapper.findComponent(TutorStepsBar);
    expect(bar.props('labels')).toHaveLength(4);
    expect(bar.props('step')).toBe(3);
  });

  it('puts what it is given before the steps', () => {
    const wrapper = mount(ScratchWizard, {
      shallow: true,
      slots: { intro: '<p data-testid="intro">intro</p>' }
    });
    expect(wrapper.find('[data-testid="intro"]').exists()).toBe(true);
  });

  it('scrolls to the new step when the step changes', async () => {
    const store = useTutorStore();
    mount(ScratchWizard, { shallow: true });
    expect(scrollToAnchor).toHaveBeenLastCalledWith('target-1');
    store.step = 2;
    await flushPromises();
    expect(scrollToAnchor).toHaveBeenLastCalledWith('target-2');
  });

  it('folds finished steps into a recap that can be opened again', async () => {
    const store = useTutorStore();
    store.step = 2;
    const wrapper = mount(ScratchWizard, { shallow: true });
    expect(wrapper.findComponent(CursusInfo).exists()).toBe(false);
    const toggle = wrapper.find('#target-1 .recap button');
    expect(toggle.text()).toBe('tutor.edit');

    await toggle.trigger('click');
    expect(wrapper.findComponent(CursusInfo).exists()).toBe(true);
    expect(toggle.text()).toBe('tutor.collapse');

    await toggle.trigger('click');
    expect(wrapper.findComponent(CursusInfo).exists()).toBe(false);
  });

  it('folds the documents step back and returns to the current step when the files did not change', async () => {
    const store = useTutorStore();
    store.step = 4;
    const handleSummaryFiles = vi.spyOn(store, 'handleSummaryFiles').mockResolvedValue(true);
    const wrapper = mount(ScratchWizard, { shallow: true });
    await wrapper.find('#target-1 .recap button').trigger('click');

    await (wrapper.findComponent(CursusInfo).props('action') as () => Promise<void>)();
    await flushPromises();

    expect(handleSummaryFiles).toHaveBeenCalledOnce();
    expect(store.step).toBe(4);
    expect(wrapper.findComponent(CursusInfo).exists()).toBe(false);
    expect(scrollToAnchor).toHaveBeenLastCalledWith('target-4');
  });

  it('keeps the documents step open when the files were not kept as they are', async () => {
    const store = useTutorStore();
    store.step = 4;
    vi.spyOn(store, 'handleSummaryFiles').mockResolvedValue(false);
    const wrapper = mount(ScratchWizard, { shallow: true });
    await wrapper.find('#target-1 .recap button').trigger('click');
    vi.mocked(scrollToAnchor).mockClear();

    await (wrapper.findComponent(CursusInfo).props('action') as () => Promise<void>)();
    await flushPromises();

    expect(wrapper.findComponent(CursusInfo).exists()).toBe(true);
    expect(scrollToAnchor).not.toHaveBeenCalled();
  });

  it('shows an error when the word file could not be downloaded', async () => {
    const store = useTutorStore();
    const wrapper = mount(ScratchWizard, { shallow: true });
    expect(wrapper.findComponent(ToasterComponent).exists()).toBe(false);

    store.hasDownloadError = true;
    await flushPromises();

    const toaster = wrapper.findComponent(ToasterComponent);
    expect(toaster.props()).toMatchObject({
      level: 'error',
      title: 'tutor.downloadError.title',
      description: 'tutor.downloadError.description'
    });
    expect(toaster.attributes('role')).toBe('alert');
  });

  it('writes the course details typed in the first step to the store', async () => {
    const store = useTutorStore();
    const wrapper = mount(ScratchWizard, { shallow: true });
    const info = wrapper.findComponent(CursusInfo);
    info.vm.$emit('update:courseTitle', 'Ecology');
    info.vm.$emit('update:level', 'Master');
    info.vm.$emit('update:duration', '10h');
    info.vm.$emit('update:description', 'About soils');
    expect(store.courseTitle).toBe('Ecology');
    expect(store.level).toBe('Master');
    expect(store.duration).toBe('10h');
    expect(store.description).toBe('About soils');
  });
});

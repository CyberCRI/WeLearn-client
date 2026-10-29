import { describe, it, expect, beforeEach, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import TutorPage from '../TutorPage.vue';
import { createPinia, setActivePinia } from 'pinia';
import ProgressBar from '@/components/microlearning/ProgressBar.vue';
import CursusInfo from '@/components/tutor/CursusInfo.vue';
import { useTutorStore } from '@/stores/tutor';
import { scrollToAnchor } from '@/utils/navigation';

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

  it('scrolls to a finished step picked in the steps indicator', async () => {
    const store = useTutorStore();
    store.step = 3;
    const wrapper = mount(TutorPage, { shallow: true });
    wrapper.findComponent(ProgressBar).vm.$emit('select', 0);
    expect(scrollToAnchor).toHaveBeenLastCalledWith('target-1');
  });

  it('scrolls to the new step when the step changes', async () => {
    const store = useTutorStore();
    mount(TutorPage, { shallow: true });
    expect(scrollToAnchor).toHaveBeenLastCalledWith('target-1');
    store.step = 2;
    await flushPromises();
    expect(scrollToAnchor).toHaveBeenLastCalledWith('target-2');
  });

  it('folds finished steps into a recap that can be opened again', async () => {
    const store = useTutorStore();
    store.step = 2;
    const wrapper = mount(TutorPage, { shallow: true });
    expect(wrapper.findComponent(CursusInfo).exists()).toBe(false);
    const toggle = wrapper.find('#target-1 .recap button');
    expect(toggle.text()).toBe('tutor.edit');

    await toggle.trigger('click');
    expect(wrapper.findComponent(CursusInfo).exists()).toBe(true);
    expect(toggle.text()).toBe('tutor.collapse');

    await toggle.trigger('click');
    expect(wrapper.findComponent(CursusInfo).exists()).toBe(false);
  });

  it('writes the course details typed in the first step to the store', async () => {
    const store = useTutorStore();
    const wrapper = mount(TutorPage, { shallow: true });
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

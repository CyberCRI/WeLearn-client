import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CourseStart from '../teacher/CourseStart.vue';
import { useCourseDesignStore } from '@/stores/courseDesign';

vi.mock('@/utils/fetch', () => ({
  basePostAxios: vi.fn()
}));

const mountPage = () => mount(CourseStart, { global: { stubs: { RouterLink: RouterLinkStub } } });

beforeEach(() => {
  setActivePinia(createPinia());
  window.history.replaceState({}, '', '/');
});

describe('CourseStart (design your course)', () => {
  it('asks one question first, with nothing shown below it yet', () => {
    const wrapper = mountPage();

    expect(wrapper.find('h1').text()).toBe('journey.teach.spaces.design.modules.course.title');
    expect(wrapper.text()).toContain('journey.teach.courseStart.question');
    expect(wrapper.find('[data-testid="option-yes"]').attributes('aria-pressed')).toBe('false');
    expect(wrapper.find('[data-testid="route-existing"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="route-new"]').exists()).toBe(false);
  });

  it('"yes" reveals the upload on the same page, without the demo paths', async () => {
    const wrapper = mountPage();
    await wrapper.find('[data-testid="option-yes"]').trigger('click');

    const route = wrapper.find('[data-testid="route-existing"]');
    expect(route.find('[data-testid="read-button"]').exists()).toBe(true);
    expect(route.find('[data-testid="send-notice"]').exists()).toBe(true);
    expect(route.find('[data-testid="example-button"]').exists()).toBe(false);
  });

  it('with ?demo=true, the example opens the review on the same page', async () => {
    window.history.replaceState({}, '', '/?demo=true');
    const wrapper = mountPage();
    await wrapper.find('[data-testid="option-yes"]').trigger('click');

    const route = wrapper.find('[data-testid="route-existing"]');
    expect(route.find('[data-testid="read-button"]').exists()).toBe(true);
    expect(route.find('[data-testid="example-button"]').exists()).toBe(true);

    await route.find('[data-testid="example-button"]').trigger('click');
    expect(wrapper.find('[data-testid="example-banner"]').exists()).toBe(true);
    expect(wrapper.findAll('[data-testid="objective"]')).toHaveLength(3);
  });

  it('"no" says honestly that this route is not available yet, with no upload', async () => {
    const wrapper = mountPage();
    await wrapper.find('[data-testid="option-no"]').trigger('click');

    expect(wrapper.find('[data-testid="route-new"]').text()).toBe(
      'journey.teach.courseStart.newCourse'
    );
    expect(wrapper.find('[data-testid="read-button"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="option-no"]').attributes('aria-pressed')).toBe('true');
  });

  it('coming back to a course already started shows it again, under the folded question', () => {
    useCourseDesignStore().loadExample();
    const wrapper = mountPage();

    expect(wrapper.find('[data-testid="chosen-path"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="option-yes"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="example-banner"]').exists()).toBe(true);
  });

  it('"yes" folds the question into one line; "change" with nothing started goes straight back', async () => {
    const wrapper = mountPage();
    await wrapper.find('[data-testid="option-yes"]').trigger('click');

    expect(wrapper.find('[data-testid="chosen-path"]').text()).toContain(
      'journey.teach.courseStart.working'
    );
    expect(wrapper.find('[data-testid="option-yes"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="option-no"]').exists()).toBe(false);

    await wrapper.find('[data-testid="change-path"]').trigger('click');
    expect(wrapper.find('[data-testid="change-warning"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="option-yes"]').exists()).toBe(true);
  });

  it('"change" warns before discarding work, and keeps it unless the teacher confirms', async () => {
    const store = useCourseDesignStore();
    store.loadExample();
    const wrapper = mountPage();

    await wrapper.find('[data-testid="change-path"]').trigger('click');
    expect(wrapper.find('[data-testid="change-warning"]').exists()).toBe(true);
    await wrapper.find('[data-testid="keep-working"]').trigger('click');
    expect(wrapper.find('[data-testid="example-banner"]').exists()).toBe(true);

    await wrapper.find('[data-testid="change-path"]').trigger('click');
    await wrapper.find('[data-testid="discard-change"]').trigger('click');
    expect(store.source).toBe(null);
    expect(wrapper.find('[data-testid="option-yes"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="example-banner"]').exists()).toBe(false);
  });
});

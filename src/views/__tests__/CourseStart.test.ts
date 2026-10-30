import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CourseStart from '../teacher/CourseStart.vue';
import { useCourseDesignStore } from '@/stores/courseDesign';
import { basePostAxios } from '@/utils/fetch';

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
    expect(wrapper.findAll('[data-testid="objective-list"] li')).toHaveLength(3);
  });

  it('"no" opens a short brief: only the course idea is needed to ask for a proposal', async () => {
    const wrapper = mountPage();
    await wrapper.find('[data-testid="option-no"]').trigger('click');

    const route = wrapper.find('[data-testid="route-new"]');
    expect(route.find('[data-testid="course-brief"]').exists()).toBe(true);
    expect(route.find('[data-testid="read-button"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="chosen-path"]').text()).toContain(
      'journey.teach.courseStart.workingNew'
    );
    const button = route.find('[data-testid="draft-button"]');
    expect(button.attributes('disabled')).toBeDefined();
    await route.find('[data-testid="brief-idea"]').setValue('Une introduction à la macroéconomie');
    expect(button.attributes('disabled')).toBeUndefined();
  });

  it('a proposal is reviewed as WeLearn’s, with its opportunities the teacher can remove', async () => {
    const store = useCourseDesignStore();
    vi.mocked(basePostAxios).mockResolvedValue({
      status: 200,
      data: {
        answer: JSON.stringify({
          title: 'Macroéconomie et transition écologique',
          purpose: 'Comprendre les grands agrégats.',
          discipline: 'Économie',
          level: 'L1',
          objectives: ['Définir le PIB.', 'Expliquer le chômage.'],
          topics: ['Le PIB', 'Le chômage'],
          sessions: ['Séance 1 : Le PIB'],
          activities: ['Étude de cas'],
          assessment: ['Examen écrit'],
          sustainability: [
            {
              title: 'Les limites du PIB',
              anchor: 'Le PIB',
              why: 'Le PIB ne mesure pas le bien-être.',
              how: 'Débat.',
              queries: ['limites du PIB', 'beyond GDP']
            }
          ]
        })
      }
    } as any);
    store.brief.idea = 'Introduction à la macroéconomie';
    await store.draftProposal();
    const wrapper = mountPage();

    expect(wrapper.find('[data-testid="route-new"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('journey.teach.scratch.review.title');
    expect(wrapper.find('[data-testid="original"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="overview"]').text()).toContain(
      'journey.teach.adapt.review.origin.suggested'
    );
    expect(wrapper.findAll('[data-testid="objective-list"] li')).toHaveLength(2);
    expect(wrapper.find('[data-testid="activities-part"]').exists()).toBe(true);

    await wrapper.find('[data-testid="toggle-opportunity"]').trigger('click');
    expect(store.keptIdeas).toEqual([]);
    expect(wrapper.find('[data-testid="opportunity"]').classes()).toContain('is-removed');
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

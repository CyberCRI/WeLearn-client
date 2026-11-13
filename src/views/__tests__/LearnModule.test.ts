import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import LearnModule from '../LearnModule.vue';
import LearnPage from '../LearnPage.vue';
import LearnModuleCard from '@/components/learn/LearnModuleCard.vue';
import TrailNavigation from '@/components/learn/TrailNavigation.vue';
import ConfidenceCheck from '@/components/learn/ConfidenceCheck.vue';
import ConceptExplorer from '@/components/learn/steps/ConceptExplorer.vue';
import DimensionsDiagram from '@/components/learn/steps/DimensionsDiagram.vue';
import SortActivity from '@/components/learn/steps/SortActivity.vue';
import TimelineStep from '@/components/learn/steps/TimelineStep.vue';
import { getModuleContent } from '@/learn/modules';
import { getProgress, saveProgress } from '@/learn/progress';
import { track } from '@/utils/analytics';

const routing = vi.hoisted(() => ({
  params: { id: 'foundations' } as Record<string, string>,
  push: vi.fn()
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: routing.params }),
  useRouter: () => ({ push: routing.push })
}));
vi.mock('@/utils/analytics', () => ({ track: vi.fn() }));

const STEP_COMPONENTS = {
  concepts: ConceptExplorer,
  dimensions: DimensionsDiagram,
  sort: SortActivity,
  timeline: TimelineStep
} as const;

const RouterLink = { props: ['to'], template: '<a :href="to"><slot /></a>' };

describe('Learn pages', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    routing.params = { id: 'foundations' };
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('lists every module in order with its done status', () => {
    saveProgress('foundations', { completedAt: '2026-11-10' });
    const wrapper = mount(LearnPage, { global: { stubs: { RouterLink } } });

    const cards = wrapper.findAllComponents(LearnModuleCard);
    expect(cards.map((c) => c.props('to'))).toEqual([
      '/learn/foundations',
      '/learn/frameworks',
      '/learn/discipline'
    ]);
    expect(cards[0].props()).toMatchObject({
      title: getModuleContent('foundations', 'fr').title,
      isDone: true
    });
    expect(cards[1].props('isDone')).toBe(false);
    expect(cards[2].props()).toMatchObject({
      title: 'La durabilité dans votre discipline'
    });
  });

  it('shows a not-found message for an unknown module', () => {
    routing.params = { id: 'discipline' };
    const wrapper = mount(LearnModule);

    expect(wrapper.text()).toContain('learn.module.notFound');
  });

  it('runs a module from intro to wrap-up and saves progress', async () => {
    const wrapper = mount(LearnModule);
    const steps = getModuleContent('foundations', 'fr').steps;

    wrapper.findComponent(ConfidenceCheck).vm.$emit('update:modelValue', 2);
    wrapper.findComponent(TrailNavigation).vm.$emit('next');
    await flushPromises();

    expect(track).toHaveBeenCalledWith('Learn Module Started', { module: 'foundations' });
    expect(track).toHaveBeenCalledWith('Learn Confidence Rated', {
      module: 'foundations',
      moment: 'before',
      value: 2
    });
    expect(getProgress('foundations').confidenceBefore).toBe(2);

    for (const step of steps) {
      const nav = wrapper.findComponent(TrailNavigation);
      expect(nav.props('canNext')).toBe(false);
      wrapper
        .findComponent(STEP_COMPONENTS[step.type as keyof typeof STEP_COMPONENTS])
        .vm.$emit('done');
      await flushPromises();
      expect(nav.props('canNext')).toBe(true);
      nav.vm.$emit('next');
      await flushPromises();
    }

    expect(wrapper.text()).toContain('learn.module.takeawaysTitle');
    expect(getProgress('foundations').completedAt).toBeTruthy();
    expect(track).toHaveBeenCalledWith('Learn Module Completed', { module: 'foundations' });

    wrapper.findComponent(ConfidenceCheck).vm.$emit('update:modelValue', 4);
    await flushPromises();
    expect(getProgress('foundations').confidenceAfter).toBe(4);

    // wrap-up: back to the list (left), next module (right)
    const buttons = wrapper.findAll('button');
    await buttons[buttons.length - 2].trigger('click');
    await buttons[buttons.length - 1].trigger('click');
    expect(routing.push.mock.calls).toEqual([['/learn'], ['/learn/frameworks']]);
  });
});

import { reactive } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import DisciplineModule from '../DisciplineModule.vue';
import { DATA } from '@/learn/modules/discipline';
import type { FlipStep } from '@/types/learn/discipline';

const routing = vi.hoisted(() => ({
  route: { query: {} } as { query: Record<string, string> }
}));

vi.mock('vue-router', () => ({
  useRoute: () => routing.route,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() })
}));

vi.mock('@/utils/fetch', () => ({ basePostAxios: vi.fn() }));
vi.mock('@/utils/analytics', () => ({ track: vi.fn() }));
vi.mock('@/utils/navigation', () => ({ scrollToAnchor: vi.fn(), scrollToTop: vi.fn() }));

describe('DisciplineModule trail', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    routing.route = reactive({ query: {} });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // the flip step can be skipped; "Bravo" shows once every card is revealed
  it('reveals every card through its button, then moves on', async () => {
    const wrapper = mount(DisciplineModule);
    // open the trail like a browser back/forward to ?screen=trail would
    routing.route.query = { disc: 'math', screen: 'trail', step: '0' };
    await flushPromises();

    const flipStep = DATA.fr.math.steps[0] as FlipStep;
    const cards = wrapper.findAll('.numbered-card button');
    const next = () => wrapper.get('.trail-navigation .btn-primary');
    expect(cards).toHaveLength(flipStep.cards.length);

    // Enter/Space on a native button fire click, the browser run is in e2e/microlearning.spec.ts
    for (const card of cards) {
      expect(card.attributes('aria-expanded')).toBe('false');
      await card.trigger('click');
      expect(card.attributes('aria-expanded')).toBe('true');
    }

    expect(wrapper.text()).toContain('learn.discipline.flipCards.completed');
    await next().trigger('click');
    expect(wrapper.find('.flip-cards').exists()).toBe(false);
  });
});

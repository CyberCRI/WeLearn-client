import { reactive } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import MicrolearningModule from '../MicrolearningModule.vue';
import { DATA } from '@/stores/microlearning/data';
import type { FlipStep } from '@/types/microlearning';

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

describe('MicrolearningModule trail', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    routing.route = reactive({ query: {} });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // the flip step blocks the trail until every card is flipped
  it('lets every card be flipped through its button, then unlocks next', async () => {
    const wrapper = mount(MicrolearningModule);
    // open the trail like a browser back/forward to ?screen=trail would
    routing.route.query = { disc: 'math', screen: 'trail', step: '0' };
    await flushPromises();

    const flipStep = DATA.fr.math.steps[0] as FlipStep;
    const cards = wrapper.findAll('button.flip-card');
    const next = () => wrapper.get('.trail-navigation .btn-primary');
    expect(cards).toHaveLength(flipStep.cards.length);
    expect(next().attributes('disabled')).toBeDefined();

    // Enter/Space on a native button fire click, the browser run is in e2e/microlearning.spec.ts
    for (const card of cards) {
      expect(card.attributes('aria-pressed')).toBe('false');
      await card.trigger('click');
      expect(card.attributes('aria-pressed')).toBe('true');
    }

    expect(wrapper.text()).toContain('microLearning.flipCards.completed');
    expect(next().attributes('disabled')).toBeUndefined();

    await next().trigger('click');
    expect(wrapper.find('.flip-card').exists()).toBe(false);
  });
});

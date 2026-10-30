import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import NavComponent from '../NavComponent.vue';
import BaseNavItem from '../BaseNavItem.vue';
import SparkleIcon from '@/components/icons/SparkleIcon.vue';

// the page the nav is shown on (teacher pages by default)
let routeName = 'teach';
vi.mock('vue-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('vue-router')>()),
  useRoute: () => ({ name: routeName })
}));

beforeEach(() => {
  setActivePinia(createPinia());
  routeName = 'teach';
});

describe('NavComponent', () => {
  it('shows Home and Ask WeLearn, then the utilities; the tools live in the teacher spaces', () => {
    const wrapper = mount(NavComponent, {
      global: { stubs: { RouterLink: RouterLinkStub, LanguageSelector: true } }
    });

    const items = wrapper
      .findAllComponents(BaseNavItem)
      .map((item) => [item.props('name'), item.props('to')]);

    expect(items).toEqual([
      ['home', '/teach'],
      ['chat', '/q-and-a'],
      ['bookmarks', '/bookmarks'],
      ['about', '/about']
    ]);
  });

  it('Ask WeLearn alone stands out, with the AI sparkle', () => {
    const wrapper = mount(NavComponent, {
      global: { stubs: { RouterLink: RouterLinkStub, LanguageSelector: true } }
    });

    const highlighted = wrapper
      .findAllComponents(BaseNavItem)
      .filter((item) => item.props('isHighlighted'));
    expect(highlighted.map((item) => item.props('name'))).toEqual(['chat']);
    expect(highlighted[0].props('icon')).toBe(SparkleIcon);
    expect(highlighted[0].find('.is-highlighted').exists()).toBe(true);
  });

  it('on the learner pages, Home and Ask WeLearn lead to the learner homepage and tutor', () => {
    routeName = 'learn-space';
    const wrapper = mount(NavComponent, {
      global: { stubs: { RouterLink: RouterLinkStub, LanguageSelector: true } }
    });
    expect(
      wrapper
        .findAllComponents(BaseNavItem)
        .slice(0, 2)
        .map((item) => item.props('to'))
    ).toEqual(['/learn', '/learn/ask']);
  });
});

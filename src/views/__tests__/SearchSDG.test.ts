import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import SearchSDG from '../SearchSDG.vue';
import TeachExplore from '../teacher/TeachExplore.vue';
import { useFiltersStore } from '@/stores/filters';

vi.mock('@/utils/fetch', () => ({
  getSearch: vi.fn(),
  getSDGsFromQuery: vi.fn()
}));

const options = {
  global: {
    stubs: {
      RouterLink: RouterLinkStub,
      ColumnTemplate: {
        template: '<div><slot name="left-panel" /><slot name="right-panel" /></div>'
      },
      SourcesListComponent: true,
      FiltersComponent: { template: '<div data-testid="filters" />' }
    }
  }
};

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('search page and teacher EXPLORE', () => {
  it('/search: no teacher heading or back link', () => {
    const wrapper = mount(SearchSDG, options);

    expect(wrapper.find('[data-testid="explore-header"]').exists()).toBe(false);
    expect(wrapper.find('h1').exists()).toBe(false);
    expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(false);
    expect(wrapper.find('textarea').exists()).toBe(true);
  });

  it('teacher EXPLORE: the same search and filters, under the teacher heading', () => {
    const wrapper = mount(TeachExplore, options);
    const header = wrapper.find('[data-testid="explore-header"]');

    expect(header.find('h1').text()).toBe('journey.teach.spaces.explore.pageTitle');
    expect(header.text()).toContain('journey.teach.spaces.explore.intro');
    expect(header.findComponent(RouterLinkStub).props('to')).toEqual({ name: 'teach' });
    expect(wrapper.findComponent(SearchSDG).exists()).toBe(true);
    expect(wrapper.find('textarea').exists()).toBe(true);
    expect(wrapper.find('[data-testid="filters"]').exists()).toBe(true);
  });

  it('teacher EXPLORE pre-selects no filters', () => {
    const filtersStore = useFiltersStore();
    mount(TeachExplore, options);

    expect(filtersStore.sourcesFilters).toEqual([]);
    expect(filtersStore.sdgFilters).toEqual([]);
  });
});

describe('teacher EXPLORE route', () => {
  it('the homepage card link (teach-space explore) and /teach/explore open the search page', async () => {
    const { default: router } = await import('@/router');

    await router.push({ name: 'teach-space', params: { space: 'explore' } });
    expect(router.currentRoute.value.name).toBe('teach-explore');
    expect(router.currentRoute.value.meta.requiresAuth).toBe(true);

    await router.push('/teach/design');
    expect(router.currentRoute.value.name).toBe('teach-space');

    await router.push('/search');
    expect(router.currentRoute.value.name).toBe('search-sdg');
  });
});

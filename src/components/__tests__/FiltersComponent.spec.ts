import { describe, it, expect, beforeEach } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import FiltersComponent from '../FiltersComponent.vue';
import { useFiltersStore } from '@/stores/filters';

describe('FiltersComponent', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // jsdom fires "toggle" on its own only after the test ends, so dispatch it here
  it.each([
    [0, 'sources'],
    [1, 'sdgs'],
    [2, 'languages']
  ] as const)('keeps the %s section open state in the store', async (index, key) => {
    const filters = useFiltersStore();
    const wrapper = shallowMount(FiltersComponent);
    const section = wrapper.findAll('details')[index];

    (section.element as HTMLDetailsElement).open = false;
    await section.trigger('toggle');

    expect(filters.openSections[key]).toBe(false);
  });

  it('closes the panel when asked to', async () => {
    const filters = useFiltersStore();
    filters.panelOpen = true;
    const wrapper = shallowMount(FiltersComponent);

    await wrapper.setProps({ shouldClose: true });

    expect(filters.panelOpen).toBe(false);
  });

  it('opens and closes the panel from the toggle button and the icon', async () => {
    const filters = useFiltersStore();
    filters.panelOpen = false;
    const wrapper = shallowMount(FiltersComponent);

    await wrapper.get('.filters-toggle').trigger('click');
    expect(filters.panelOpen).toBe(true);
    expect(wrapper.get('.filters-toggle').attributes('aria-expanded')).toBe('true');
    expect(wrapper.get('.filters').classes()).not.toContain('hide');

    await wrapper.get('.head-icon').trigger('click');
    expect(filters.panelOpen).toBe(false);
    expect(wrapper.get('.filters').classes()).toContain('hide');
  });

  it('clears every selected filter', async () => {
    const filters = useFiltersStore();
    filters.sourcesFilters = ['hal'];
    filters.sdgFilters = [13];
    filters.languageFilters = ['fr'];
    const wrapper = shallowMount(FiltersComponent);

    await wrapper.get('.remove-all').trigger('click');

    expect(filters.sourcesFilters).toEqual([]);
    expect(filters.sdgFilters).toEqual([]);
    expect(filters.languageFilters).toEqual([]);
    expect(wrapper.find('.remove-all').exists()).toBe(false);
  });
});

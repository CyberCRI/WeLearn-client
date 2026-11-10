import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ColumnTemplate from '../ColumnTemplate.vue';

describe('ColumnTemplate', () => {
  it('closes and reopens the right panel from the toggle button', async () => {
    const wrapper = mount(ColumnTemplate, {
      slots: { 'right-panel': '<p class="content">filters</p>' },
      // keep the teleported tooltip inside the wrapper
      global: { stubs: { teleport: true } }
    });
    const toggle = wrapper.get('button.sidebar-toggle');

    expect(wrapper.get('.right').classes()).toContain('opened');
    expect(toggle.attributes('aria-expanded')).toBe('true');
    expect(wrapper.get('.tooltip').text()).toBe('closeSidebar');

    await toggle.trigger('click');
    expect(wrapper.get('.right').classes()).not.toContain('opened');
    expect(toggle.attributes('aria-expanded')).toBe('false');
    expect(wrapper.get('.tooltip').text()).toBe('openSidebar');

    await toggle.trigger('click');
    expect(wrapper.get('.right').classes()).toContain('opened');
  });
});

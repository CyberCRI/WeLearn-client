import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ColumnTemplate from '../ColumnTemplate.vue';
import SidePanelIcon from '../icons/SidePanelIcon.vue';

describe('ColumnTemplate', () => {
  it('closes and reopens the right panel from the side panel icon', async () => {
    const wrapper = mount(ColumnTemplate, {
      slots: { 'right-panel': '<p class="content">filters</p>' }
    });

    expect(wrapper.get('.right').classes()).toContain('opened');
    expect(wrapper.get('.tooltip').text()).toBe('closeSidebar');

    await wrapper.findComponent(SidePanelIcon).trigger('click');
    expect(wrapper.get('.right').classes()).not.toContain('opened');
    expect(wrapper.get('.tooltip').text()).toBe('openSidebar');

    await wrapper.findComponent(SidePanelIcon).trigger('click');
    expect(wrapper.get('.right').classes()).toContain('opened');
  });
});

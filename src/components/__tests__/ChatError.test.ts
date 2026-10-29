import { describe, it, expect, vi, afterEach } from 'vitest';

import { mount } from '@vue/test-utils';
import ChatError from '../ChatError.vue';

describe('ChatError', () => {
  it('renders properly', () => {
    const wrapper = mount(ChatError);
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.text()).toContain('chatError');
  });

  describe('reload', () => {
    const originalLocation = window.location;

    afterEach(() => {
      Object.defineProperty(window, 'location', { value: originalLocation, configurable: true });
    });

    it('reloads the page when the button is clicked', async () => {
      const reload = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { ...originalLocation, reload },
        configurable: true
      });
      const wrapper = mount(ChatError);

      await wrapper.get('button').trigger('click');

      expect(reload).toHaveBeenCalledOnce();
    });
  });
});

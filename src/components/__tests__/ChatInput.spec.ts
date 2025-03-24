import { describe, it, expect, beforeEach } from 'vitest';

import { mount } from '@vue/test-utils';
import ChatInputVue from '../ChatInput.vue';
import { createPinia, setActivePinia } from 'pinia';

describe('ChatInput', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  it('renders properly', () => {
    const wrapper = mount(ChatInputVue, {
      propsData: {
        action: (arg: string) => arg
      }
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('contains a text input', () => {
    const wrapper = mount(ChatInputVue, {
      propsData: {
        action: (arg: string) => arg
      }
    });
    expect(wrapper.find('textarea').exists()).toBe(true);
  });

  it('contains has placeholder set', () => {
    const wrapper = mount(ChatInputVue, {
      propsData: {
        action: (arg: string) => arg
      }
    });
    expect(wrapper.find('textarea').attributes('placeholder')).toBe('chatInputPlaceholder');
  });
});

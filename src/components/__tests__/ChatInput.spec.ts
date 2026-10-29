import { describe, it, expect, beforeEach, vi } from 'vitest';

import { mount } from '@vue/test-utils';
import ChatInputVue from '../ChatInput.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useChatStore } from '@/stores/chat';
import SendIcon from '../icons/SendIcon.vue';

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

  it('sends the input on enter, clears it and prevents the newline', async () => {
    const action = vi.fn();
    const store = useChatStore();
    const wrapper = mount(ChatInputVue, { props: { action } });
    const textarea = wrapper.get('textarea');

    await textarea.setValue('What is SDG 13?');
    const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    textarea.element.dispatchEvent(event);
    await wrapper.vm.$nextTick();

    expect(action).toHaveBeenCalledWith('What is SDG 13?');
    expect(store.chatInput).toBe('');
    expect(event.defaultPrevented).toBe(true);
  });

  it('sends the input when the send icon is clicked', async () => {
    const action = vi.fn();
    const store = useChatStore();
    store.chatInput = 'a question';
    const wrapper = mount(ChatInputVue, { props: { action } });

    await wrapper.findComponent(SendIcon).trigger('click');

    expect(action).toHaveBeenCalledWith('a question');
    expect(store.chatInput).toBe('');
  });

  it('does not send an input made only of blanks and newlines', async () => {
    const action = vi.fn();
    const store = useChatStore();
    store.chatInput = '  \n\r\n ';
    const wrapper = mount(ChatInputVue, { props: { action } });

    await wrapper.findComponent(SendIcon).trigger('click');

    expect(action).not.toHaveBeenCalled();
    expect(store.chatInput).toBe('  \n\r\n ');
  });

  it('copies the typed text to the wrapper so the textarea can grow', async () => {
    const wrapper = mount(ChatInputVue, { props: { action: vi.fn() } });

    await wrapper.get('textarea').setValue('line 1\nline 2');

    expect((wrapper.get('.grow-wrap').element as HTMLElement).dataset.replicatedValue).toBe(
      'line 1\nline 2'
    );
  });
});

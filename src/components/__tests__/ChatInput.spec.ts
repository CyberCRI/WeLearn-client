import { describe, it, expect, beforeEach, vi } from 'vitest';

import { flushPromises, mount } from '@vue/test-utils';
import ChatInputVue from '../ChatInput.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useChatStore, CHAT_STATUS } from '@/stores/chat';
import { useGuestQuotaStore } from '@/stores/guestQuota';
import SendIcon from '../icons/SendIcon.vue';

describe('ChatInput', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  it('renders properly', () => {
    const wrapper = mount(ChatInputVue, {
      propsData: {
        action: () => true
      }
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('contains a text input', () => {
    const wrapper = mount(ChatInputVue, {
      propsData: {
        action: () => true
      }
    });
    expect(wrapper.find('textarea').exists()).toBe(true);
  });

  it('contains has placeholder set', () => {
    const wrapper = mount(ChatInputVue, {
      propsData: {
        action: () => true
      }
    });
    expect(wrapper.find('textarea').attributes('placeholder')).toBe('chatInputPlaceholder');
  });

  const pressEnter = (textarea: Element) => {
    const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    textarea.dispatchEvent(event);
    return event;
  };
  const replicatedValue = (wrapper: ReturnType<typeof mount>) =>
    (wrapper.get('.grow-wrap').element as HTMLElement).dataset.replicatedValue;

  it('sends the input on enter, clears it and prevents the newline', async () => {
    const action = vi.fn().mockReturnValue(true);
    const store = useChatStore();
    const wrapper = mount(ChatInputVue, { props: { action } });
    const textarea = wrapper.get('textarea');

    await textarea.setValue('What is SDG 13?');
    const event = pressEnter(textarea.element);
    await flushPromises();

    expect(action).toHaveBeenCalledWith('What is SDG 13?');
    expect(store.chatInput).toBe('');
    expect(event.defaultPrevented).toBe(true);
  });

  it('sends the input when the send button is clicked', async () => {
    const action = vi.fn().mockReturnValue(true);
    const store = useChatStore();
    store.chatInput = 'a question';
    const wrapper = mount(ChatInputVue, { props: { action } });

    await wrapper.get('button').trigger('click');

    expect(action).toHaveBeenCalledWith('a question');
    expect(store.chatInput).toBe('');
  });

  it('renders the send icon in a labelled button', () => {
    const wrapper = mount(ChatInputVue, { props: { action: vi.fn() } });
    const button = wrapper.get('button');

    expect(button.attributes('type')).toBe('button');
    expect(button.attributes('aria-label')).toBe('chatSendButton');
    expect(button.findComponent(SendIcon).exists()).toBe(true);
    expect(wrapper.get('textarea').attributes('aria-label')).toBe('chatInputLabel');
  });

  it('does not send an input made only of blanks and newlines', async () => {
    const action = vi.fn();
    const store = useChatStore();
    store.chatInput = '  \n\r\n ';
    const wrapper = mount(ChatInputVue, { props: { action } });

    expect(wrapper.get('button').attributes()).toHaveProperty('disabled');
    pressEnter(wrapper.get('textarea').element);
    await flushPromises();

    expect(action).not.toHaveBeenCalled();
    expect(store.chatInput).toBe('  \n\r\n ');
  });

  describe('while an answer streams', () => {
    let store: ReturnType<typeof useChatStore>;
    beforeEach(() => {
      store = useChatStore();
      store.chatStatus = CHAT_STATUS.SEARCHED;
    });

    it('lets the user type the next question', async () => {
      const wrapper = mount(ChatInputVue, { props: { action: vi.fn() } });
      const textarea = wrapper.get('textarea');

      expect(textarea.attributes()).not.toHaveProperty('disabled');
      await textarea.setValue('next question');

      expect(store.chatInput).toBe('next question');
    });

    it('disables the send button', () => {
      store.chatInput = 'next question';
      const wrapper = mount(ChatInputVue, { props: { action: vi.fn() } });

      expect(wrapper.get('button').attributes()).toHaveProperty('disabled');
    });

    it('keeps the text and does not send on enter or click', async () => {
      const sendSpy = vi.spyOn(store, 'onSendMessage');
      const action = vi.fn((question: string) => store.onSendMessage(question));
      store.chatInput = 'next question';
      const wrapper = mount(ChatInputVue, { props: { action } });

      const event = pressEnter(wrapper.get('textarea').element);
      await wrapper.get('button').trigger('click');
      await flushPromises();

      expect(event.defaultPrevented).toBe(true);
      expect(action).not.toHaveBeenCalled();
      expect(sendSpy).not.toHaveBeenCalled();
      expect(store.chatInput).toBe('next question');
    });
  });

  it('keeps the text when the question is refused', async () => {
    const action = vi.fn().mockReturnValue(false);
    const store = useChatStore();
    const wrapper = mount(ChatInputVue, { props: { action } });

    await wrapper.get('textarea').setValue('a question');
    await wrapper.get('button').trigger('click');
    await flushPromises();

    expect(action).toHaveBeenCalledWith('a question');
    expect(store.chatInput).toBe('a question');
    expect(replicatedValue(wrapper)).toBe('a question');
  });

  it('keeps the text when a guest has used up the quota', async () => {
    const quota = useGuestQuotaStore();
    vi.spyOn(quota, 'checkQuota').mockReturnValue(false);
    const store = useChatStore();
    const wrapper = mount(ChatInputVue, {
      props: { action: (question: string) => store.onSendMessage(question) }
    });

    await wrapper.get('textarea').setValue('one more question');
    pressEnter(wrapper.get('textarea').element);
    await flushPromises();

    expect(quota.checkQuota).toHaveBeenCalledWith('chat');
    expect(store.chatMessagesList).toEqual([]);
    expect(store.chatInput).toBe('one more question');
    expect(replicatedValue(wrapper)).toBe('one more question');
  });

  it('clears the text at once when an async action accepts it', async () => {
    let settle: (isAccepted: boolean) => void = () => {};
    const action = vi.fn(() => new Promise<boolean>((resolve) => (settle = resolve)));
    const store = useChatStore();
    const wrapper = mount(ChatInputVue, { props: { action } });

    await wrapper.get('textarea').setValue('a question');
    await wrapper.get('button').trigger('click');
    await flushPromises();
    // the answer still streams: the next question can be typed
    expect(store.chatInput).toBe('');
    await wrapper.get('textarea').setValue('next question');
    settle(true);
    await flushPromises();

    expect(store.chatInput).toBe('next question');
  });

  it('resets the textarea height after a send', async () => {
    const wrapper = mount(ChatInputVue, { props: { action: vi.fn().mockReturnValue(true) } });

    await wrapper.get('textarea').setValue('line 1\nline 2');
    expect(replicatedValue(wrapper)).toBe('line 1\nline 2');
    await wrapper.get('button').trigger('click');
    await flushPromises();

    expect(replicatedValue(wrapper)).toBe('');
  });

  it('copies the typed text to the wrapper so the textarea can grow', async () => {
    const wrapper = mount(ChatInputVue, { props: { action: vi.fn() } });

    await wrapper.get('textarea').setValue('line 1\nline 2');

    expect(replicatedValue(wrapper)).toBe('line 1\nline 2');
  });
});

import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ChatBuble from '@/components/ChatBuble.vue';

const mountBubble = (message: string, isUSer = false) =>
  mount(ChatBuble, {
    props: { message, isUSer, isLast: false, shouldDisable: false }
  });

describe('ChatBuble', () => {
  it('renders the answer markdown', () => {
    const wrapper = mountBubble('**bold** answer');
    expect(wrapper.find('.chat-bubble-content strong').text()).toBe('bold');
  });

  it('drops event handlers injected in an answer', () => {
    const wrapper = mountBubble('Look <img src=x onerror="alert(1)"> here');
    const img = wrapper.find('.chat-bubble-content img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('onerror')).toBeUndefined();
  });

  it('opens answer links in a new tab', () => {
    const link = mountBubble('[paper](https://example.org)').find('.chat-bubble-content a');
    expect(link.attributes('target')).toBe('_blank');
    expect(link.attributes('rel')).toContain('noopener');
  });

  it('shows a user message as typed, without rendering html or markdown', () => {
    const wrapper = mountBubble('<b>hi</b> **there**', true);
    const content = wrapper.find('.chat-bubble-content');
    expect(content.find('b').exists()).toBe(false);
    expect(content.find('strong').exists()).toBe(false);
    expect(content.text()).toBe('<b>hi</b> **there**');
  });
});

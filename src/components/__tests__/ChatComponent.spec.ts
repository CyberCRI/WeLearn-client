import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ChatComponent from '@/components/ChatComponent.vue';
import ChatInput from '@/components/ChatInput.vue';
import ChatEmptyContent from '@/components/ChatEmptyContent.vue';
import { useChatStore, CHAT_STATUS } from '@/stores/chat';

const mountChat = () =>
  mount(ChatComponent, { global: { stubs: { ChatInput: true, ChatBuble: true } } });

describe('ChatComponent', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('sending a message', () => {
    let store: ReturnType<typeof useChatStore>;
    beforeEach(() => {
      store = useChatStore();
      vi.spyOn(store, 'onSendMessage').mockResolvedValue(undefined);
    });

    it('sends what is typed in the input', () => {
      const wrapper = mountChat();
      wrapper.findComponent(ChatInput).props('action')('typed');
      expect(store.onSendMessage).toHaveBeenCalledWith('typed');
    });

    it('sends a default message from the empty state', () => {
      const wrapper = mountChat();
      wrapper.findComponent(ChatEmptyContent).props('action')('default');
      expect(store.onSendMessage).toHaveBeenCalledWith('default');
    });

    it('sends a suggested question when its pill is clicked', async () => {
      const wrapper = mountChat();
      // the suggestions are drawn on mount
      await wrapper.vm.$nextTick();
      const pill = wrapper.find('.queues-wrapper .card');
      await pill.trigger('click');
      expect(store.onSendMessage).toHaveBeenCalledWith(pill.text(), true);
    });
  });

  describe('clearing the chat', () => {
    let store: ReturnType<typeof useChatStore>;
    beforeEach(() => {
      store = useChatStore();
      store.chatStatus = CHAT_STATUS.DONE;
      store.chatMessagesList = [{ role: 'user', content: 'hello' }];
    });

    const openConfirm = async () => {
      const wrapper = mountChat();
      expect(wrapper.find('.modal').exists()).toBe(false);
      await wrapper.find('.chat-toolbar button').trigger('click');
      expect(wrapper.find('.modal.is-active').exists()).toBe(true);
      return wrapper;
    };

    it('asks for confirmation, then cancels', async () => {
      const wrapper = await openConfirm();
      await wrapper.find('.modal .buttons .button:not(.is-danger)').trigger('click');
      expect(wrapper.find('.modal').exists()).toBe(false);
      expect(store.chatMessagesList).toHaveLength(1);
    });

    it('closes the confirmation with the close button', async () => {
      const wrapper = await openConfirm();
      await wrapper.find('[data-testid="close"]').trigger('click');
      expect(wrapper.find('.modal').exists()).toBe(false);
      expect(store.chatMessagesList).toHaveLength(1);
    });

    it('resets the chat once confirmed', async () => {
      const reset = vi.spyOn(store, '$reset');
      const wrapper = await openConfirm();
      await wrapper.find('.modal .is-danger').trigger('click');
      expect(reset).toHaveBeenCalledTimes(1);
      expect(store.chatMessagesList).toHaveLength(0);
      expect(wrapper.find('.modal').exists()).toBe(false);
    });
  });

  it('scrolls to the sources from the phone link', async () => {
    const store = useChatStore();
    store.chatStatus = CHAT_STATUS.DONE;
    store.chatMessagesList = [{ role: 'user', content: 'hello' }];
    // ponytail: only the sources length matters here, not the document shape
    store.sourcesList = [{ id: 'doc' }] as unknown as typeof store.sourcesList;
    const anchor = document.createElement('div');
    anchor.id = 'sourcesAnchor';
    anchor.scrollIntoView = vi.fn();
    document.body.appendChild(anchor);

    const wrapper = mountChat();
    await wrapper.find('.sourcesListLink').trigger('click');
    expect(anchor.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });
});

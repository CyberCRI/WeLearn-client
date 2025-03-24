import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import QandAVue from '@/views/QandA.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useChatStore } from '@/stores/chat';

describe('QandA', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders properly', () => {
    const wrapper = mount(QandAVue);
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should render the reformulated query', () => {
    const chatStore = useChatStore();
    chatStore.setReformulatedQuery('I am the reformulated query');

    const wrapper = mount(QandAVue);

    expect(wrapper.text()).toContain('I am the reformulated query');
  });
});

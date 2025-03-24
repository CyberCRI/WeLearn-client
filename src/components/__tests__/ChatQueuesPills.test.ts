import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ChatQueuesPills from '../ChatQueuesPills.vue';

describe('CheckboxCompnentVue', () => {
  it('renders properly', () => {
    const wrapper = mount(ChatQueuesPills, {
      propsData: {
        messageList: ['i am a question 1', 'i am a question 2'],
        action: (arg: string) => arg,
        shouldDisable: false
      }
    });
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.text()).toContain('i am a question 1');
    expect(wrapper.findAll('.card')).toHaveLength(2);
  });

  it('should the questions with disabled class', () => {
    const wrapper = mount(ChatQueuesPills, {
      propsData: {
        messageList: ['i am a question 1', 'i am a question 2'],
        action: (arg: string) => arg,
        shouldDisable: true
      }
    });
    expect(wrapper.findAll('.disabled')).toHaveLength(1);
  });
});

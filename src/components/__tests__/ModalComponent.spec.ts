import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ModalComponent from '@/components/ModalComponent.vue';

describe('ModalComponent', () => {
  it('shows the message as text, never as html', () => {
    const wrapper = mount(ModalComponent, {
      props: { isOpen: true, title: 'title', message: '<img src=x onerror="alert(1)">' }
    });
    const message = wrapper.find('.subtitle');
    expect(message.find('img').exists()).toBe(false);
    expect(message.text()).toBe('<img src=x onerror="alert(1)">');
  });
});

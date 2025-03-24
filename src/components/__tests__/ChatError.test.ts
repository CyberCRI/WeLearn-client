import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import ChatError from '../ChatError.vue';

describe('ChatError', () => {
  it('renders properly', () => {
    const wrapper = mount(ChatError);
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.text()).toContain('Oops something wrong hapened. Please try again later.');
  });
});

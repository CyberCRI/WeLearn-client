import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import UserAvatar from '../UserAvatar.vue';

describe('UserAvatar', () => {
  it('renders properly', () => {
    const wrapper = mount(UserAvatar);
    expect(wrapper.element).toMatchSnapshot();
  });
});

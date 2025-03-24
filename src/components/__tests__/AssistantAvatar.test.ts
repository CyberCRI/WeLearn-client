import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import AssistantAvatar from '../AssistantAvatar.vue';

describe('AssistantAvatar', () => {
  it('renders properly', () => {
    const wrapper = mount(AssistantAvatar);
    expect(wrapper.element).toMatchSnapshot();
  });
});

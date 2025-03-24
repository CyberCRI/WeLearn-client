import { describe, it, expect } from 'vitest';

import router from '@/router';

import { shallowMount } from '@vue/test-utils';
import AppHeader from '../AppHeader.vue';

const mountOptions = {
  global: {
    plugins: [router]
  }
};

describe('AppHeader', () => {
  it('renders properly', () => {
    const wrapper = shallowMount(AppHeader, mountOptions);
    expect(wrapper.element).toMatchSnapshot();
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import router from '@/router';

import { shallowMount } from '@vue/test-utils';
import AppHeader from '../AppHeader.vue';

const mountOptions = {
  global: {
    plugins: [router]
  }
};

describe('AppHeader', () => {
  // the router guard reads the auth store on the first navigation
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders properly', () => {
    const wrapper = shallowMount(AppHeader, mountOptions);
    expect(wrapper.element).toMatchSnapshot();
  });
});

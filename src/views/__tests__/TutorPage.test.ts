import { describe, it, expect, beforeEach } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import TutorPage from '../TutorPage.vue';
import { createPinia, setActivePinia } from 'pinia';

describe('TutorPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  it('renders properly', () => {
    const wrapper = shallowMount(TutorPage);
    expect(wrapper.element).toMatchSnapshot();
  });
});

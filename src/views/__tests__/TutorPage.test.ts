import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TutorPage from '../TutorPage.vue';
import { createPinia, setActivePinia } from 'pinia';

describe('TutorPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  it('renders properly', () => {
    const wrapper = mount(TutorPage);
    expect(wrapper.element).toMatchSnapshot();
  });
});

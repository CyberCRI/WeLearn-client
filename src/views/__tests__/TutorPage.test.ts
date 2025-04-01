import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import TutorPage from '../TutorPage.vue';

describe('TutorPage', () => {
  it('renders properly', () => {
    const wrapper = shallowMount(TutorPage);
    expect(wrapper.element).toMatchSnapshot();
  });
});

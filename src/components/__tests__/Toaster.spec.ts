import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ToasterComponentVue from '../ToasterComponent.vue';

describe('ToasterComponent', () => {
  it('renders properly', () => {
    const wrapper = mount(ToasterComponentVue, {
      propsData: {
        description: 'Oops something wrong hapened. Please try again later.',
        level: 'error',
        title: 'Error'
      }
    });
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.text()).toContain('Oops something wrong hapened. Please try again later.');
  });
});

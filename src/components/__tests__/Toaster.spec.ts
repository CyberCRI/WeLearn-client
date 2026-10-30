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

  it('renders the given heading level and extra content', () => {
    const wrapper = mount(ToasterComponentVue, {
      props: { title: 'Error', headingTag: 'h2' },
      slots: { default: '<button>Retry</button>' }
    });
    expect(wrapper.find('h1').exists()).toBe(false);
    expect(wrapper.get('h2').text()).toBe('Error');
    expect(wrapper.get('button').text()).toBe('Retry');
  });
});

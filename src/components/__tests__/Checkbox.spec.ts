import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CheckboxCompnentVue from '../CheckboxCompnent.vue';

describe('CheckboxCompnentVue', () => {
  it('renders properly', () => {
    const wrapper = mount(CheckboxCompnentVue, {
      propsData: {
        label: 'i am a label',
        value: 'i am a value',
        id: 'i am an id',
        name: 'i am a name',
        modelValue: ['i am a modelValue'],
        checked: true
      }
    });
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.text()).toContain('i am a label');
  });
});

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

  const baseProps = {
    label: 'label',
    value: 'b',
    id: 'id',
    name: 'name',
    checked: false
  };

  it('emits the new model value and selectAll when ticked', async () => {
    const wrapper = mount(CheckboxCompnentVue, {
      props: { ...baseProps, modelValue: ['a'] }
    });

    await wrapper.get('input').setValue(true);

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a', 'b']]);
    expect(wrapper.emitted('selectAll')).toHaveLength(1);
  });

  it('emits the model value without its value when unticked', async () => {
    const wrapper = mount(CheckboxCompnentVue, {
      props: { ...baseProps, modelValue: ['a', 'b'], checked: true }
    });

    await wrapper.get('input').setValue(false);

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a']]);
    expect(wrapper.emitted('selectAll')).toHaveLength(1);
  });
});

import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ButtonComponent from '../ButtonComponent.vue';

describe('ButtonComponent', () => {
  it('keeps a discreet button without a color as a plain button, so its text stays visible', () => {
    const wrapper = mount(ButtonComponent, { props: { isDiscreet: true } });
    expect(wrapper.classes()).toEqual(['button']);
  });

  it('outlines a discreet button that has a color', () => {
    const wrapper = mount(ButtonComponent, { props: { isDiscreet: true, color: 'primary' } });
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['is-outlined', 'is-primary']));
  });

  it('fills a button that has a color and is not discreet', () => {
    const wrapper = mount(ButtonComponent, { props: { color: 'primary' } });
    expect(wrapper.classes()).toContain('is-primary');
    expect(wrapper.classes()).not.toContain('is-outlined');
  });
});

import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import TextInputComponent from '../TextInputComponent.vue';

const mountInput = (props: Record<string, unknown> = {}) =>
  mount(TextInputComponent, {
    props: { id: 'email', label: 'Email', ...props },
    attachTo: document.body
  });

describe('TextInputComponent', () => {
  it('ties the label to the input', () => {
    const wrapper = mountInput();

    expect(wrapper.get('label').attributes('for')).toBe('email');
    expect(wrapper.get('input').attributes('id')).toBe('email');
    expect(wrapper.get('input').attributes('aria-invalid')).toBeUndefined();
    expect(wrapper.get('input').attributes('aria-describedby')).toBeUndefined();
  });

  it('marks a required field for assistive technologies, the asterisk only visually', () => {
    const wrapper = mountInput({ required: true, autocomplete: 'email' });

    const input = wrapper.get('input');
    expect(input.attributes('required')).toBeDefined();
    expect(input.attributes('aria-required')).toBe('true');
    expect(input.attributes('autocomplete')).toBe('email');
    expect(wrapper.get('label span').attributes('aria-hidden')).toBe('true');
  });

  it('describes the input with its hint and error', () => {
    const wrapper = mountInput({ hint: 'name@example.org', error: 'Invalid email' });

    const input = wrapper.get('input');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-describedby')).toBe('email-hint email-error');
    expect(input.classes()).toContain('is-danger');
    expect(wrapper.get('#email-error').text()).toBe('Invalid email');
    expect(wrapper.get('#email-hint').text()).toBe('name@example.org');
  });

  it('emits the typed value and blur', async () => {
    const wrapper = mountInput();

    await wrapper.get('input').setValue('ada@test.org');
    await wrapper.get('input').trigger('blur');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['ada@test.org']);
    expect(wrapper.emitted('blur')).toHaveLength(1);
  });

  it('shows the icon slot hidden from screen readers', () => {
    const wrapper = mount(TextInputComponent, {
      props: { id: 'email', label: 'Email' },
      slots: { icon: '<svg class="test-icon" />' }
    });

    expect(wrapper.get('.control').classes()).toContain('has-icons-left');
    expect(wrapper.get('.icon').attributes('aria-hidden')).toBe('true');
  });

  it('can be focused by its parent', () => {
    const wrapper = mountInput();

    (wrapper.vm as unknown as { focus: () => void }).focus();

    expect(document.activeElement).toBe(wrapper.get('input').element);
    wrapper.unmount();
  });
});

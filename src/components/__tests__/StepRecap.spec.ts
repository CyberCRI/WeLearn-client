import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import StepRecap from '@/components/tutor/StepRecap.vue';

describe('StepRecap', () => {
  it('folds a step into its title and details, with a way back into it', async () => {
    const wrapper = mount(StepRecap, { props: { title: 'Ecology', details: '2 topics' } });
    expect(wrapper.find('.title-text').text()).toBe('Ecology');
    expect(wrapper.find('.details').classes()).toContain('after-title');
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('edit')).toHaveLength(1);
  });

  it('can show details alone', () => {
    const wrapper = mount(StepRecap, { props: { details: '1 connection kept' } });
    expect(wrapper.find('.title-text').exists()).toBe(false);
    expect(wrapper.find('.details').classes()).not.toContain('after-title');
  });
});

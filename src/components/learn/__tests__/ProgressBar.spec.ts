import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ProgressBar from '../ProgressBar.vue';

describe('ProgressBar', () => {
  it('emits select only for finished steps when clickable', async () => {
    const wrapper = mount(ProgressBar, {
      props: { currentStep: 2, progress: 50, clickable: true }
    });
    const steps = wrapper.findAll('.step');

    await steps[1].trigger('click');
    await steps[2].trigger('click');
    await steps[3].trigger('click');

    expect(wrapper.emitted('select')).toEqual([[1]]);
    expect(steps[1].classes()).toContain('clickable');
    expect(steps[2].classes()).toContain('active');
  });

  it('reopens any reached step and keeps skipped ones unchecked', async () => {
    const wrapper = mount(ProgressBar, {
      props: {
        currentStep: 1,
        reached: 3,
        skipped: [2],
        labels: ['A', 'B', 'C', 'D', 'E'],
        progress: 25,
        clickable: true
      }
    });
    const steps = wrapper.findAll('.step');

    await steps[3].trigger('click');
    await steps[4].trigger('click');

    expect(wrapper.emitted('select')).toEqual([[3]]);
    expect(steps[0].classes()).toContain('done');
    expect(steps[2].classes()).toEqual(expect.arrayContaining(['skipped', 'clickable']));
    expect(steps[2].find('.check').exists()).toBe(false);
  });

  it('never emits select when not clickable', async () => {
    const wrapper = mount(ProgressBar, {
      props: { currentStep: 2, progress: 50, labels: ['One', 'Two', 'Three'] }
    });

    await wrapper.findAll('.step')[0].trigger('click');

    expect(wrapper.emitted('select')).toBeUndefined();
    expect(wrapper.findAll('.label').map((label) => label.text())).toEqual(['One', 'Two', 'Three']);
    expect(wrapper.get('.progress-fill').attributes('style')).toContain('width: 50%');
  });
});

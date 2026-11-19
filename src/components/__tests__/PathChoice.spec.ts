import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PathChoice from '@/components/tutor/PathChoice.vue';

describe('PathChoice', () => {
  it('asks whether the teacher already has a course', async () => {
    const wrapper = mount(PathChoice, { props: { path: null, hasStarted: false } });
    expect(wrapper.find('h1').text()).toBe('tutor.start.question');
    await wrapper.find('[data-testid="option-existing"]').trigger('click');
    await wrapper.find('[data-testid="option-scratch"]').trigger('click');
    expect(wrapper.emitted('choose')).toEqual([['existing'], ['scratch']]);
  });

  it('folds the answer into one line', () => {
    const existing = mount(PathChoice, { props: { path: 'existing', hasStarted: false } });
    expect(existing.find('[data-testid="chosen-path"]').text()).toContain('tutor.start.working');
    const scratch = mount(PathChoice, { props: { path: 'scratch', hasStarted: false } });
    expect(scratch.find('[data-testid="chosen-path"]').text()).toContain('tutor.start.workingNew');
  });

  it('changes path at once when nothing was added yet', async () => {
    const wrapper = mount(PathChoice, { props: { path: 'existing', hasStarted: false } });
    await wrapper.find('[data-testid="change-path"]').trigger('click');
    expect(wrapper.emitted('reset')).toHaveLength(1);
  });

  it('warns before discarding work, and can keep working', async () => {
    const wrapper = mount(PathChoice, { props: { path: 'existing', hasStarted: true } });
    await wrapper.find('[data-testid="change-path"]').trigger('click');
    expect(wrapper.find('[data-testid="discard-change"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('tutor.start.changeWarning');
    expect(wrapper.emitted('reset')).toBeUndefined();

    await wrapper.find('[data-testid="keep-working"]').trigger('click');
    expect(wrapper.find('[data-testid="discard-change"]').exists()).toBe(false);

    await wrapper.find('[data-testid="change-path"]').trigger('click');
    await wrapper.find('[data-testid="discard-change"]').trigger('click');
    expect(wrapper.emitted('reset')).toHaveLength(1);
  });
});

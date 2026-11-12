import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PathChoice from '@/components/tutor/PathChoice.vue';

describe('PathChoice', () => {
  it('asks whether the teacher already has a course', async () => {
    const wrapper = mount(PathChoice, { props: { path: null, hasStarted: false } });
    expect(wrapper.find('h1').text()).toBe('tutor.start.question');
    expect(wrapper.find('[data-testid="option-existing"]').text()).toContain('tutor.start.yesHint');
    expect(
      wrapper.find('[data-testid="option-scratch"] [data-testid="option-status"]').text()
    ).toBe('tutor.start.inDevelopment');
    await wrapper.find('[data-testid="option-existing"]').trigger('click');
    await wrapper.find('[data-testid="option-scratch"]').trigger('click');
    expect(wrapper.emitted('choose')).toEqual([['existing'], ['scratch']]);
  });

  it('folds the answer into one line', () => {
    const existing = mount(PathChoice, { props: { path: 'existing', hasStarted: false } });
    expect(existing.find('[data-testid="change-path"]').text()).toContain('tutor.start.back');
    const scratch = mount(PathChoice, { props: { path: 'scratch', hasStarted: false } });
    expect(scratch.find('[data-testid="chosen-path"]').text()).toContain('tutor.start.workingNew');
  });

  it('says the new-course path is still being built', () => {
    const scratch = mount(PathChoice, { props: { path: 'scratch', hasStarted: false } });
    expect(scratch.find('[data-testid="scratch-status"]').text()).toBe('tutor.start.newInProgress');
    const existing = mount(PathChoice, { props: { path: 'existing', hasStarted: false } });
    expect(existing.find('[data-testid="scratch-status"]').exists()).toBe(false);
  });

  it('changes path at once when nothing was added yet', async () => {
    const wrapper = mount(PathChoice, { props: { path: 'existing', hasStarted: false } });
    await wrapper.find('[data-testid="change-path"]').trigger('click');
    expect(wrapper.emitted('reset')).toHaveLength(1);
  });

  it('words the warning for going back on the adapt path, and for changing on the create path', async () => {
    const existing = mount(PathChoice, { props: { path: 'existing', hasStarted: true } });
    await existing.find('[data-testid="change-path"]').trigger('click');
    expect(existing.find('[data-testid="change-warning"]').text()).toContain(
      'tutor.start.backWarning'
    );
    expect(existing.find('[data-testid="discard-change"]').text()).toBe('tutor.start.discardBack');

    const scratch = mount(PathChoice, { props: { path: 'scratch', hasStarted: true } });
    await scratch.find('[data-testid="change-path"]').trigger('click');
    expect(scratch.find('[data-testid="change-warning"]').text()).toContain(
      'tutor.start.changeWarning'
    );
    expect(scratch.find('[data-testid="scratch-status"]').exists()).toBe(false);
  });

  it('warns before discarding work, and can keep working', async () => {
    const wrapper = mount(PathChoice, { props: { path: 'existing', hasStarted: true } });
    await wrapper.find('[data-testid="change-path"]').trigger('click');
    expect(wrapper.find('[data-testid="change-warning"]').exists()).toBe(true);
    expect(wrapper.emitted('reset')).toBeUndefined();

    await wrapper.find('[data-testid="keep-working"]').trigger('click');
    expect(wrapper.find('[data-testid="change-warning"]').exists()).toBe(false);

    await wrapper.find('[data-testid="change-path"]').trigger('click');
    await wrapper.find('[data-testid="discard-change"]').trigger('click');
    expect(wrapper.emitted('reset')).toHaveLength(1);
  });
});

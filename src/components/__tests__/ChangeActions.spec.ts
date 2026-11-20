import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ChangeActions from '@/components/tutor/development/ChangeActions.vue';
import { exists, text } from './developmentFixtures';

describe('ChangeActions', () => {
  it('offers to accept, edit or skip a pending change', async () => {
    const wrapper = mount(ChangeActions, { props: { decision: 'pending', isRevision: false } });
    expect(text(wrapper, 'keep-original')).toBe('tutor.additions.change.skip');

    await wrapper.find('[data-testid="accept-change"]').trigger('click');
    await wrapper.find('[data-testid="edit-change"]').trigger('click');
    await wrapper.find('[data-testid="keep-original"]').trigger('click');
    expect(Object.keys(wrapper.emitted())).toEqual(
      expect.arrayContaining(['accept', 'edit', 'keep'])
    );
    expect(exists(wrapper, 'reconsider')).toBe(false);
  });

  it('keeps the original of a revised objective', () => {
    const wrapper = mount(ChangeActions, { props: { decision: 'pending', isRevision: true } });
    expect(text(wrapper, 'keep-original')).toBe('tutor.additions.change.keepOriginal');
  });

  it('says the decision, with a way back', async () => {
    const wrapper = mount(ChangeActions, { props: { decision: 'accepted', isRevision: false } });
    expect(text(wrapper, 'change-accepted')).toContain('tutor.additions.change.accepted');
    expect(exists(wrapper, 'accept-change')).toBe(false);

    await wrapper.setProps({ decision: 'kept' });
    expect(text(wrapper, 'change-kept')).toBe('tutor.additions.change.skipped');
    await wrapper.setProps({ isRevision: true });
    expect(text(wrapper, 'change-kept')).toBe('tutor.additions.change.kept');

    await wrapper.find('[data-testid="reconsider"]').trigger('click');
    expect(wrapper.emitted('reconsider')).toHaveLength(1);
  });
});

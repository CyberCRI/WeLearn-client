import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ConnectionDevelopment from '@/components/tutor/development/ConnectionDevelopment.vue';
import type { Development } from '@/stores/connections';
import { exists, seedConnection, seedCourse, text } from '@/__tests__/coursePathFixtures';

vi.mock('@/utils/fetch', () => ({ basePostAxios: vi.fn() }));

const mountWith = (dev: Partial<Development> = {}) => {
  const store = seedConnection(dev);
  const wrapper = mount(ConnectionDevelopment, {
    props: { connection: store.connections[0] }
  });
  return { store, wrapper };
};

describe('ConnectionDevelopment', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    seedCourse();
  });

  it('says WeLearn is preparing the change, then why it failed, with a retry', async () => {
    const { store, wrapper } = mountWith({ status: 'thinking', proposal: null });
    expect(wrapper.find('[role="status"]').text()).toBe('tutor.additions.change.thinking');

    const develop = vi.spyOn(store, 'develop').mockResolvedValue();
    store.connections[0].development!.status = 'busy';
    await wrapper.vm.$nextTick();
    expect(text(wrapper, 'development-problem')).toBe('tutor.additions.change.busy');
    await wrapper.find('[data-testid="retry-develop"]').trigger('click');
    expect(develop).toHaveBeenCalledWith('idea-1');

    // how long to wait, when the API said
    store.connections[0].development!.retryAfter = 12;
    await wrapper.vm.$nextTick();
    expect(text(wrapper, 'development-problem')).toBe('tutor.additions.change.busyFor');
  });

  it('shows where it goes, the wording, why, and how well it is supported', () => {
    const { wrapper } = mountWith();
    expect(text(wrapper, 'placement-part')).toBe('GDP');
    expect(text(wrapper, 'change-text')).toBe('Add the ecological footprint next to GDP.');
    expect(text(wrapper, 'change-why')).toBe('GDP ignores the environment.');
    expect(exists(wrapper, 'support-strong')).toBe(true);
    // no notes, nothing folded for them
    expect(exists(wrapper, 'pedagogical-notes')).toBe(false);
  });

  it('accepts, edits before accepting, skips, and undoes', async () => {
    const { store, wrapper } = mountWith();
    const development = () => store.connections[0].development!;

    await wrapper.find('[data-testid="accept-change"]').trigger('click');
    expect(development().decision).toBe('accepted');
    expect(exists(wrapper, 'change-accepted')).toBe(true);
    await wrapper.find('[data-testid="reconsider"]').trigger('click');
    expect(development().decision).toBe('pending');

    await wrapper.find('[data-testid="edit-change"]').trigger('click');
    expect(exists(wrapper, 'accept-change')).toBe(false);
    await wrapper.find('textarea').setValue('My own wording.');
    await wrapper.find('[data-testid="save-change"]').trigger('click');
    expect(development()).toMatchObject({ decision: 'accepted', edited: 'My own wording.' });
    expect(text(wrapper, 'change-text')).toBe('My own wording.');
    expect(exists(wrapper, 'change-edited')).toBe(true);

    await wrapper.find('[data-testid="reconsider"]').trigger('click');
    await wrapper.find('[data-testid="edit-change"]').trigger('click');
    await wrapper.find('[data-testid="cancel-edit"]').trigger('click');
    expect(exists(wrapper, 'change-editor')).toBe(false);
    await wrapper.find('[data-testid="keep-original"]').trigger('click');
    expect(development().decision).toBe('kept');
    expect(text(wrapper, 'change-kept')).toBe('tutor.additions.change.skipped');
  });
});

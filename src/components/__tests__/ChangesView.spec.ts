import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ChangesView from '@/components/tutor/updated/ChangesView.vue';
import { proposal, seedAccepted, seedCourse } from '@/__tests__/coursePathFixtures';

vi.mock('@/utils/fetch', () => ({ basePostAxios: vi.fn() }));

describe('ChangesView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    seedCourse();
  });

  it('groups the changes in the course order, the unplaced last, each its full card', async () => {
    const store = seedAccepted(
      proposal({ kind: 'assessment', original: null }),
      proposal({ kind: 'topic', original: 'GDP' })
    );
    const wrapper = mount(ChangesView, { props: { changes: store.acceptedChanges } });
    const groups = wrapper.findAll('[data-testid="change-group"]');
    expect(groups.map((group) => group.find('h2').text())).toEqual([
      'GDP',
      'tutor.updated.placementUnknown'
    ]);
    expect(groups[0].find('.kind').text()).toContain('tutor.additions.change.kinds.topic');
    expect(groups[0].find('.kind').text()).toContain('Idea 2');

    // taken back here, it is taken back on its card too
    await groups[0].find('[data-testid="reconsider"]').trigger('click');
    expect(store.connections[1].development?.decision).toBe('pending');
  });
});

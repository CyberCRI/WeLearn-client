import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ChangePlacement from '@/components/tutor/development/ChangePlacement.vue';
import type { Development } from '@/stores/connections';
import { useCourseStore } from '@/stores/course';
import {
  exists,
  proposal,
  seedConnection,
  seedCourse,
  seedReading,
  text
} from './developmentFixtures';

vi.mock('@/utils/fetch', () => ({ basePostAxios: vi.fn() }));

const mountWith = (dev: Partial<Development> = {}) => {
  const store = seedConnection(dev);
  const wrapper = mount(ChangePlacement, { props: { connection: store.connections[0] } });
  return { store, wrapper };
};

describe('ChangePlacement', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    seedCourse();
  });

  it('names the objective a revision replaces, and keeps it in place', async () => {
    const { store, wrapper } = mountWith({
      proposal: proposal({ kind: 'objective', original: 'Use indicators.' })
    });
    expect(text(wrapper, 'change-original')).toContain('tutor.additions.change.revisesObjective');
    expect(text(wrapper, 'original-text')).toBe('Use indicators.');
    expect(exists(wrapper, 'choose-place')).toBe(false);
    expect(exists(wrapper, 'change-place')).toBe(false);

    // the objective was removed in step 2
    store.connections[0].development!.proposal = proposal({
      kind: 'objective',
      original: 'An objective no longer there.'
    });
    await wrapper.vm.$nextTick();
    expect(text(wrapper, 'placement-stale')).toBe('tutor.additions.change.staleObjective');
  });

  it('clamps a long original, whole on request', async () => {
    const long = 'Use indicators. '.repeat(20).trim();
    useCourseStore().courseObjectives = [{ value: long, origin: 'extracted' }];
    const { wrapper } = mountWith({ proposal: proposal({ kind: 'objective', original: long }) });
    expect(wrapper.find('[data-testid="original-text"]').classes()).toContain('is-clamped');
    await wrapper.find('[data-testid="toggle-original"]').trigger('click');
    expect(wrapper.find('[data-testid="original-text"]').classes()).not.toContain('is-clamped');
  });

  it('lets the teacher place an unplaced change, or move one, among the course parts', async () => {
    const { store, wrapper } = mountWith({
      proposal: proposal({ kind: 'assessment', original: null })
    });
    expect(exists(wrapper, 'not-placed')).toBe(true);
    const options = wrapper.findAll('[data-testid="choose-place"] option').map((o) => o.text());
    expect(options).toEqual([
      'tutor.additions.change.whereLabel',
      'GDP',
      'Measure',
      'Week 1 – GDP'
    ]);

    await wrapper.find('select').setValue('Measure');
    expect(store.connections[0].development!.placement).toBe('Measure');
    expect(text(wrapper, 'placement-part')).toBe('Measure');
    expect(exists(wrapper, 'choose-place')).toBe(false);

    await wrapper.find('[data-testid="change-place"]').trigger('click');
    await wrapper.find('select').setValue('GDP');
    expect(text(wrapper, 'placement-part')).toBe('GDP');
  });

  it('says a place no longer in the course, and lets the teacher choose another', async () => {
    const { wrapper } = mountWith({ proposal: proposal({ original: 'Removed topic' }) });
    expect(text(wrapper, 'placement-stale')).toBe('tutor.additions.change.stalePlace');
    expect(exists(wrapper, 'choose-place')).toBe(true);
    expect(exists(wrapper, 'change-place')).toBe(false);

    await wrapper.find('select').setValue('GDP');
    expect(exists(wrapper, 'placement-stale')).toBe(false);
  });

  it('says after which line of the syllabus the word document adds it, once its whole text is read', async () => {
    const { store, wrapper } = mountWith({ proposal: proposal({ original: 'GDP' }) });
    // no text: the course part only
    expect(exists(wrapper, 'placement-line')).toBe(false);

    seedReading();
    await wrapper.vm.$nextTick();
    expect(text(wrapper, 'placement-line')).toBe('tutor.additions.change.afterLine');

    // no single passage of the syllabus for it: at the end of the document
    store.placeChange('idea-1', 'Measure');
    await wrapper.vm.$nextTick();
    expect(text(wrapper, 'placement-line')).toBe('tutor.additions.change.atEnd');
  });

  it('says no line for a revised objective, or a text cut short', async () => {
    seedReading();
    const { wrapper } = mountWith({
      proposal: proposal({ kind: 'objective', original: 'Use indicators.' })
    });
    expect(exists(wrapper, 'placement-line')).toBe(false);

    const other = mountWith({ proposal: proposal({ original: 'GDP' }) });
    seedReading(undefined, true);
    await other.wrapper.vm.$nextTick();
    expect(exists(other.wrapper, 'placement-line')).toBe(false);
  });
});

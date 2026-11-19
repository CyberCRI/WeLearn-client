import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ConnectionDevelopment from '@/components/tutor/development/ConnectionDevelopment.vue';
import { type Connection, type Development, useConnectionsStore } from '@/stores/connections';
import { useCourseStore } from '@/stores/course';
import type { AdaptationProposal, AdaptationResource, Document } from '@/types';

vi.mock('@/utils/fetch', () => ({ basePostAxios: vi.fn() }));

const resource = (role: AdaptationResource['role'], quote: string | null): AdaptationResource => ({
  document: {
    score: 0.9,
    payload: {
      document_id: `doc-${role}`,
      document_title: `Doc ${role}`,
      document_url: 'https://example.org/a',
      document_corpus: 'conversation',
      document_details: {}
    }
  } as unknown as Document,
  usefulness: 'useful',
  evidence: 'The passage it was kept for.',
  role,
  quote
});

const proposal = (overrides: Partial<AdaptationProposal> = {}): AdaptationProposal => ({
  kind: 'topic',
  original: 'GDP',
  suggested: 'Add the ecological footprint next to GDP.',
  why: 'GDP ignores the environment.',
  support: 'strong',
  resources: [resource('direct', 'The footprint measures it.')],
  guidance: { learning: null, greencomp: null, teaching: null, check: null },
  checks: { status: 'checked', problems: [], unbacked_names: [] },
  ...overrides
});

const development = (overrides: Partial<Development> = {}): Development => ({
  status: 'ready',
  proposal: proposal(),
  decision: 'pending',
  edited: null,
  placement: null,
  ...overrides
});

const connection = (dev: Development): Connection => ({
  id: 'idea-1',
  title: 'Idea 1',
  anchor: 'GDP',
  anchor_label: null,
  why: 'why',
  use: null,
  queries: ['q'],
  decision: 'selected',
  evidence: null,
  isChecking: false,
  hasCheckFailed: false,
  development: dev
});

// the store holds the connection, so the component's actions change what it shows
const mountWith = (dev: Partial<Development> = {}) => {
  const store = useConnectionsStore();
  store.connections = [connection(development(dev))];
  const wrapper = mount(ConnectionDevelopment, {
    props: { connection: store.connections[0] }
  });
  return { store, wrapper };
};

const text = (wrapper: ReturnType<typeof mount>, testId: string) =>
  wrapper.find(`[data-testid="${testId}"]`).text();
const exists = (wrapper: ReturnType<typeof mount>, testId: string) =>
  wrapper.find(`[data-testid="${testId}"]`).exists();

describe('ConnectionDevelopment', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const course = useCourseStore();
    course.courseTopics = [{ value: 'GDP', origin: 'extracted', subtopics: ['Measure'] }];
    course.courseObjectives = [
      { value: 'Define GDP.', origin: 'extracted' },
      { value: 'Use indicators.', origin: 'extracted' }
    ];
    course.coursePlan = ['Week 1 – GDP'];
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
  });

  it('shows where it goes, the wording, why, and how well it is supported', () => {
    const { wrapper } = mountWith();
    expect(text(wrapper, 'placement-part')).toBe('GDP');
    expect(text(wrapper, 'change-text')).toBe('Add the ecological footprint next to GDP.');
    expect(text(wrapper, 'change-why')).toBe('GDP ignores the environment.');
    expect(exists(wrapper, 'support-strong')).toBe(true);
    expect(text(wrapper, 'evidence-summary')).toContain(
      'tutor.additions.change.evidence.strongDetail'
    );
    expect(text(wrapper, 'change-quote')).toBe('The footprint measures it.');
    expect(exists(wrapper, 'check-notes')).toBe(false);
    // no notes, nothing folded for them
    expect(exists(wrapper, 'pedagogical-notes')).toBe(false);
  });

  it('says a limited support with the first problem the check found, and every point', () => {
    const { wrapper } = mountWith({
      proposal: proposal({
        support: 'partial',
        resources: [resource('direct', null), resource('context', null)],
        checks: {
          status: 'checked',
          problems: ['The figure is not in the sources.', 'Second problem.'],
          unbacked_names: ['IPBES']
        }
      })
    });
    expect(text(wrapper, 'evidence-summary')).toContain('The figure is not in the sources.');
    expect(wrapper.findAll('[data-testid="check-problem"]')).toHaveLength(2);
    expect(text(wrapper, 'check-names')).toBe('tutor.additions.change.unbackedNames');
    // a resource that only gives context says so
    expect(wrapper.findAll('[data-testid="context-tag"]')).toHaveLength(1);
  });

  it('says when the check could not be made, and when no resource backs the change', async () => {
    const { store, wrapper } = mountWith({
      proposal: proposal({
        support: 'partial',
        checks: { status: 'unchecked', problems: [], unbacked_names: [] }
      })
    });
    expect(text(wrapper, 'evidence-summary')).toContain(
      'tutor.additions.change.evidence.uncheckedDetail'
    );
    expect(exists(wrapper, 'check-unchecked')).toBe(true);

    store.connections[0].development!.proposal = proposal({
      support: 'none',
      resources: [],
      checks: null
    });
    await wrapper.vm.$nextTick();
    expect(text(wrapper, 'evidence-summary')).toContain(
      'tutor.additions.change.evidence.noneDefault'
    );
    expect(exists(wrapper, 'no-resource')).toBe(true);
  });

  it('folds the pedagogical notes, GreenComp by its name', () => {
    const { wrapper } = mountWith({
      proposal: proposal({
        guidance: {
          learning: 'Compare indicators.',
          teaching: null,
          check: 'A short quiz.',
          greencomp: { id: 'systems_thinking', how: 'Links economy and nature.' }
        }
      })
    });
    expect(text(wrapper, 'note-learning')).toBe('Compare indicators.');
    expect(exists(wrapper, 'note-teaching')).toBe(false);
    expect(text(wrapper, 'note-greencomp')).toContain('tutor.greencomp.systems_thinking');
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
    const editor = wrapper.find('textarea');
    expect((editor.element as HTMLTextAreaElement).value).toBe(
      'Add the ecological footprint next to GDP.'
    );
    expect(exists(wrapper, 'accept-change')).toBe(false);
    await editor.setValue('');
    expect(wrapper.find('[data-testid="save-change"]').attributes('disabled')).toBeDefined();
    await editor.setValue('My own wording.');
    await wrapper.find('[data-testid="save-change"]').trigger('click');
    expect(development()).toMatchObject({ decision: 'accepted', edited: 'My own wording.' });
    expect(text(wrapper, 'change-text')).toBe('My own wording.');
    expect(exists(wrapper, 'change-edited')).toBe(true);

    await wrapper.find('[data-testid="reconsider"]').trigger('click');
    await wrapper.find('[data-testid="edit-change"]').trigger('click');
    await wrapper.find('[data-testid="cancel-edit"]').trigger('click');
    expect(exists(wrapper, 'change-editor')).toBe(false);
    await wrapper.find('[data-testid="keep-original"]').trigger('click');
    expect(text(wrapper, 'change-kept')).toBe('tutor.additions.change.skipped');
  });

  it('names the objective a revision replaces, and keeps it in place', async () => {
    const { store, wrapper } = mountWith({
      proposal: proposal({ kind: 'objective', original: 'Use indicators.' })
    });
    expect(text(wrapper, 'change-original')).toContain('tutor.additions.change.revisesObjective');
    expect(text(wrapper, 'original-text')).toBe('Use indicators.');
    expect(exists(wrapper, 'choose-place')).toBe(false);
    expect(exists(wrapper, 'change-place')).toBe(false);
    expect(text(wrapper, 'keep-original')).toBe('tutor.additions.change.keepOriginal');

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
});

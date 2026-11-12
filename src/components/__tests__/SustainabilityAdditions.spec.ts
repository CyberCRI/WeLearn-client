import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import SustainabilityAdditions from '@/components/tutor/SustainabilityAdditions.vue';
import { useConnectionsStore } from '@/stores/connections';
import { useTutorStore } from '@/stores/tutor';
import type { Document } from '@/types';

vi.mock('@/stores/bookmarks', () => ({
  useBookmarksStore: () => ({ toggleBookmark: vi.fn(), isBookmarked: () => false })
}));

const resource = {
  document: {
    score: 0.9,
    payload: {
      document_id: 'a',
      document_title: 'Beyond GDP',
      document_url: 'https://example.org/a',
      document_corpus: 'conversation',
      document_lang: 'en',
      document_details: {},
      document_sdg: [],
      slice_content: 'GDP misses nature.'
    }
  } as unknown as Document,
  usefulness: 'Shows what GDP misses.',
  evidence: 'GDP misses nature.'
};

// the suggestions as they come back, without calling WeLearn
const prepare = (status: string) => {
  const store = useConnectionsStore();
  vi.spyOn(store, 'isFor').mockReturnValue(true);
  store.findConnections = vi.fn();
  store.status = status as never;
  store.connections = [
    {
      id: 0,
      title: 'Beyond GDP',
      anchor: 'GDP',
      anchorLabel: null,
      why: 'GDP misses nature.',
      resources: [resource],
      decision: 'open',
      development: null
    },
    {
      id: 1,
      title: 'Green jobs',
      anchor: null,
      anchorLabel: null,
      why: 'Jobs change.',
      resources: [],
      decision: 'open',
      development: null
    }
  ];
  return store;
};

describe('SustainabilityAdditions (step 3)', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('asks WeLearn once for the confirmed course, showing only the real steps', async () => {
    const store = useConnectionsStore();
    store.findConnections = vi.fn(async () => {
      store.status = 'searching';
    });
    const wrapper = mount(SustainabilityAdditions);
    await wrapper.vm.$nextTick();
    expect(store.findConnections).toHaveBeenCalledTimes(1);
    const steps = wrapper.findAll('[data-testid="additions-waiting"] li');
    expect(steps.map((step) => step.classes()[0])).toEqual(['is-done', 'is-active', 'is-pending']);
  });

  it('shows supported connections first, the unsupported apart, and the teacher decides', async () => {
    const store = prepare('ready');
    const wrapper = mount(SustainabilityAdditions);
    const cards = wrapper.findAll('.additions > .connection-list [data-testid="connection"]');
    expect(cards).toHaveLength(1);
    expect(cards[0].find('[data-testid="where"]').text()).toContain('GDP');
    expect(cards[0].find('[data-testid="usefulness"]').text()).toBe('Shows what GDP misses.');
    expect(cards[0].find('[data-testid="excerpt"]').text()).toBe('GDP misses nature.');
    expect(cards[0].find('[data-testid="resource-title"]').text()).toBe('Beyond GDP');
    expect(cards[0].text()).not.toContain('sdgsAcronym');
    expect(wrapper.find('[data-testid="accepted-count"]').text()).toContain(
      'tutor.additions.change.consequence'
    );
    const unsupported = wrapper.find('[data-testid="unsupported-list"]');
    expect(unsupported.find('[data-testid="unsupported"]').text()).toBe(
      'tutor.additions.unsupported'
    );

    store.develop = vi.fn();
    await cards[0].find('[data-testid="develop"]').trigger('click');
    expect(store.develop).toHaveBeenCalledWith(0);

    await unsupported.find('[data-testid="set-aside"]').trigger('click');
    expect(wrapper.find('[data-testid="set-aside-list"]').text()).toContain('Green jobs');
    await wrapper.find('[data-testid="bring-back"]').trigger('click');
    expect(store.connections[1].decision).toBe('open');
  });

  it('refers to an objective by its number, its full wording on demand, and a topic by name', () => {
    const store = prepare('ready');
    const tutor = useTutorStore();
    tutor.courseObjectives = [
      { value: 'Define GDP.', origin: 'extracted' },
      { value: 'Explain how GDP is measured and what it leaves out.', origin: 'extracted' }
    ];
    store.connections[0].anchor = 'Explain how GDP is measured and what it leaves out.';
    const wrapper = mount(SustainabilityAdditions);
    const card = wrapper.find('[data-testid="connection"]');
    expect(card.find('[data-testid="anchor-ref"] summary').text()).toBe(
      'tutor.additions.objectiveRef'
    );
    expect(card.find('[data-testid="anchor-full"]').text()).toBe(
      'Explain how GDP is measured and what it leaves out.'
    );
    store.connections[0].anchor = 'GDP';
    expect(mount(SustainabilityAdditions).find('[data-testid="anchor-topic"]').text()).toBe('GDP');
  });

  it('names an objective by a few words when WeLearn gives them', () => {
    const store = prepare('ready');
    useTutorStore().courseObjectives = [
      { value: 'Explain how GDP is measured and what it leaves out.', origin: 'extracted' }
    ];
    store.connections[0].anchor = 'Explain how GDP is measured and what it leaves out.';
    store.connections[0].anchorLabel = 'GDP measurement';
    const card = mount(SustainabilityAdditions).find('[data-testid="connection"]');
    expect(card.find('[data-testid="anchor-ref"] summary').text()).toBe('GDP measurement');
    expect(card.find('[data-testid="anchor-full"]').text()).toBe(
      'Explain how GDP is measured and what it leaves out.'
    );
  });

  it('shows the confirmed course in one line, and one link back to the course review', async () => {
    prepare('ready');
    const tutor = useTutorStore();
    tutor.teachingContext = {
      ...tutor.teachingContext,
      title: 'Macro',
      discipline: 'Economics',
      level: 'l1'
    };
    tutor.setStep(3);
    const wrapper = mount(SustainabilityAdditions);
    expect(wrapper.find('[data-testid="course-line"]').text()).toContain(
      'Macro · Economics · Licence 1'
    );
    expect(wrapper.find('[data-testid="edit-course"]').exists()).toBe(false);
    await wrapper.find('[data-testid="back-to-check"]').trigger('click');
    expect(tutor.step).toBe(2);
  });

  it('says plainly when nothing could be suggested or supported', () => {
    const store = prepare('ready');
    store.connections = [];
    expect(mount(SustainabilityAdditions).find('[data-testid="no-connections"]').exists()).toBe(
      true
    );
    store.connections = [
      {
        id: 1,
        title: 'Green jobs',
        anchor: null,
        anchorLabel: null,
        why: 'Jobs change.',
        resources: [],
        decision: 'open',
        development: null
      }
    ];
    expect(mount(SustainabilityAdditions).find('[data-testid="no-support"]').exists()).toBe(true);
  });

  it('offers to try again after a failure, and asks again after the course is confirmed again', async () => {
    const store = prepare('unavailable');
    const wrapper = mount(SustainabilityAdditions);
    await wrapper.find('[data-testid="retry"]').trigger('click');
    expect(store.findConnections).toHaveBeenCalledTimes(1);

    vi.mocked(store.isFor).mockReturnValue(false);
    useTutorStore().confirmCourse();
    await wrapper.vm.$nextTick();
    expect(store.findConnections).toHaveBeenCalledTimes(2);
  });

  it('shows an idea that could not be checked as a technical problem, with a way to retry', async () => {
    const store = prepare('ready');
    store.connections = [{ ...store.connections[1], isUnchecked: true, queries: ['green jobs'] }];
    store.leftOut = 2;
    store.recheck = vi.fn();
    const wrapper = mount(SustainabilityAdditions);
    // not presented as "no resource supports this idea"
    expect(wrapper.find('[data-testid="no-support"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="unsupported-list"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="unchecked"]').text()).toContain('tutor.additions.unchecked');
    await wrapper.find('[data-testid="recheck"]').trigger('click');
    expect(store.recheck).toHaveBeenCalledWith(1);
    // fewer ideas on purpose: said
    expect(wrapper.find('[data-testid="left-out"]').text()).toBe('tutor.additions.leftOut');

    store.connections[0].isRechecking = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-testid="unchecked"]').text()).toBe('tutor.additions.rechecking');
    expect(wrapper.find('[data-testid="recheck"]').exists()).toBe(false);
  });

  it('says why WeLearn found no connection, when it says so', () => {
    const store = prepare('ready');
    store.connections = [];
    store.noneReason = 'No genuine link.';
    const wrapper = mount(SustainabilityAdditions);
    expect(wrapper.find('[data-testid="none-reason"]').text()).toBe('tutor.additions.noneReason');
  });

  it('shows each connection in four parts, its sources folded and related reading apart', () => {
    const store = prepare('ready');
    store.connections[0].background = [{ ...resource, role: 'context' as const }];
    const wrapper = mount(SustainabilityAdditions);
    const card = wrapper.findAll('[data-testid="connection"]')[0];
    expect(card.find('[data-testid="why"]').text()).toBe('GDP misses nature.');
    // the sources: one line by default (how many, from where), details on request
    const sources = card.find('[data-testid="resources"]');
    expect((sources.element as HTMLDetailsElement).open).toBe(false);
    expect(sources.find('summary').text()).toContain('tutor.additions.sourceCount');
    expect(sources.find('summary').text()).toContain('Conversation');
    // the passage it was chosen for is not read by default
    expect((sources.find('.passage').element as HTMLDetailsElement).open).toBe(false);
    // background only: apart, labelled, never counted as support
    const related = card.find('[data-testid="background"]');
    expect(related.find('summary').text()).toBe('tutor.additions.background');
    expect(related.text()).toContain('tutor.additions.backgroundHint');
  });

  it('keeps the warning visible when an idea has no supporting source', () => {
    prepare('ready');
    const wrapper = mount(SustainabilityAdditions);
    const unsupported = wrapper.find('[data-testid="unsupported"]');
    expect(unsupported.text()).toBe('tutor.additions.unsupported');
    // not hidden in a folded section of its card
    expect(unsupported.element.closest('details[data-testid="resources"]')).toBeNull();
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ConnectionDevelopment from '@/components/tutor/ConnectionDevelopment.vue';
import { useConnectionsStore, type Development } from '@/stores/connections';
import { useTutorStore } from '@/stores/tutor';
import type { Document } from '@/types';
import type { AdaptationProposal } from '@/utils/connections';

const resource = {
  document: {
    score: 0.9,
    payload: {
      document_id: 'a',
      document_title: 'Green the economy',
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

const PROPOSAL: AdaptationProposal = {
  kind: 'objective',
  original: 'Explain how GDP is measured.',
  suggested: 'Explain how GDP is measured and what it leaves out.',
  why: 'Students see the limits of the indicator.',
  support: 'strong',
  resources: [{ ...resource, quote: 'GDP misses nature.' }],
  guidance: {
    learning: 'Explain what GDP leaves out of well-being.',
    greencomp: { id: 'critical_thinking', how: 'Students question what an indicator measures.' },
    teaching: 'A short comparison of GDP and a well-being index.',
    check: 'Students name one thing GDP misses and why.'
  }
};

// a connection in the store, developed or being developed, without calling WeLearn
const mountWith = (development: Partial<Development>) => {
  const tutor = useTutorStore();
  tutor.courseObjectives = [
    { value: 'Define GDP.', origin: 'extracted' },
    { value: 'Explain how GDP is measured.', origin: 'extracted' }
  ];
  const store = useConnectionsStore();
  store.connections = [
    {
      id: 0,
      title: 'Beyond GDP',
      anchor: 'Explain how GDP is measured.',
      anchorLabel: null,
      why: 'GDP misses nature.',
      resources: [resource],
      decision: 'selected',
      development: {
        status: 'ready',
        proposal: PROPOSAL,
        decision: 'pending',
        edited: null,
        placement: null,
        ...development
      }
    }
  ];
  const wrapper = mount(ConnectionDevelopment, { props: { connection: store.connections[0] } });
  return { store, wrapper };
};

describe('ConnectionDevelopment (step 3b)', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('shows where it fits, the suggested wording, why, and a one-line evidence assessment', () => {
    const { wrapper } = mountWith({});
    expect(wrapper.find('.change-title').text()).toBe('tutor.additions.change.title');
    // a revised objective says which one it revises, in plain words
    expect(wrapper.find('[data-testid="change-original"]').text()).toContain(
      'tutor.additions.change.revisesObjective'
    );
    expect(wrapper.find('[data-testid="change-original"]').text()).toContain(
      'Explain how GDP is measured.'
    );
    expect(wrapper.find('[data-testid="change-suggested"]').text()).toBe(PROPOSAL.suggested);
    expect(wrapper.find('[data-testid="change-why"]').text()).toBe(PROPOSAL.why);
    // the sources are folded, still there; the evidence is one sentence, always visible
    const details = wrapper.find('[data-testid="change-support"]');
    expect(details.element.tagName).toBe('DETAILS');
    expect((details.element as HTMLDetailsElement).open).toBe(false);
    expect(details.find('a').text()).toBe('Green the economy');
    const summary = wrapper.find('[data-testid="evidence-summary"]');
    expect(summary.classes()).toContain('is-strong');
    // supported by the sources: never presented as a scientific verification
    expect(summary.text()).toBe(
      'tutor.additions.change.evidence.strong tutor.additions.change.evidence.strongDetail'
    );
    // no technical field in the default view
    expect(wrapper.text()).not.toContain('tutor.additions.change.type');
    expect(wrapper.text()).not.toContain('kinds.');
  });

  it('shows where the change goes in the syllabus, as the document will', async () => {
    const tutor = useTutorStore();
    tutor.documentText = [
      'MACROECONOMICS',
      'OBJECTIVES',
      'Define GDP.',
      'Explain how GDP is measured.',
      'CONTENT',
      'Growth and cycles',
      'ASSESSMENT',
      'Final exam.',
      'This course introduces the main indicators of the economy and how they are built. '.repeat(4)
    ].join('\n');
    const { wrapper } = mountWith({});
    // a revised objective: in place of its original
    expect(wrapper.find('[data-testid="placement-line"]').text()).toBe(
      'tutor.additions.change.replacesLine'
    );
    // it is never moved elsewhere
    expect(wrapper.find('[data-testid="change-place"]').exists()).toBe(false);
    // corrected away in step 2: said, not kept silently
    tutor.courseObjectives = [{ value: 'Define GDP.', origin: 'extracted' }];
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-testid="placement-stale"]').text()).toBe(
      'tutor.additions.change.staleObjective'
    );
  });

  it('lets the teacher choose a place when no single passage matches', async () => {
    const tutor = useTutorStore();
    tutor.documentText = [
      'MACROECONOMICS',
      'OBJECTIVES',
      'Define GDP.',
      'Explain how GDP is measured.',
      'CONTENT',
      'Growth and cycles',
      'ASSESSMENT',
      'Final exam.',
      'This course introduces the main indicators of the economy and how they are built. '.repeat(4)
    ].join('\n');
    tutor.courseTopics = [
      { value: 'Economy', origin: 'extracted', subtopics: ['Growth and cycles'] }
    ] as never;
    const { store, wrapper } = mountWith({
      proposal: { ...PROPOSAL, kind: 'topic', original: 'Economy' }
    });
    // "economy" appears several times in the text: not placed, listed at the end, and said so
    expect(wrapper.find('[data-testid="placement-none"]').exists()).toBe(true);
    await wrapper.find('[data-testid="choose-place"] select').setValue('Growth and cycles');
    expect(store.connections[0].development?.placement).toBe('Growth and cycles');
    expect(wrapper.find('[data-testid="placement-line"]').text()).toBe(
      'tutor.additions.change.afterLine'
    );
    expect(store.acceptedChanges).toEqual([]);
  });

  it('marks a resource that only gives context', () => {
    const { wrapper } = mountWith({
      proposal: {
        ...PROPOSAL,
        support: 'partial',
        resources: [{ ...resource, quote: null, role: 'context' }]
      }
    });
    expect(wrapper.find('[data-testid="context-tag"]').text()).toBe('tutor.additions.contextTag');
    expect(wrapper.find('[data-testid="support-partial"]').exists()).toBe(true);
  });

  it('says plainly when a change is weakly supported, and offers to skip an addition', () => {
    const { wrapper } = mountWith({
      proposal: { ...PROPOSAL, kind: 'topic', original: null, support: 'none', resources: [] }
    });
    // an addition does not pretend to revise anything
    expect(wrapper.find('[data-testid="change-original"]').exists()).toBe(false);
    const summary = wrapper.find('[data-testid="evidence-summary"]');
    expect(summary.classes()).toContain('is-none');
    expect(wrapper.find('[data-testid="support-none"]').text()).toBe(
      'tutor.additions.change.evidence.none'
    );
    expect(summary.text()).toContain('tutor.additions.change.evidence.noneDefault');
    expect(wrapper.find('[data-testid="keep-original"]').text()).toBe(
      'tutor.additions.change.skip'
    );
  });

  it('gives the real reason when the evidence is limited, and says when it could not be checked', () => {
    const limited = mountWith({
      proposal: {
        ...PROPOSAL,
        support: 'partial',
        checks: {
          status: 'checked',
          problems: ['The research addresses AI governance, not the climate-policy example.'],
          unbackedNames: []
        }
      }
    });
    expect(limited.wrapper.find('[data-testid="evidence-summary"]').text()).toBe(
      'tutor.additions.change.evidence.partial The research addresses AI governance, not the climate-policy example.'
    );
    const unchecked = mountWith({
      proposal: {
        ...PROPOSAL,
        support: 'partial',
        checks: { status: 'unchecked', problems: [], unbackedNames: [] }
      }
    });
    const summary = unchecked.wrapper.find('[data-testid="evidence-summary"]');
    expect(summary.classes()).toContain('is-unchecked');
    expect(summary.text()).toContain('tutor.additions.change.evidence.unchecked');
  });

  it('folds a long original, and says what accepting means once for the page', async () => {
    const long = 'Explain how GDP is measured. '.repeat(10).trim();
    const tutor = useTutorStore();
    const { wrapper } = mountWith({ proposal: { ...PROPOSAL, original: long } });
    tutor.courseObjectives = [{ value: long, origin: 'extracted' }];
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-testid="original-text"]').classes()).toContain('is-clamped');
    await wrapper.find('[data-testid="toggle-original"]').trigger('click');
    expect(wrapper.find('[data-testid="original-text"]').classes()).not.toContain('is-clamped');
    // what accepting means is said once for the page, not in every card
    expect(wrapper.text()).not.toContain('tutor.additions.change.consequence');
  });

  it('asks the teacher where a change WeLearn could not place fits, among real course parts', async () => {
    const tutor = useTutorStore();
    const { store, wrapper } = mountWith({
      proposal: { ...PROPOSAL, kind: 'assessment', original: null }
    });
    tutor.courseTopics = [{ value: 'GDP', origin: 'extracted' }];
    tutor.coursePlan = ['Week 1 – GDP', 'GDP'];
    await wrapper.vm.$nextTick();
    const select = wrapper.find('[data-testid="choose-place"] select');
    expect(select.findAll('option').map((option) => option.text())).toEqual([
      'tutor.additions.change.whereLabel',
      'GDP',
      'Week 1 – GDP'
    ]);
    await select.setValue('Week 1 – GDP');
    await wrapper.find('[data-testid="accept-change"]').trigger('click');
    expect(store.acceptedChanges[0].placement).toBe('Week 1 – GDP');
  });

  it('folds optional pedagogical notes under the change, apart from it', async () => {
    const { store, wrapper } = mountWith({});
    const notes = wrapper.find('[data-testid="pedagogical-notes"]');
    expect(notes.element.tagName).toBe('DETAILS');
    expect(notes.find('[data-testid="note-learning"]').text()).toBe(
      'Explain what GDP leaves out of well-being.'
    );
    expect(notes.find('[data-testid="note-greencomp"]').text()).toContain(
      'tutor.greencomp.critical_thinking'
    );
    expect(notes.find('[data-testid="note-teaching"]').exists()).toBe(true);
    expect(notes.find('[data-testid="note-check"]').exists()).toBe(true);
    // the suggested change is unchanged by them, and accepting takes only the change
    expect(wrapper.find('[data-testid="change-suggested"]').text()).toBe(PROPOSAL.suggested);
    await wrapper.find('[data-testid="accept-change"]').trigger('click');
    expect(store.acceptedChanges[0].text).toBe(PROPOSAL.suggested);
  });

  it('shows no notes section when there are none', () => {
    const { wrapper } = mountWith({
      proposal: {
        ...PROPOSAL,
        guidance: { learning: null, greencomp: null, teaching: null, check: null }
      }
    });
    expect(wrapper.find('[data-testid="pedagogical-notes"]').exists()).toBe(false);
  });

  it('accepts, edits before accepting, or keeps the original; each can be undone', async () => {
    const { store, wrapper } = mountWith({});
    await wrapper.find('[data-testid="accept-change"]').trigger('click');
    expect(store.acceptedChanges.map((change) => change.text)).toEqual([PROPOSAL.suggested]);
    expect(wrapper.find('[data-testid="change-accepted"]').exists()).toBe(true);

    await wrapper.find('[data-testid="reconsider"]').trigger('click');
    await wrapper.find('[data-testid="edit-change"]').trigger('click');
    await wrapper
      .find('[data-testid="change-editor"]')
      .setValue('Explain GDP and its blind spots.');
    await wrapper.find('[data-testid="save-change"]').trigger('click');
    expect(store.acceptedChanges.map((change) => change.text)).toEqual([
      'Explain GDP and its blind spots.'
    ]);
    expect(wrapper.find('[data-testid="change-suggested"]').text()).toContain(
      'Explain GDP and its blind spots.'
    );

    await wrapper.find('[data-testid="reconsider"]').trigger('click');
    await wrapper.find('[data-testid="keep-original"]').trigger('click');
    expect(store.acceptedChanges).toEqual([]);
    expect(wrapper.find('[data-testid="change-kept"]').exists()).toBe(true);
  });

  it('shows the work in progress, and a failure with a way to try again', async () => {
    const thinking = mountWith({ status: 'thinking', proposal: null });
    expect(thinking.wrapper.text()).toContain('tutor.additions.change.thinking');

    const failed = mountWith({ status: 'unavailable', proposal: null });
    failed.store.develop = vi.fn();
    await failed.wrapper.find('[data-testid="retry-develop"]').trigger('click');
    expect(failed.store.develop).toHaveBeenCalledWith(0);
  });

  it('shows what the check of the change found: problems, unbacked names, or no check', () => {
    const { wrapper } = mountWith({
      proposal: {
        ...PROPOSAL,
        support: 'none',
        checks: {
          status: 'checked',
          problems: ['The Calvin cycle uses NADPH, not NADH.'],
          unbackedNames: ['Rauschenberg']
        }
      }
    });
    expect(wrapper.find('[data-testid="support-none"]').exists()).toBe(true);
    expect(wrapper.findAll('[data-testid="check-problem"]').map((li) => li.text())).toEqual([
      'The Calvin cycle uses NADPH, not NADH.'
    ]);
    expect(wrapper.find('[data-testid="check-names"]').text()).toBe(
      'tutor.additions.change.unbackedNames'
    );
    const unchecked = mountWith({
      proposal: {
        ...PROPOSAL,
        support: 'partial',
        checks: { status: 'unchecked', problems: [], unbackedNames: [] }
      }
    });
    expect(unchecked.wrapper.find('[data-testid="check-unchecked"]').exists()).toBe(true);
    // a clean check adds nothing
    const clean = mountWith({
      proposal: { ...PROPOSAL, checks: { status: 'checked', problems: [], unbackedNames: [] } }
    });
    expect(clean.wrapper.find('[data-testid="check-notes"]').exists()).toBe(false);
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useConnectionsStore } from '../connections';
import { basePostAxios, getSearch } from '@/utils/fetch';
import type { ConfirmedCourse } from '@/utils/connections';

vi.mock('@/utils/fetch', () => ({
  basePostAxios: vi.fn(),
  getSearch: vi.fn()
}));

const COURSE: ConfirmedCourse = {
  title: 'Introduction to macroeconomics',
  discipline: 'Economics',
  level: 'First year',
  overview: 'This course presents the main indicators of the economy.',
  topics: ['GDP'],
  objectives: ['Define GDP and explain how it is measured.'],
  competencies: [],
  sessions: []
};
const PARTS = ['GDP', 'Define GDP and explain how it is measured.'];

const doc = (id: string, content: string) => ({
  score: 0.8,
  payload: {
    document_id: id,
    document_title: `Title ${id}`,
    document_url: `https://example.org/${id}`,
    document_corpus: 'conversation',
    document_lang: 'en',
    document_details: {},
    document_sdg: [],
    slice_content: content
  }
});
const answer = (value: unknown) => ({ data: { answer: JSON.stringify(value) } }) as never;
const IDEAS = {
  ideas: [
    { title: 'Beyond GDP', anchor: 'GDP', why: 'GDP misses nature.', queries: ['beyond GDP'] },
    { title: 'Green jobs', anchor: 'Jobs', why: 'Jobs change.', queries: ['green jobs'] }
  ]
};

describe('connections store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.mocked(basePostAxios).mockReset();
    vi.mocked(getSearch).mockReset();
  });

  it('suggests connections backed by the resources found for each, the unsupported last', async () => {
    const store = useConnectionsStore();
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(answer(IDEAS))
      .mockResolvedValueOnce(
        answer({
          keep: true,
          why: 'GDP leaves out natural capital.',
          resources: [
            {
              document: 1,
              relevance: 'direct',
              same_sense: true,
              establishes: true,
              concept_terms: ['GDP'],
              sustainability_terms: ['nature'],
              usefulness: 'Shows what GDP misses.',
              evidence: 'GDP misses nature.'
            }
          ]
        })
      )
      .mockResolvedValueOnce(answer({ keep: false }));
    vi.mocked(getSearch)
      .mockResolvedValueOnce({ data: [doc('a', 'GDP misses nature.')] } as never)
      .mockResolvedValueOnce({
        data: [doc('a', 'GDP misses nature.'), doc('b', 'Jobs.')]
      } as never);

    const finding = store.findConnections(COURSE, PARTS, 'fr');
    expect(store.status).toBe('thinking');
    await finding;
    expect(store.status).toBe('ready');
    // the same resource found twice is counted once
    expect(store.candidateCount).toBe(2);
    expect(store.connections.map((c) => [c.title, c.anchor, c.resources.length])).toEqual([
      ['Beyond GDP', 'GDP', 1],
      ['Green jobs', null, 0]
    ]);
    expect(store.isFor(COURSE)).toBe(true);
    expect(store.isFor({ ...COURSE, topics: ['GDP', 'Growth'] })).toBe(false);
    expect((vi.mocked(basePostAxios).mock.calls[0][1] as { lang: string }).lang).toBe('en');
  });

  it('lets the teacher select a connection to develop, undo, or set it aside', async () => {
    const store = useConnectionsStore();
    vi.mocked(basePostAxios).mockResolvedValueOnce(answer({ ideas: [IDEAS.ideas[0]] }));
    vi.mocked(getSearch).mockResolvedValueOnce({ data: [] } as never);
    await store.findConnections(COURSE, PARTS, 'en');
    // no candidate: no selection asked, the idea is kept unsupported
    expect(basePostAxios).toHaveBeenCalledTimes(1);
    expect(store.connections[0].resources).toEqual([]);

    store.select(0);
    expect(store.selectedConnections.map((c) => c.title)).toEqual(['Beyond GDP']);
    store.reopen(0);
    expect(store.selectedConnections).toEqual([]);
    store.setAside(0);
    expect(store.connections[0].decision).toBe('setAside');
    store.$reset();
    expect(store.status).toBe('idle');
    expect(store.connections).toEqual([]);
  });

  it('develops a connection into one change the teacher accepts, edits or refuses', async () => {
    const store = useConnectionsStore();
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(answer({ ideas: [IDEAS.ideas[0]] }))
      .mockResolvedValueOnce(
        answer({
          keep: true,
          why: 'GDP leaves out natural capital.',
          resources: [
            {
              document: 1,
              relevance: 'direct',
              same_sense: true,
              establishes: true,
              concept_terms: ['GDP'],
              sustainability_terms: ['nature'],
              usefulness: 'Shows what GDP misses.',
              evidence: 'GDP misses nature.'
            }
          ]
        })
      );
    vi.mocked(getSearch).mockResolvedValueOnce({ data: [doc('a', 'GDP misses nature.')] } as never);
    await store.findConnections(COURSE, PARTS, 'en');

    vi.mocked(basePostAxios).mockResolvedValueOnce(
      answer({
        kind: 'objective',
        original: 'Define GDP and explain how it is measured.',
        suggested: 'Define GDP, explain how it is measured and what it leaves out.',
        why: 'Students see the limits of the indicator they learn.',
        documents: [1],
        evidence: [{ document: 1, quote: 'GDP misses nature.' }],
        support: 'strong'
      })
    );
    // the check of its claims: each established by the direct resource
    vi.mocked(basePostAxios).mockResolvedValueOnce(
      answer({
        claims: [
          {
            claim: 'GDP leaves nature out',
            status: 'established',
            document: 1,
            quote: 'GDP misses nature.'
          }
        ],
        fit: 'genuine'
      })
    );
    const developing = store.develop(0);
    expect(store.connections[0].decision).toBe('selected');
    expect(store.connections[0].development?.status).toBe('thinking');
    await developing;
    const { development } = store.connections[0];
    expect(development?.status).toBe('ready');
    expect(development?.proposal).toMatchObject({
      kind: 'objective',
      original: 'Define GDP and explain how it is measured.',
      support: 'strong',
      checks: { status: 'checked', problems: [], unbackedNames: [] }
    });
    expect(development?.proposal?.resources).toHaveLength(1);
    // the course itself is untouched until the teacher decides, and even then only listed
    expect(store.acceptedChanges).toEqual([]);

    store.acceptChange(0, 'Define GDP and discuss what it leaves out. ');
    expect(store.acceptedChanges).toEqual([
      expect.objectContaining({
        connection: 'Beyond GDP',
        original: 'Define GDP and explain how it is measured.',
        text: 'Define GDP and discuss what it leaves out.'
      })
    ]);
    store.reconsider(0);
    store.acceptChange(0);
    expect(store.acceptedChanges[0].text).toBe(
      'Define GDP, explain how it is measured and what it leaves out.'
    );
    store.keepOriginal(0);
    expect(store.connections[0].development?.decision).toBe('kept');
    expect(store.acceptedChanges).toEqual([]);
  });

  it('keeps the selection when developing fails, and can try again', async () => {
    const store = useConnectionsStore();
    vi.mocked(basePostAxios).mockResolvedValueOnce(answer({ ideas: IDEAS.ideas }));
    vi.mocked(getSearch).mockResolvedValue({ data: [] } as never);
    await store.findConnections(COURSE, PARTS, 'en');
    store.setAside(1);

    vi.mocked(basePostAxios)
      .mockRejectedValueOnce(new Error('network down'))
      .mockRejectedValueOnce(new Error('network down'));
    await store.develop(0);
    expect(store.connections[0].decision).toBe('selected');
    expect(store.connections[0].development?.status).toBe('unavailable');
    expect(store.connections[1].decision).toBe('setAside');

    vi.mocked(basePostAxios)
      .mockResolvedValueOnce({ data: { answer: 'no json' } } as never)
      .mockResolvedValueOnce({ data: { answer: 'still no json' } } as never);
    await store.develop(0);
    expect(store.connections[0].development?.status).toBe('error');
    vi.mocked(getSearch).mockReset();
  });

  it('keeps the work when the course is corrected in step 2, and approved changes on a new search', async () => {
    const store = useConnectionsStore();
    store.connections = [
      {
        id: 4,
        title: 'Beyond GDP',
        anchor: 'GDP',
        anchorLabel: null,
        why: '',
        resources: [],
        decision: 'selected',
        development: {
          status: 'ready',
          proposal: {
            kind: 'topic',
            original: 'GDP',
            suggested: 'Add a well-being index.',
            why: 'It fits.',
            support: 'none',
            resources: [],
            guidance: { learning: null, greencomp: null, teaching: null, check: null }
          },
          decision: 'accepted',
          edited: null,
          placement: null
        }
      }
    ];
    expect(store.hasWork).toBe(true);
    const corrected = { ...COURSE, topics: ['Growth'] };
    store.keepFor(corrected, ['Growth'], []);
    expect(store.isFor(corrected)).toBe(false); // status still idle in this test
    expect(store.isCourseChanged).toBe(true);
    expect(store.acceptedChanges.map(({ text }) => text)).toEqual(['Add a well-being index.']);

    // looking again keeps the approved change and numbers the new ones after it
    vi.mocked(basePostAxios).mockResolvedValueOnce(answer({ ideas: [IDEAS.ideas[0]] }));
    vi.mocked(getSearch).mockResolvedValueOnce({ data: [] } as never);
    await store.findConnections(corrected, ['Growth', 'GDP'], 'en');
    expect(store.isCourseChanged).toBe(false);
    expect(store.connections.map(({ id }) => id)).toEqual([4, 5]);
    expect(store.acceptedChanges.map(({ text }) => text)).toEqual(['Add a well-being index.']);
  });

  it('places a change where the teacher chose, a revised objective with its objective', () => {
    const store = useConnectionsStore();
    const development = (kind: 'topic' | 'objective', original: string) => ({
      status: 'ready' as const,
      proposal: {
        kind,
        original,
        suggested: 'New wording.',
        why: 'It fits.',
        support: 'none' as const,
        resources: [],
        guidance: { learning: null, greencomp: null, teaching: null, check: null }
      },
      decision: 'accepted' as const,
      edited: null,
      placement: 'Chosen place'
    });
    store.connections = [
      {
        id: 0,
        title: 'A',
        anchor: null,
        anchorLabel: null,
        why: '',
        resources: [],
        decision: 'selected',
        development: development('topic', 'GDP')
      },
      {
        id: 1,
        title: 'B',
        anchor: null,
        anchorLabel: null,
        why: '',
        resources: [],
        decision: 'selected',
        development: development('objective', 'Define GDP.')
      }
    ];
    expect(store.acceptedChanges.map(({ placement }) => placement)).toEqual([
      'Chosen place',
      'Define GDP.'
    ]);
  });

  it('says when WeLearn could not be reached, and when it gave nothing usable', async () => {
    const store = useConnectionsStore();
    // a call lost once is sent again; lost twice, WeLearn could not be reached
    vi.mocked(basePostAxios)
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValueOnce(answer({ ideas: [], none_reason: 'No genuine link.' }));
    await store.findConnections(COURSE, PARTS, 'en');
    // no connection, with a reason: a judgement, said as such
    expect(store.status).toBe('ready');
    expect(store.connections).toEqual([]);
    expect(store.noneReason).toBe('No genuine link.');
    expect(store.toDraft().noneReason).toBe('No genuine link.');

    // an empty list without a reason (the algebra evaluation): an unusable answer, asked again,
    // then a failure the teacher can retry, never "no connection found"
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(answer({ ideas: [] }))
      .mockResolvedValueOnce(answer({ ideas: [] }));
    await store.findConnections(COURSE, PARTS, 'en');
    expect(store.status).toBe('error');
    vi.mocked(basePostAxios)
      .mockRejectedValueOnce(new Error('network down'))
      .mockRejectedValueOnce(new Error('network down'));
    await store.findConnections(COURSE, PARTS, 'en');
    expect(store.status).toBe('unavailable');

    vi.mocked(basePostAxios).mockRejectedValueOnce({ response: { status: 500 } });
    await store.findConnections(COURSE, PARTS, 'en');
    expect(store.status).toBe('error');

    vi.mocked(basePostAxios)
      .mockResolvedValueOnce({ data: { answer: 'no json' } } as never)
      .mockResolvedValueOnce({ data: { answer: 'still no json' } } as never);
    await store.findConnections(COURSE, PARTS, 'en');
    expect(store.status).toBe('error');
  });

  it('leaves out a connection judged forced, and marks one whose resources could not be judged', async () => {
    const store = useConnectionsStore();
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(answer(IDEAS))
      // the first idea is an analogy: not suggested at all
      .mockResolvedValueOnce(answer({ fit: 'analogy', keep: false }))
      // the second idea's judgement is unusable twice
      .mockResolvedValueOnce({ data: { answer: 'no json' } } as never)
      .mockResolvedValueOnce({ data: { answer: 'no json' } } as never);
    vi.mocked(getSearch).mockResolvedValue({ data: [doc('a', 'Green jobs grow.')] } as never);
    await store.findConnections(COURSE, PARTS, 'en');
    expect(store.status).toBe('ready');
    expect(store.leftOut).toBe(1);
    expect(store.connections.map((c) => [c.title, !!c.isUnchecked])).toEqual([
      ['Green jobs', true]
    ]);
    expect(store.toDraft().leftOut).toBe(1);

    // checked again: searched and judged alone, this time with a direct resource
    vi.mocked(basePostAxios).mockResolvedValueOnce(
      answer({
        fit: 'genuine',
        keep: true,
        resources: [
          {
            document: 1,
            relevance: 'direct',
            same_sense: true,
            establishes: true,
            concept_terms: ['jobs'],
            sustainability_terms: ['green'],
            usefulness: 'Shows green jobs.',
            evidence: 'Green jobs grow.'
          }
        ]
      })
    );
    const checking = store.recheck(store.connections[0].id);
    expect(store.connections[0].isRechecking).toBe(true);
    await checking;
    expect(store.connections[0].isUnchecked).toBe(false);
    expect(store.connections[0].isRechecking).toBe(false);
    expect(store.connections[0].resources).toHaveLength(1);

    // judged forced on a new check: left out
    vi.mocked(basePostAxios).mockResolvedValueOnce(answer({ fit: 'off_discipline', keep: false }));
    await store.recheck(store.connections[0].id);
    expect(store.connections).toEqual([]);
    expect(store.leftOut).toBe(2);
    vi.mocked(getSearch).mockReset();
  });

  it('checks the claims of a change: asks again without a wrong claim, never strong when wrong', async () => {
    const store = useConnectionsStore();
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(answer({ ideas: [IDEAS.ideas[0]] }))
      .mockResolvedValueOnce(
        answer({
          keep: true,
          resources: [
            {
              document: 1,
              relevance: 'direct',
              same_sense: true,
              establishes: true,
              concept_terms: ['GDP'],
              sustainability_terms: ['nature'],
              usefulness: 'Shows what GDP misses.',
              evidence: 'GDP misses nature.'
            }
          ]
        })
      );
    vi.mocked(getSearch).mockResolvedValueOnce({ data: [doc('a', 'GDP misses nature.')] } as never);
    await store.findConnections(COURSE, PARTS, 'en');

    const proposal = (suggested: string) =>
      answer({
        kind: 'topic',
        original: 'GDP',
        suggested,
        why: 'It fits.',
        documents: [1],
        evidence: [{ document: 1, quote: 'GDP misses nature.' }],
        support: 'strong'
      });
    const wrong = answer({
      claims: [{ claim: 'GDP counts forests', status: 'incorrect', problem: 'GDP does not.' }],
      fit: 'genuine'
    });
    // the first proposal has a wrong claim; the second, asked with that problem, still has it
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(proposal('GDP counts forests.'))
      .mockResolvedValueOnce(wrong)
      .mockResolvedValueOnce(proposal('GDP counts forests and rivers.'))
      .mockResolvedValueOnce(wrong);
    await store.develop(0);
    const second = vi.mocked(basePostAxios).mock.calls.at(-2)![1] as { query: string };
    expect(second.query).toContain('GDP does not.');
    expect(store.connections[0].development?.proposal).toMatchObject({
      suggested: 'GDP counts forests and rivers.',
      support: 'none',
      checks: { status: 'checked', problems: ['GDP does not.'] }
    });

    // the second proposal is clean: it replaces the first, strong
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(proposal('GDP counts forests.'))
      .mockResolvedValueOnce(wrong)
      .mockResolvedValueOnce(proposal('GDP misses nature, as the resource shows.'))
      .mockResolvedValueOnce(answer({ claims: [], fit: 'genuine' }));
    await store.develop(0);
    expect(store.connections[0].development?.proposal).toMatchObject({
      suggested: 'GDP misses nature, as the resource shows.',
      support: 'strong'
    });

    // the check could not be made: partly supported at most, and said
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(proposal('GDP leaves nature out.'))
      .mockRejectedValueOnce({ response: { status: 500 } });
    await store.develop(0);
    expect(store.connections[0].development?.proposal).toMatchObject({
      support: 'partial',
      checks: { status: 'unchecked' }
    });
  });
});

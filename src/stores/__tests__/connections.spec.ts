import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { flushPromises } from '@vue/test-utils';
import {
  type Connection,
  MAX_PARALLEL_CHECKS,
  changeOf,
  useConnectionsStore
} from '../connections';
import { basePostAxios } from '@/utils/fetch';
import { proposal } from '@/__tests__/coursePathFixtures';
import type {
  ConfirmedCourse,
  ConnectionEvidence,
  ConnectionIdea,
  EvidencedResource
} from '@/types';

vi.mock('@/utils/fetch', () => ({ basePostAxios: vi.fn() }));
const handleQuotaError = vi.fn(
  (error: any) => error?.response?.data?.detail?.code === 'GUEST_QUOTA_EXCEEDED'
);
vi.mock('@/stores/guestQuota', () => ({ useGuestQuotaStore: () => ({ handleQuotaError }) }));

type PostResult = Awaited<ReturnType<typeof basePostAxios>>;
const apiError = (status: number, code?: string) => ({
  response: { status, data: { detail: code ? { message: 'm', code } : 'm' } }
});

const COURSE: ConfirmedCourse = {
  title: 'Macroeconomics',
  discipline: 'economics',
  level: null,
  overview: null,
  topics: [{ title: 'GDP', subtopics: ['Measure'] }],
  objectives: ['Define GDP.'],
  competencies: [],
  sessions: []
};

const idea = (n: number): ConnectionIdea => ({
  id: `idea-${n}`,
  title: `Idea ${n}`,
  anchor: 'GDP',
  anchor_label: null,
  why: `why ${n}`,
  use: null,
  queries: [`query ${n}a`, `query ${n}b`]
});

const evidence = (status: ConnectionEvidence['status']): ConnectionEvidence => ({
  status,
  concept: null,
  why: 'judged why',
  resources: [],
  background: [],
  candidate_count: 6
});

// answers each call by its route: the ideas, then the evidence of each idea by its id
const answer = (ideas: ConnectionIdea[], evidenceOf: (id: string) => unknown) =>
  vi.mocked(basePostAxios).mockImplementation((url: string, body: any) => {
    if (url === '/tutor/course/connection_ideas') {
      return Promise.resolve({ data: { ideas, none_reason: null } } as PostResult);
    }
    const result = evidenceOf(body.idea.id);
    return result instanceof Error || (result as any)?.response
      ? Promise.reject(result)
      : Promise.resolve({ data: result } as PostResult);
  });

const evidenceCalls = () =>
  vi
    .mocked(basePostAxios)
    .mock.calls.filter(([url]) => url === '/tutor/course/connection_evidence');

describe('connections store', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(basePostAxios).mockReset();
    setActivePinia(createPinia());
  });

  it('asks for the ideas, then judges the resources of each idea', async () => {
    answer([idea(1), idea(2)], (id) => evidence(id === 'idea-1' ? 'supported' : 'unsupported'));
    const store = useConnectionsStore();

    await store.findConnections(COURSE, 'en');

    const [url, body] = vi.mocked(basePostAxios).mock.calls[0];
    expect(url).toBe('/tutor/course/connection_ideas');
    expect(body).toEqual({ course: COURSE, lang: 'en' });
    // the idea is sent as the API gave it, without what the client adds
    expect(evidenceCalls()[0][1]).toEqual({ course: COURSE, idea: idea(1), lang: 'en' });
    expect(store.status).toBe('ready');
    expect(store.connections.map((c) => c.evidence?.status)).toEqual(['supported', 'unsupported']);
    expect(store.connections[0].decision).toBe('open');
    expect(store.checkedCount).toBe(2);
    expect(store.isFor(COURSE)).toBe(true);
  });

  it(`judges at most ${MAX_PARALLEL_CHECKS} ideas at a time, each shown when it is judged`, async () => {
    const pending: Record<string, (value: unknown) => void> = {};
    let running = 0;
    let most = 0;
    vi.mocked(basePostAxios).mockImplementation((url: string, body: any) => {
      if (url === '/tutor/course/connection_ideas') {
        return Promise.resolve({
          data: { ideas: [1, 2, 3, 4].map(idea), none_reason: null }
        } as PostResult);
      }
      running += 1;
      most = Math.max(most, running);
      return new Promise((resolve) => {
        pending[body.idea.id] = (value) => {
          running -= 1;
          resolve({ data: value } as PostResult);
        };
      });
    });
    const store = useConnectionsStore();

    const done = store.findConnections(COURSE, 'fr');
    await flushPromises();
    expect(Object.keys(pending)).toEqual(['idea-1', 'idea-2']);
    expect(store.status).toBe('searching');

    pending['idea-2'](evidence('supported'));
    await flushPromises();
    expect(Object.keys(pending)).toEqual(['idea-1', 'idea-2', 'idea-3']);
    expect(store.connections[1].evidence?.status).toBe('supported');
    expect(store.connections[0].evidence).toBeNull();
    expect(store.checkedCount).toBe(1);

    pending['idea-1'](evidence('supported'));
    await flushPromises();
    expect(Object.keys(pending)).toContain('idea-4');
    pending['idea-3'](evidence('unsupported'));
    pending['idea-4'](evidence('forced'));
    await done;

    expect(most).toBe(MAX_PARALLEL_CHECKS);
    expect(store.status).toBe('ready');
    // a forced idea is only counted
    expect(store.leftOut).toBe(1);
  });

  it('asks nothing more when a check waiting for its slot is retried', async () => {
    vi.mocked(basePostAxios).mockImplementation((url: string) =>
      url === '/tutor/course/connection_ideas'
        ? Promise.resolve({ data: { ideas: [1, 2, 3].map(idea), none_reason: null } } as PostResult)
        : new Promise(() => {})
    );
    const store = useConnectionsStore();
    void store.findConnections(COURSE, 'fr');
    await flushPromises();
    expect(evidenceCalls()).toHaveLength(MAX_PARALLEL_CHECKS);

    // the third waits for a slot, and says it is being checked
    expect(store.connections[2].isChecking).toBe(true);
    await store.recheck('idea-3');
    expect(evidenceCalls()).toHaveLength(MAX_PARALLEL_CHECKS);
  });

  it('keeps why no connection was found', async () => {
    vi.mocked(basePostAxios).mockResolvedValueOnce({
      data: { ideas: [], none_reason: 'A course on method only.' }
    } as PostResult);
    const store = useConnectionsStore();

    await store.findConnections(COURSE, 'fr');

    expect(store.status).toBe('ready');
    expect(store.connections).toEqual([]);
    expect(store.noneReason).toBe('A course on method only.');
  });

  it('tells an unusable answer from an API out of reach', async () => {
    const store = useConnectionsStore();
    vi.mocked(basePostAxios).mockRejectedValueOnce(apiError(502, 'UNUSABLE_LLM_OUTPUT'));
    await store.findConnections(COURSE, 'fr');
    expect(store.status).toBe('error');

    vi.mocked(basePostAxios).mockRejectedValueOnce(apiError(503));
    await store.findConnections(COURSE, 'fr');
    expect(store.status).toBe('unavailable');

    vi.mocked(basePostAxios).mockRejectedValueOnce(apiError(429));
    await store.findConnections(COURSE, 'fr');
    expect(store.status).toBe('unavailable');

    vi.mocked(basePostAxios).mockRejectedValueOnce(new Error('network'));
    await store.findConnections(COURSE, 'fr');
    expect(store.status).toBe('unavailable');

    vi.mocked(basePostAxios).mockRejectedValueOnce(apiError(422));
    await store.findConnections(COURSE, 'fr');
    expect(store.status).toBe('error');
  });

  it('marks an idea whose evidence call failed as unchecked, and checks it again alone', async () => {
    answer([idea(1), idea(2)], (id) => (id === 'idea-1' ? apiError(500) : evidence('supported')));
    const store = useConnectionsStore();
    await store.findConnections(COURSE, 'fr');

    expect(store.status).toBe('ready');
    expect(store.connections[0].hasCheckFailed).toBe(true);
    expect(store.checkedCount).toBe(2);

    vi.mocked(basePostAxios).mockClear();
    answer([], () => evidence('supported'));
    await store.recheck('idea-1');

    expect(evidenceCalls()).toHaveLength(1);
    expect(store.connections[0].hasCheckFailed).toBe(false);
    expect(store.connections[0].evidence?.status).toBe('supported');
    expect(store.connections[0].isChecking).toBe(false);
  });

  it('drops what a former search would bring once a new one starts', async () => {
    let resolveFirst: (value: unknown) => void = () => {};
    vi.mocked(basePostAxios).mockImplementationOnce(
      (_url, _body, config: any) =>
        new Promise((resolve, reject) => {
          resolveFirst = (value) => resolve(value as PostResult);
          config.signal.addEventListener('abort', () => reject(new Error('canceled')));
        })
    );
    const store = useConnectionsStore();
    const first = store.findConnections(COURSE, 'fr');

    answer([idea(2)], () => evidence('supported'));
    await store.findConnections({ ...COURSE, title: 'Other' }, 'fr');
    resolveFirst({ data: { ideas: [idea(1)], none_reason: null } });
    await first;

    expect(store.connections.map((c) => c.id)).toEqual(['idea-2']);
    expect(store.status).toBe('ready');
  });

  it('keeps the decisions, and the work for a corrected course', async () => {
    answer([idea(1), idea(2)], () => evidence('supported'));
    const store = useConnectionsStore();
    await store.findConnections(COURSE, 'fr');
    expect(store.hasWork).toBe(false);

    store.select('idea-1');
    store.setAside('idea-2');
    expect(store.selectedConnections.map((c) => c.id)).toEqual(['idea-1']);
    expect(store.hasWork).toBe(true);
    store.reopen('idea-2');
    expect(store.connections[1].decision).toBe('open');

    const corrected = { ...COURSE, objectives: ['Define and measure GDP.'] };
    expect(store.isFor(corrected)).toBe(false);
    store.keepFor(corrected);
    expect(store.isFor(corrected)).toBe(true);
    expect(store.isCourseChanged).toBe(true);
    expect(store.confirmedFor).toEqual(corrected);
    expect(store.connections).toHaveLength(2);

    store.$reset();
    expect(store.status).toBe('idle');
    expect(store.connections).toEqual([]);
    expect(store.isCourseChanged).toBe(false);
    expect(store.isFor(corrected)).toBe(false);
  });
});

const RESOURCE = {
  document: { payload: { document_id: 'doc-1', document_title: 'Doc 1' } },
  usefulness: 'useful',
  evidence: 'The passage.'
} as unknown as EvidencedResource;

// the ideas, their evidence, then the change of a developed connection (or its failure)
const answerAll = (adaptation: () => unknown) =>
  vi.mocked(basePostAxios).mockImplementation((url: string) => {
    if (url === '/tutor/course/connection_ideas') {
      return Promise.resolve({
        data: { ideas: [idea(1), idea(2)], none_reason: null }
      } as PostResult);
    }
    if (url === '/tutor/course/connection_evidence') {
      return Promise.resolve({
        data: { ...evidence('supported'), resources: [RESOURCE] }
      } as PostResult);
    }
    const result = adaptation();
    return (result as any)?.response
      ? Promise.reject(result)
      : Promise.resolve({ data: result } as PostResult);
  });

const adaptationCalls = () =>
  vi.mocked(basePostAxios).mock.calls.filter(([url]) => url === '/tutor/course/adaptation');

describe('connections store: developing a connection', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(basePostAxios).mockReset();
    handleQuotaError.mockClear();
    setActivePinia(createPinia());
  });

  it('asks for one change with the resources the evidence kept, and chooses the connection', async () => {
    answerAll(() => proposal());
    const store = useConnectionsStore();
    await store.findConnections(COURSE, 'fr');

    const developing = store.develop('idea-1');
    expect(store.connections[0].development?.status).toBe('thinking');
    expect(store.connections[0].decision).toBe('selected');
    await developing;

    expect(adaptationCalls()[0][1]).toEqual({
      course: COURSE,
      connection: {
        title: 'Idea 1',
        anchor: 'GDP',
        why: 'judged why',
        resources: [RESOURCE],
        background: []
      },
      lang: 'fr'
    });
    const { development } = store.connections[0];
    expect(development?.status).toBe('ready');
    expect(development?.proposal).toEqual(proposal());
    expect(development?.decision).toBe('pending');
    expect(store.hasWork).toBe(true);
  });

  it.each([
    [apiError(503, 'LLM_UNAVAILABLE'), 'unavailable'],
    [apiError(429, 'TOO_MANY_REQUESTS_IN_FLIGHT'), 'busy'],
    [apiError(413, 'COURSE_TOO_LARGE'), 'tooLarge'],
    [apiError(502, 'UNUSABLE_LLM_OUTPUT'), 'error'],
    [apiError(422), 'error']
  ])('says why a change could not be proposed (%#), and can try again', async (error, status) => {
    let fails = true;
    answerAll(() => (fails ? error : proposal()));
    const store = useConnectionsStore();
    await store.findConnections(COURSE, 'en');

    await store.develop('idea-1');
    expect(store.connections[0].development?.status).toBe(status);
    expect(store.connections[0].decision).toBe('selected');

    fails = false;
    await store.develop('idea-1');
    expect(store.connections[0].development?.status).toBe('ready');
  });

  it('keeps how long a busy API asks to wait, and forgets it once the change comes', async () => {
    let fails = true;
    answerAll(() =>
      fails
        ? {
            response: {
              status: 429,
              data: { detail: { message: 'm', code: 'RATE_LIMITED', retry_after: 12 } }
            }
          }
        : proposal()
    );
    const store = useConnectionsStore();
    await store.findConnections(COURSE, 'en');

    await store.develop('idea-1');
    expect(store.connections[0].development).toMatchObject({ status: 'busy', retryAfter: 12 });

    fails = false;
    await store.develop('idea-1');
    expect(store.connections[0].development).toMatchObject({ status: 'ready', retryAfter: null });
  });

  it('gives a guest past their daily changes the signup prompt, the card as before', async () => {
    answerAll(() => ({
      response: {
        status: 403,
        data: { detail: { code: 'GUEST_QUOTA_EXCEEDED', feature: 'adaptation' } }
      }
    }));
    const store = useConnectionsStore();
    await store.findConnections(COURSE, 'en');

    await store.develop('idea-1');

    expect(handleQuotaError).toHaveBeenCalled();
    expect(store.connections[0].development).toBeNull();
  });

  it('accepts, edits, keeps the original or reconsiders a change', async () => {
    answerAll(() => proposal());
    const store = useConnectionsStore();
    await store.findConnections(COURSE, 'en');
    await store.develop('idea-1');
    const development = () => store.connections[0].development!;

    store.acceptChange('idea-1');
    expect(development().decision).toBe('accepted');
    expect(development().edited).toBeNull();
    expect(store.acceptedChanges.map((change) => change.text)).toEqual([
      'Add the ecological footprint next to GDP.'
    ]);

    // the same wording, or blanks around it, is not an edit
    store.acceptChange('idea-1', '  Add the ecological footprint next to GDP. ');
    expect(development().edited).toBeNull();
    store.acceptChange('idea-1', 'My own wording.');
    expect(development().edited).toBe('My own wording.');
    expect(store.acceptedChanges[0].text).toBe('My own wording.');

    store.reconsider('idea-1');
    expect(development().decision).toBe('pending');
    expect(store.acceptedChanges).toEqual([]);

    store.keepOriginal('idea-1');
    expect(development().decision).toBe('kept');
    expect(store.acceptedChanges).toEqual([]);
  });

  it('leaves out the change of a connection no longer chosen, and keeps it', async () => {
    answerAll(() => proposal());
    const store = useConnectionsStore();
    await store.findConnections(COURSE, 'en');
    await store.develop('idea-1');
    store.acceptChange('idea-1');

    store.reopen('idea-1');
    expect(store.acceptedChanges).toEqual([]);
    store.select('idea-1');
    expect(store.acceptedChanges).toHaveLength(1);
  });

  it('places a change where the teacher says, a revised objective with its objective', () => {
    const development = {
      status: 'ready' as const,
      proposal: proposal({ original: null }),
      decision: 'pending' as const,
      edited: null as string | null,
      placement: null as string | null,
      retryAfter: null
    };
    const connection: Connection = {
      ...idea(1),
      decision: 'selected',
      evidence: null,
      isChecking: false,
      hasCheckFailed: false,
      development
    };
    expect(changeOf({ ...connection, development: null })).toBeNull();
    expect(changeOf(connection)?.placement).toBeNull();

    development.placement = 'Measure';
    expect(changeOf(connection)).toMatchObject({
      connectionId: 'idea-1',
      connection: 'Idea 1',
      placement: 'Measure',
      text: 'Add the ecological footprint next to GDP.'
    });

    development.proposal = proposal({ original: 'GDP' });
    expect(changeOf(connection)?.placement).toBe('Measure');

    development.proposal = proposal({ kind: 'objective', original: 'Define GDP.' });
    expect(changeOf(connection)?.placement).toBe('Define GDP.');
  });

  it(`runs at most ${MAX_PARALLEL_CHECKS} changes at a time, one per connection`, async () => {
    const pending: ((value: unknown) => void)[] = [];
    vi.mocked(basePostAxios).mockImplementation((url: string) => {
      if (url === '/tutor/course/connection_ideas') {
        const ideas = [idea(1), idea(2), idea(3)];
        return Promise.resolve({ data: { ideas, none_reason: null } } as PostResult);
      }
      if (url === '/tutor/course/connection_evidence') {
        return Promise.resolve({ data: evidence('supported') } as PostResult);
      }
      return new Promise<PostResult>((resolve) =>
        pending.push(resolve as (value: unknown) => void)
      );
    });
    const store = useConnectionsStore();
    await store.findConnections(COURSE, 'en');

    const developing = ['idea-1', 'idea-2', 'idea-3'].map((id) => store.develop(id));
    // a second click while it runs asks nothing more
    void store.develop('idea-1');
    await flushPromises();
    expect(adaptationCalls()).toHaveLength(MAX_PARALLEL_CHECKS);

    pending[0]({ data: proposal() });
    await flushPromises();
    expect(adaptationCalls()).toHaveLength(3);
    expect(store.connections[0].development?.status).toBe('ready');

    // a new search drops what the former one would still bring
    store.$reset();
    pending.slice(1).forEach((resolve) => resolve({ data: proposal() }));
    await Promise.all(developing);
    expect(store.connections).toEqual([]);
  });
});

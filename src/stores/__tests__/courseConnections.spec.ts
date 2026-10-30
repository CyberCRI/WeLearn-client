import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { basePostAxios, getSearch } from '@/utils/fetch';
import { useCourseConnectionsStore } from '@/stores/courseConnections';
import type { ConfirmedCourse } from '@/utils/connections';

vi.mock('@/utils/fetch', () => ({
  basePostAxios: vi.fn(),
  getSearch: vi.fn()
}));

const course: ConfirmedCourse = {
  title: 'Introduction à la macroéconomie',
  discipline: 'économie',
  level: 'L1 – S1',
  isLesson: false,
  topics: ['Le PIB', 'Le chômage'],
  sessions: [],
  objectives: ['Comprendre ce que mesure le PIB.'],
  description: null
};

const doc = (title: string, score: number, content = 'Le PIB ne mesure pas le bien-être.') => ({
  id: title,
  score,
  payload: {
    document_id: title,
    document_title: title,
    document_url: `https://example.org/${title}`,
    document_sdg: [8],
    document_corpus: 'insee',
    document_desc: '',
    document_details: {},
    slice_content: content,
    slice_sdg: 8,
    document_lang: 'fr',
    document_scrape_date: ''
  }
});

const answer = (value: unknown) => ({
  status: 200,
  data: { message_id: null, answer: JSON.stringify(value) }
});

const ideas = answer({
  ideas: [
    {
      title: 'Les limites du PIB',
      anchor: 'Le PIB',
      why: 'Le PIB ne mesure pas le bien-être.',
      how: 'Débat.',
      queries: ['limites du PIB bien-être', 'beyond GDP well-being']
    },
    {
      title: 'Chômage et transition',
      anchor: 'Le chômage',
      why: 'La transition change les emplois.',
      how: 'Étude de cas.',
      queries: ['emplois verts transition écologique']
    }
  ]
});

const keep = answer({
  keep: true,
  why: 'Le PIB ne dit rien du bien-être.',
  how: 'Débat en classe.',
  resources: [
    {
      document: 1,
      usefulness: 'Des indicateurs complémentaires.',
      evidence: 'Le PIB ne mesure pas le bien-être.'
    }
  ]
});

beforeEach(() => {
  setActivePinia(createPinia());
  vi.mocked(basePostAxios).mockReset();
  vi.mocked(getSearch).mockReset();
});

describe('courseConnections store', () => {
  it('finds ideas first, searches each with its own questions, then keeps only supported ones', async () => {
    vi.mocked(getSearch).mockImplementation(async (_n, options: any) => {
      const docs = options.query.startsWith('emplois')
        ? []
        : [doc('Indicateurs de richesse', 0.9), doc(`Résultat ${options.query}`, 0.5)];
      return { data: { docs, search_message_id: null } } as any;
    });
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(ideas as any)
      .mockResolvedValueOnce(keep as any);
    const store = useCourseConnectionsStore();
    await store.findConnections(course, 'fr');

    // one search per question, targeted on the idea
    // (ideas are searched in parallel: the order between ideas may vary)
    expect(
      vi
        .mocked(getSearch)
        .mock.calls.map(([, options]: any) => options.query)
        .sort()
    ).toEqual([
      'beyond GDP well-being',
      'emplois verts transition écologique',
      'limites du PIB bien-être'
    ]);
    // the idea without any resource is not judged, nor shown
    expect(basePostAxios).toHaveBeenCalledTimes(2);
    const [, selection] = vi.mocked(basePostAxios).mock.calls[1] as [string, any];
    expect(selection.sources).toHaveLength(3);
    expect(store.status).toBe('ready');
    expect(store.connections).toHaveLength(1);
    expect(store.connections[0]).toMatchObject({
      title: 'Les limites du PIB',
      anchor: 'Le PIB',
      decision: 'open'
    });
    expect(store.connections[0].resources[0].document.payload.document_title).toBe(
      'Indicateurs de richesse'
    );
    expect(store.isFor(course)).toBe(true);
  });

  it('an idea whose resources the AI rejects is dropped, never padded', async () => {
    vi.mocked(getSearch).mockResolvedValue({ data: { docs: [doc('Sans rapport', 1)] } } as any);
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(ideas as any)
      .mockResolvedValue(answer({ keep: false, resources: [] }) as any);
    const store = useCourseConnectionsStore();
    await store.findConnections(course, 'fr');

    expect(store.status).toBe('ready');
    expect(store.connections).toEqual([]);
  });

  it('unusable ideas are an error; an unreachable API is unavailable', async () => {
    vi.mocked(basePostAxios).mockResolvedValue({ status: 200, data: { answer: 'Désolé.' } } as any);
    const store = useCourseConnectionsStore();
    await store.findConnections(course, 'fr');
    expect(store.status).toBe('error');

    vi.mocked(basePostAxios).mockRejectedValue({ code: 'ERR_NETWORK' });
    await store.findConnections(course, 'fr');
    expect(store.status).toBe('unavailable');
  });

  it('develops a connection from its own resources; the teacher edits it as a whole', async () => {
    vi.mocked(getSearch).mockResolvedValue({
      data: { docs: [doc('Indicateurs de richesse', 1)] }
    } as any);
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(ideas as any)
      .mockResolvedValueOnce(keep as any)
      .mockResolvedValueOnce(answer({ keep: false }) as any);
    const store = useCourseConnectionsStore();
    await store.findConnections(course, 'fr');

    store.setAside(0);
    expect(store.connections[0].decision).toBe('setAside');
    store.bringBack(0);

    vi.mocked(basePostAxios).mockResolvedValueOnce(
      answer({
        title: 'Au-delà du PIB',
        placement: 'Séance sur le PIB',
        objective: 'Discuter les limites du PIB.',
        duration: '20 min',
        steps: ['Lire un extrait (Doc 1).', 'Discuter.'],
        student_task: 'Comparer deux indicateurs.',
        check: 'Une phrase de synthèse.',
        documents: [1]
      }) as any
    );
    await store.develop(0);
    const [, body] = vi.mocked(basePostAxios).mock.calls[3] as [string, any];
    expect(body.sources).toHaveLength(1);
    const adaptation = store.connections[0].adaptation!;
    expect(store.connections[0].decision).toBe('chosen');
    expect(adaptation.suggestion?.steps[0]).toBe('Lire un extrait (« Indicateurs de richesse »).');

    store.editAdaptation(0, '  Ma version.  ');
    expect(store.connections[0].adaptation?.editedText).toBe('Ma version.');
    store.restoreAdaptation(0);
    expect(store.connections[0].adaptation?.editedText).toBeNull();
  });

  it('ideas already proposed (a course from scratch) skip the ideas step', async () => {
    vi.mocked(getSearch).mockResolvedValue({
      data: { docs: [doc('Indicateurs de richesse', 1)] }
    } as any);
    vi.mocked(basePostAxios).mockResolvedValue(keep as any);
    const store = useCourseConnectionsStore();
    const proposed = {
      title: 'Les limites du PIB',
      anchor: 'Le PIB',
      why: 'Le PIB ne mesure pas le bien-être.',
      how: 'Débat.',
      queries: ['limites du PIB']
    };
    await store.findConnections(course, 'fr', [proposed]);

    // one selection call, no ideas call
    expect(basePostAxios).toHaveBeenCalledTimes(1);
    expect(store.connections[0].title).toBe('Les limites du PIB');
    expect(store.isFor(course, [proposed])).toBe(true);
    expect(store.isFor(course)).toBe(false);
  });
});

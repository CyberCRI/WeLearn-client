import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { basePostAxios, getSearch } from '@/utils/fetch';
import { useActivityDesignStore } from '@/stores/activityDesign';

vi.mock('@/utils/fetch', () => ({
  basePostAxios: vi.fn(),
  getSearch: vi.fn()
}));

const answer = (value: unknown) => ({ status: 200, data: { answer: JSON.stringify(value) } });
const doc = (title: string, content: string) => ({
  id: title,
  score: 1,
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

const queries = answer({ queries: ['indicateurs au-delà du PIB', 'beyond GDP indicators'] });
const ideas = answer({
  inventory: [
    {
      document: 1,
      contains: 'study',
      what: 'Une étude sur les limites du PIB.',
      quantitative: false,
      evidence: 'Le PIB ne dit rien du bien-être.'
    }
  ],
  ideas: [
    {
      title: 'Analyse critique d’une étude',
      type: 'analyse critique',
      students_do: 'Les étudiant·e·s analysent l’étude.',
      duration: '45 min',
      why: 'L’étude se prête à une lecture critique.',
      documents: [1],
      uses_data: false,
      scenario: null
    }
  ]
});
const activity = answer({
  title: 'Lire une étude sur le PIB',
  objective: 'Analyser une étude.',
  format: '45 min',
  student_instructions: 'Lisez et discutez.',
  provided_material: null,
  preparation: 'Partager le document (Doc 1).',
  steps: ['Lire (15 min).', 'Discuter (20 min).', 'Synthétiser (10 min).'],
  student_output: 'Une synthèse.',
  check: 'Une question de sortie.',
  limitation: null,
  greencomp: [],
  documents: [1]
});

beforeEach(() => {
  setActivePinia(createPinia());
  vi.mocked(basePostAxios).mockReset();
  vi.mocked(getSearch).mockReset();
  vi.mocked(getSearch).mockResolvedValue({
    data: { docs: [doc('Au-delà du PIB', 'Le PIB ne dit rien du bien-être.')] }
  } as any);
});

describe('activityDesign store', () => {
  it('takes the context from a confirmed course without overwriting what the teacher typed', () => {
    const store = useActivityDesignStore();
    store.useCourse({ title: 'Macroéconomie', discipline: 'Économie', level: 'L1' });
    expect(store.context).toMatchObject({ subject: 'Macroéconomie', students: 'Économie, L1' });
    store.$reset();
    store.context.subject = 'Mon sujet';
    store.useCourse({ title: 'Macroéconomie', discipline: null, level: null });
    expect(store.context.subject).toBe('Mon sujet');
  });

  it('searches resources first, then suggests the activities they support', async () => {
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(queries as any)
      .mockResolvedValueOnce(ideas as any);
    const store = useActivityDesignStore();
    store.context.subject = 'Les limites du PIB';
    await store.suggestIdeas();

    expect(vi.mocked(getSearch).mock.calls.map(([, options]: any) => options.query)).toEqual([
      'indicateurs au-delà du PIB',
      'beyond GDP indicators'
    ]);
    const [, ideasBody] = vi.mocked(basePostAxios).mock.calls[1] as [string, any];
    expect(ideasBody.sources).toHaveLength(1);
    expect(store.ideasStatus).toBe('ready');
    expect(store.ideas[0].resources[0].material).toBe('study');
  });

  it('searches the key concepts when too few documents are on the subject, then says none were found', async () => {
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(
        answer({
          concepts: [
            ['béton', 'concrete'],
            ['bois', 'timber']
          ],
          queries: ['q1', 'q2']
        }) as any
      )
      .mockResolvedValueOnce(
        answer({
          inventory: [],
          ideas: [
            {
              title: 'Débat',
              approach: 'structured_debate',
              students_do: 'Les étudiant·e·s débattent.',
              duration: '1 h',
              why: 'Parce que.',
              documents: [],
              uses_data: false,
              scenario: 'Deux positions sur un projet fictif.'
            }
          ]
        }) as any
      );
    const store = useActivityDesignStore();
    store.context.subject = 'Béton ou bois';
    await store.suggestIdeas();

    expect(vi.mocked(getSearch).mock.calls.map(([, options]: any) => options.query)).toEqual([
      'q1',
      'q2',
      'béton bois',
      'concrete timber'
    ]);
    expect(store.candidates).toEqual([]);
    expect(store.retrieval?.rejected[0].reason).toBe('missing: béton, bois');
    expect(store.ideas.map((idea) => idea.title)).toEqual(['Débat']);
  });

  it('another approach asks for other methods, and says why one the context rules out is not offered', async () => {
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(queries as any)
      .mockResolvedValueOnce(ideas as any)
      .mockResolvedValueOnce(activity as any)
      .mockResolvedValueOnce(ideas as any);
    const store = useActivityDesignStore();
    store.context.subject = 'Les limites du PIB';
    store.context.time = '45 minutes';
    await store.suggestIdeas();
    await store.choose(store.ideas[0]);
    const tried = store.activity?.approach;
    store.preferredType = 'Projet avec une communauté';
    await store.tryAnotherApproach();

    const [, body] = vi.mocked(basePostAxios).mock.calls[3] as [string, any];
    expect(tried).toBeTruthy();
    expect(body.query).toContain('autre approche que');
    // the community project is not asked for: the context names no partner
    expect(body.query).not.toContain('Projet avec une communauté');
    expect(store.methodNotice).toEqual({ approach: 'community_project', reason: 'needsPartner' });
    expect(store.activity).toBeNull();
    // the resources already found are reused: no new search (two questions searched at first)
    expect(vi.mocked(getSearch)).toHaveBeenCalledTimes(2);
  });

  it('“other ideas” reuse the resources already found, without searching again', async () => {
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(queries as any)
      .mockResolvedValue(ideas as any);
    const store = useActivityDesignStore();
    store.context.subject = 'Les limites du PIB';
    await store.suggestIdeas();
    store.preferredType = 'débat';
    await store.suggestIdeas(true);

    expect(getSearch).toHaveBeenCalledTimes(2);
    const [, body] = vi.mocked(basePostAxios).mock.calls[2] as [string, any];
    expect(body.query).toContain('Analyse critique d’une étude');
    expect(body.query).toContain('débat');
  });

  it('choosing an idea only writes the activity, from its verified resources', async () => {
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(queries as any)
      .mockResolvedValueOnce(ideas as any);
    const store = useActivityDesignStore();
    store.context.subject = 'Les limites du PIB';
    store.context.time = '45 min';
    await store.suggestIdeas();

    vi.mocked(basePostAxios).mockResolvedValueOnce(activity as any);
    await store.choose(store.ideas[0]);
    expect(basePostAxios).toHaveBeenCalledTimes(3);
    expect(store.activityStatus).toBe('ready');
    expect(store.resources).toHaveLength(1);
    expect(store.activity?.preparation).toBe('Partager le document (« Au-delà du PIB »).');

    store.setEditedText('  Ma version.  ');
    expect(store.editedText).toBe('Ma version.');
  });

  it('the teacher’s own idea is developed with the resources already verified', async () => {
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(queries as any)
      .mockResolvedValueOnce(ideas as any);
    const store = useActivityDesignStore();
    store.context.subject = 'Les limites du PIB';
    await store.suggestIdeas();

    vi.mocked(basePostAxios).mockResolvedValueOnce(activity as any);
    await store.chooseOwnIdea('Un débat mouvant.');
    expect(store.chosen?.isTeacherIdea).toBe(true);
    expect(store.chosen?.resources).toHaveLength(1);
  });

  it('an unreachable API is said plainly', async () => {
    vi.mocked(basePostAxios).mockRejectedValue({ code: 'ERR_NETWORK' });
    const store = useActivityDesignStore();
    store.context.subject = 'Les limites du PIB';
    await store.suggestIdeas();
    expect(store.ideasStatus).toBe('unavailable');
  });
});

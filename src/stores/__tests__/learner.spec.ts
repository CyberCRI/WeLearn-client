import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { basePostAxios, getSearch } from '@/utils/fetch';
import { useLearnerStore } from '@/stores/learner';

vi.mock('@/utils/fetch', () => ({
  basePostAxios: vi.fn(),
  getSearch: vi.fn()
}));

const answer = (value: unknown) => ({
  status: 200,
  data: { answer: typeof value === 'string' ? value : JSON.stringify(value) }
});

// a real conversation never gets the same reply twice (the tutor now refuses to repeat itself)
const distinctReplies = () => {
  const replies = [
    'Where have you noticed this?',
    'Tell me about your street.',
    'Rivers carry water from mountains.',
    'Markets change with seasons.',
    'Buses connect villages daily.',
    'Forests store carbon.'
  ];
  let index = 0;
  return () => Promise.resolve(answer({ reply: replies[index++ % replies.length], space: null }));
};

beforeEach(() => {
  sessionStorage.clear();
  setActivePinia(createPinia());
  vi.mocked(basePostAxios).mockReset();
  vi.mocked(getSearch).mockReset();
  vi.mocked(getSearch).mockResolvedValue({ data: { docs: [] } } as any);
});

describe('learner store', () => {
  it('holds an open conversation: each message gets a reply, no goal is extracted', async () => {
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(answer({ reply: 'What do you notice about it?', space: null }) as any)
      .mockResolvedValueOnce(
        answer({
          reply: 'Night heat stays in streets with stone and little shade.',
          space: null
        }) as any
      );
    const store = useLearnerStore();
    store.greet('What brings you here today?');
    await store.choose('exploring', 'I’m just exploring');
    await store.discover('Summers are getting hard where I live, mostly at night.');
    expect(store.turnsOf('start').map((turn) => [turn.role, !!turn.isChoice])).toEqual([
      ['tutor', false],
      ['learner', true],
      ['tutor', false],
      ['learner', false],
      ['tutor', false]
    ]);
    // the whole conversation goes to the AI each time, with the learner's latest message
    const [, body] = vi.mocked(basePostAxios).mock.calls[1] as [string, any];
    expect(body.sources[0].payload.slice_content).toContain('I’m just exploring');
    expect(body.query).toContain('Summers are getting hard where I live');
    expect(store.thread.purpose).toBe('');
  });

  it('carries the thread into every space’s tutor, and says so when the AI is unreachable', async () => {
    vi.mocked(basePostAxios).mockResolvedValueOnce(answer('Heat islands form when…') as any);
    const store = useLearnerStore();
    store.thread.purpose = 'I want to understand urban heat.';
    store.setTopic('urban heat');
    await store.ask('understand', 'explain', 'urban heat island');
    const [, body] = vi.mocked(basePostAxios).mock.calls[0] as [string, any];
    expect(body.sources[0].payload.slice_content).toContain('I want to understand urban heat.');
    expect(store.turnsOf('understand').at(-1)).toEqual({
      role: 'tutor',
      text: 'Heat islands form when…'
    });

    vi.mocked(basePostAxios).mockRejectedValueOnce(new Error('network'));
    await store.ask('investigate', 'chat', 'Is it getting worse?');
    expect(store.status.investigate).toBe('unavailable');
  });

  it('investigates with the real search, keeps only what the sources say, and starts over cleanly', async () => {
    const study = {
      score: 0.8,
      payload: {
        document_id: 'easterlin',
        document_title: 'Growth and happiness',
        document_url: 'https://example.org/easterlin',
        document_corpus: 'hal',
        document_desc: '',
        document_details: {},
        slice_content: 'Higher income does not always raise happiness over time.',
        document_sdg: [8],
        document_lang: 'en',
        slice_sdg: null
      }
    };
    vi.mocked(getSearch).mockResolvedValue({ data: { docs: [study] } } as any);
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(
        answer({
          concepts: [{ fr: 'croissance', en: 'growth', synonyms: [], core: false }],
          period: null,
          queries: ['economic growth and wellbeing evidence']
        }) as any
      )
      .mockResolvedValueOnce(
        answer({
          sources: [
            {
              document: 1,
              says: 'Income growth does not always raise happiness.',
              quote: 'Higher income does not always raise happiness over time.',
              kind: 'evidence',
              position: 'challenges',
              limits: null
            }
          ],
          set_aside: []
        }) as any
      );
    const store = useLearnerStore();
    await store.investigate('Does economic growth always improve wellbeing?');
    expect(store.evidence?.items.map((item) => item.quoteFrom)).toEqual(['excerpt']);
    expect(store.thread.topic).toBe('Does economic growth always improve wellbeing?');

    store.toggleResource(store.evidence!.items[0].document);
    store.addNote('investigate', 'Growth helps up to a point.');
    expect(store.thread.resources).toHaveLength(1);

    store.startOver();
    expect(store.thread).toMatchObject({ topic: '', purpose: '', resources: [], notes: [] });
    expect(sessionStorage.getItem('learnerThread')).toBeNull();
  });
});

describe('learner store: a doubt is not a question to search for', () => {
  it('does not search WeLearn when the learner asks why sustainability matters to them', async () => {
    vi.mocked(basePostAxios).mockResolvedValue(
      answer({
        reply: 'That’s a fair question. Which country or region do you live in?',
        space: null
      }) as any
    );
    const store = useLearnerStore();
    await store.discover('Why am I supposed to think about sustainability?');
    expect(vi.mocked(getSearch)).not.toHaveBeenCalled();
  });
});

describe('learner store: a suggested space is a link with its topic, never automatic', () => {
  it('keeps the suggestion on the reply, and carries the topic only when the learner opens it', async () => {
    vi.mocked(basePostAxios).mockResolvedValueOnce(
      answer({
        reply: 'Comparing how schools are funded could help. You can look at evidence on it.',
        topic: 'school funding and conditions',
        space: 'investigate'
      }) as any
    );
    const store = useLearnerStore();
    await store.discover('My school building is falling apart and nobody fixes it.');
    const turn = store.turnsOf('start').at(-1)!;
    expect(turn).toMatchObject({ space: 'investigate', topic: 'school funding and conditions' });
    expect(store.thread.topic).toBe('');
    store.openSuggestedSpace(turn);
    expect(store.thread.topic).toBe('school funding and conditions');
  });
});

describe('learner store: a clear question gets real WeLearn documents', () => {
  it('searches WeLearn for a clear question, and the answer can rest on what it finds', async () => {
    const doc = {
      score: 0.8,
      payload: {
        document_id: 'heat',
        document_title: 'Urban heat island',
        document_url: 'https://example.org/heat',
        document_corpus: 'wikipedia',
        document_desc: '',
        document_details: {},
        slice_content: 'Cities are warmer than their surroundings.',
        document_sdg: [11],
        document_lang: 'en',
        slice_sdg: null
      }
    };
    vi.mocked(getSearch).mockResolvedValue({ data: { docs: [doc] } } as any);
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(
        answer({ reply: 'They store heat, as [Doc 2] explains.', space: null }) as any
      )
      .mockImplementation(distinctReplies() as any);
    const store = useLearnerStore();
    await store.discover('Why are cities hotter at night?');
    expect(vi.mocked(getSearch)).toHaveBeenCalledTimes(1);
    const [, body] = vi.mocked(basePostAxios).mock.calls[0] as [string, any];
    expect(body.sources[1].payload.document_title).toContain('Urban heat island');
    expect(store.turnsOf('start').at(-1)?.text).toBe(
      'They store heat, as « Urban heat island » explains.'
    );

    // a statement, not a question: no new search
    await store.discover('I live in a big city.');
    expect(vi.mocked(getSearch)).toHaveBeenCalledTimes(1);
  });
});

describe('learner store: searching for substance, not for meta questions', () => {
  it('never searches for "Is this the topic?", and searches a substantive statement on the conversation topic', async () => {
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(
        answer({
          reply: 'Heat builds up in dense cities.',
          topic: 'urban heat and housing',
          space: null
        }) as any
      )
      .mockImplementation(distinctReplies() as any);
    const store = useLearnerStore();
    await store.discover('The summers here are getting really hot.');
    await store.discover('Is this the topic?');
    expect(vi.mocked(getSearch)).not.toHaveBeenCalled();
    await store.discover('I cannot afford air conditioning and my flat gets unbearable.');
    const [, options] = vi.mocked(getSearch).mock.calls[0] as [number, any];
    expect(options.query).toContain('urban heat and housing');
  });
});

describe('learner store: memory within the conversation, and only relevant sources', () => {
  it('keeps what each reply did, drops off-subject documents, and asks nothing after "just tell me"', async () => {
    const heat = {
      score: 0.8,
      payload: {
        document_id: 'heat',
        document_title: 'Urban heat and housing',
        document_url: 'https://example.org/heat',
        document_corpus: 'wikipedia',
        document_desc: '',
        document_details: {},
        slice_content: 'Poorly insulated flats overheat.',
        document_sdg: [11],
        document_lang: 'en',
        slice_sdg: null
      }
    };
    const medical = {
      ...heat,
      payload: {
        ...heat.payload,
        document_id: 'statins',
        document_title: 'Statin therapy outcomes',
        slice_content: 'Patients were followed for five years.'
      }
    };
    vi.mocked(getSearch).mockResolvedValue({ data: { docs: [heat, medical] } } as any);
    vi.mocked(basePostAxios)
      .mockResolvedValueOnce(
        answer({
          reply: 'Dense streets keep heat at night.',
          move: 'explain',
          concepts: ['urban heat island'],
          focus: ['urban heat', 'housing'],
          topic: 'heat in cities',
          space: null
        }) as any
      )
      .mockResolvedValueOnce(
        answer({
          reply: 'Insulation decides much of it. Who pays for it?',
          move: 'answer',
          space: null
        }) as any
      );
    const store = useLearnerStore();
    await store.discover('Summers are getting hard in my flat, mostly at night.');
    expect(store.turnsOf('start').at(-1)).toMatchObject({
      move: 'explain',
      concepts: ['urban heat island'],
      topic: 'heat in cities'
    });
    await store.discover('Just tell me: why do some flats get hotter than others?');
    // the second request carries the memory, and only the document about the subject
    const [, body] = vi.mocked(basePostAxios).mock.calls[1] as [string, any];
    expect(body.query).toContain('urban heat island');
    expect(body.sources.slice(1).map((source: any) => source.payload.document_title)).toEqual([
      'Urban heat and housing'
    ]);
    // a learner who asked for a direct answer gets one without a question back
    expect(store.turnsOf('start').at(-1)?.text).toBe('Insulation decides much of it.');
  });
});

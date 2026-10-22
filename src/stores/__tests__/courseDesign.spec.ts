import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { basePostAxios } from '@/utils/fetch';
import { useCourseDesignStore } from '@/stores/courseDesign';
import type { SyllabusExtraction } from '@/types';

vi.mock('@/utils/fetch', () => ({
  basePostAxios: vi.fn()
}));

const extraction = (overrides: Partial<SyllabusExtraction> = {}): SyllabusExtraction => ({
  detected_document_type: 'syllabus',
  confidence: 0.95,
  summary: null,
  description: 'A course description.',
  objectives: ['Explain supply.', 'Analyse markets.'],
  reasoning: null,
  ...overrides
});

const syllabusFile = () => new File(['course'], 'syllabus.txt', { type: 'text/plain' });

beforeEach(() => {
  setActivePinia(createPinia());
  vi.mocked(basePostAxios).mockReset();
});

describe('courseDesign store: example syllabus', () => {
  it('shows the fictional example without sending anything', () => {
    const store = useCourseDesignStore();
    store.loadExample();

    expect(basePostAxios).not.toHaveBeenCalled();
    expect(store.status).toBe('ready');
    expect(store.isExample).toBe(true);
    expect(store.description?.origin).toBe('extracted');
    expect(store.objectives).toHaveLength(3);
    expect(store.objectives.every((objective) => objective.origin === 'extracted')).toBe(true);
  });
});

describe('courseDesign store: demonstration paths never depend on the API', () => {
  it('the example still works right after a failed upload', async () => {
    vi.mocked(basePostAxios).mockRejectedValue({ code: 'ERR_NETWORK' });
    const store = useCourseDesignStore();
    store.setFile(syllabusFile());
    await store.readSyllabus();
    expect(store.status).toBe('unavailable');

    store.loadExample();
    expect(store.status).toBe('ready');
    expect(store.isExample).toBe(true);
    expect(basePostAxios).toHaveBeenCalledTimes(1);
  });

  it('pasted text is kept as the original, nothing is read from it or sent', () => {
    const store = useCourseDesignStore();
    store.loadPastedText('  My course: Environmental law, 24 hours.  ');

    expect(basePostAxios).not.toHaveBeenCalled();
    expect(store.status).toBe('ready');
    expect(store.isPasted).toBe(true);
    expect(store.pastedText).toBe('My course: Environmental law, 24 hours.');
    expect(store.description).toBeNull();
    expect(store.objectives).toEqual([]);

    store.updateDescription('Environmental law for second-year students.');
    expect(store.description?.origin).toBe('added');
  });

  it('empty pasted text is ignored', () => {
    const store = useCourseDesignStore();
    store.loadPastedText('   ');
    expect(store.status).toBe('idle');
  });
});

describe('courseDesign store: teacher corrections', () => {
  it('marks a changed text as corrected, keeps the original and can restore it', () => {
    const store = useCourseDesignStore();
    store.loadExample();
    const original = store.description?.value;

    store.updateDescription('My own description.');
    expect(store.description).toMatchObject({
      value: 'My own description.',
      origin: 'edited',
      original
    });

    store.restoreDescription();
    expect(store.description).toMatchObject({ value: original, origin: 'extracted' });
  });

  it('typing the original text back makes it extracted again', () => {
    const store = useCourseDesignStore();
    store.loadExample();
    const original = store.objectives[0].value;

    store.updateObjective(0, 'Changed.');
    expect(store.objectives[0].origin).toBe('edited');
    store.updateObjective(0, original);
    expect(store.objectives[0].origin).toBe('extracted');
  });

  it('adds objectives as the teacher’s, and only those can be removed', () => {
    const store = useCourseDesignStore();
    store.loadExample();

    store.addObjective('  Discuss market failures.  ');
    expect(store.objectives[3]).toEqual({ value: 'Discuss market failures.', origin: 'added' });

    store.removeObjective(0);
    expect(store.objectives).toHaveLength(4);
    store.removeObjective(3);
    expect(store.objectives).toHaveLength(3);
  });

  it('a programme-level mark changes nothing else and can be undone', () => {
    const store = useCourseDesignStore();
    store.loadExample();
    const before = { ...store.objectives[1] };

    store.toggleProgrammeObjective(1);
    expect(store.objectives[1]).toEqual({ ...before, isProgramme: true });
    store.toggleProgrammeObjective(1);
    expect(store.objectives[1]).toEqual({ ...before, isProgramme: false });
  });

  it('overview lines start empty and are only ever added by the teacher', () => {
    const store = useCourseDesignStore();
    store.loadExample();

    expect(Object.values(store.overview)).toEqual([null, null, null]);
    store.setOverview('title', '  Macroéconomie  ');
    expect(store.overview.title).toEqual({ value: 'Macroéconomie', origin: 'added' });
    store.setOverview('title', '');
    expect(store.overview.title).toBe(null);
  });

  it('a missing description stays missing until the teacher adds one', async () => {
    vi.mocked(basePostAxios).mockResolvedValue({
      status: 200,
      data: extraction({ description: null })
    } as any);
    const store = useCourseDesignStore();
    store.setFile(syllabusFile());
    await store.readSyllabus();

    expect(store.description).toBeNull();
    store.updateDescription('Written by me.');
    expect(store.description).toEqual({ value: 'Written by me.', origin: 'added' });
    store.updateDescription('');
    expect(store.description).toBeNull();
  });
});

describe('courseDesign store: upload and real reading', () => {
  it('refuses files that are too big or of the wrong type', () => {
    const store = useCourseDesignStore();

    store.setFile(new File(['x'], 'image.png', { type: 'image/png' }));
    expect(store.uploadError).toBe('BAD_EXTENSION');
    expect(store.file).toBeNull();

    const big = new File(['x'], 'big.pdf', { type: 'application/pdf' });
    Object.defineProperty(big, 'size', { value: 6 * 1024 * 1024 });
    store.setFile(big);
    expect(store.uploadError).toBe('BIG_FILE');
  });

  it('sends the syllabus once to the extraction endpoint and shows what it returned', async () => {
    vi.mocked(basePostAxios).mockResolvedValue({ status: 200, data: extraction() } as any);
    const store = useCourseDesignStore();
    store.setFile(syllabusFile());
    store.language = 'fr';
    await store.readSyllabus();

    expect(basePostAxios).toHaveBeenCalledTimes(1);
    const [path, body] = vi.mocked(basePostAxios).mock.calls[0];
    expect(path).toBe('/tutor/mas_files/content?lang=fr&mode=mode_2');
    expect(body).toBeInstanceOf(FormData);
    expect(store.status).toBe('ready');
    expect(store.source).toBe('upload');
    expect(store.objectives.map((objective) => objective.value)).toEqual([
      'Explain supply.',
      'Analyse markets.'
    ]);
  });

  it('says the reading is unavailable when the API cannot be reached or refuses access', async () => {
    const store = useCourseDesignStore();
    store.setFile(syllabusFile());

    vi.mocked(basePostAxios).mockRejectedValue({ code: 'ERR_NETWORK' });
    await store.readSyllabus();
    expect(store.status).toBe('unavailable');

    vi.mocked(basePostAxios).mockRejectedValue({ response: { status: 403 } });
    await store.readSyllabus();
    expect(store.status).toBe('unavailable');
  });

  it('reports other failures as an error, never as a result', async () => {
    const store = useCourseDesignStore();
    store.setFile(syllabusFile());

    vi.mocked(basePostAxios).mockRejectedValue({ response: { status: 500 } });
    await store.readSyllabus();
    expect(store.status).toBe('error');
    expect(store.extraction).toBeNull();

    vi.mocked(basePostAxios).mockResolvedValue({ status: 204, data: '' } as any);
    await store.readSyllabus();
    expect(store.status).toBe('error');
  });
});

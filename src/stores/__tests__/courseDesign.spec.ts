import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { basePostAxios } from '@/utils/fetch';
import { readSyllabusText } from '@/utils/syllabusText';
import { useCourseDesignStore } from '@/stores/courseDesign';
import type { SyllabusExtraction } from '@/types';

vi.mock('@/utils/fetch', () => ({
  basePostAxios: vi.fn()
}));

// jsdom cannot read files: the text the browser would read is given here
vi.mock('@/utils/syllabusText', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/utils/syllabusText')>()),
  readSyllabusText: vi.fn()
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
  // by default no readable text: the basic reading
  vi.mocked(readSyllabusText).mockResolvedValue(null);
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

  it('overview lines missing from the reading are added by the teacher, and can be removed', () => {
    const store = useCourseDesignStore();
    store.loadExample();

    expect(Object.values(store.overview)).toEqual([null, null, null]);
    store.updateOverview('title', '  Macroéconomie  ');
    expect(store.overview.title).toEqual({ value: 'Macroéconomie', origin: 'added' });
    store.updateOverview('title', '');
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

const FRENCH_SYLLABUS = `Licence 1 – Semestre 2
Statistiques descriptives pour les sciences sociales
Présentation du cours
Ce cours initie les étudiants aux outils de base de la statistique descriptive.
Contenu du cours
- Moyenne, médiane et mode
- Corrélation linéaire
Objectifs du cours
1. Construire et lire un tableau croisé.
Compétences visées par la mention
- Exercer un esprit critique sur les sources et les données.
Plan des séances
Séance 1 : Tendance centrale`;

const frenchFile = () => new File([FRENCH_SYLLABUS], 'stats.txt', { type: 'text/plain' });

const answer = (overrides: Record<string, unknown> = {}) => ({
  status: 200,
  data: {
    message_id: null,
    conversation_id: null,
    answer: JSON.stringify({
      title: 'Statistiques descriptives pour les sciences sociales',
      discipline: null,
      level: 'Licence 1 – Semestre 2',
      description:
        'Ce cours initie les étudiants aux outils de base de la statistique descriptive.',
      topics: ['Moyenne, médiane et mode', 'Corrélation linéaire'],
      sessions: [{ label: 'Séance 1', title: 'Tendance centrale' }],
      objectives: [
        { text: 'Construire et lire un tableau croisé.', scope: 'course' },
        { text: 'Exercer un esprit critique sur les sources et les données.', scope: 'programme' }
      ],
      document_language: 'fr',
      ...overrides
    })
  }
});

describe('courseDesign store: full reading by WeLearn AI', () => {
  beforeEach(() => {
    vi.mocked(readSyllabusText).mockResolvedValue(FRENCH_SYLLABUS);
  });

  it('sends the syllabus text once, with instructions in its own language', async () => {
    vi.mocked(basePostAxios).mockResolvedValue(answer() as any);
    const store = useCourseDesignStore();
    store.setFile(frenchFile());
    await store.readSyllabus();

    expect(basePostAxios).toHaveBeenCalledTimes(1);
    const [path, body] = vi.mocked(basePostAxios).mock.calls[0] as [string, any];
    expect(path).toBe('/qna/chat/answer');
    expect(body.sources).toHaveLength(1);
    expect(body.sources[0].payload.slice_content).toBe(FRENCH_SYLLABUS);
    expect(body.query).toContain('Recopie chaque valeur mot pour mot');
    expect(store.readingMode).toBe('full');
    expect(store.status).toBe('ready');
  });

  it('fills the course card from the syllabus, keeping the original for every field', async () => {
    vi.mocked(basePostAxios).mockResolvedValue(answer() as any);
    const store = useCourseDesignStore();
    store.setFile(frenchFile());
    await store.readSyllabus();

    expect(store.overview.title).toEqual({
      value: 'Statistiques descriptives pour les sciences sociales',
      origin: 'extracted',
      original: 'Statistiques descriptives pour les sciences sociales'
    });
    expect(store.overview.level?.value).toBe('Licence 1 – Semestre 2');
    expect(store.overview.discipline).toBeNull();
    expect(store.topics?.value).toBe('Moyenne, médiane et mode\nCorrélation linéaire');
    expect(store.sessions?.value).toBe('Séance 1 · Tendance centrale');
    expect(store.objectives.map((objective) => objective.isProgramme)).toEqual([false, true]);
    expect(store.droppedCount).toBe(0);
  });

  it('never shows a value that is not written in the syllabus, and counts it', async () => {
    vi.mocked(basePostAxios).mockResolvedValue(
      answer({
        discipline: 'Sociologie',
        topics: ['Moyenne, médiane et mode', 'Mean and median']
      }) as any
    );
    const store = useCourseDesignStore();
    store.setFile(frenchFile());
    await store.readSyllabus();

    expect(store.overview.discipline).toBeNull();
    expect(store.topics?.value).toBe('Moyenne, médiane et mode');
    expect(store.droppedCount).toBe(2);
  });

  it('an answer that is not the expected structure is an error, never a result', async () => {
    vi.mocked(basePostAxios).mockResolvedValue({
      status: 200,
      data: { answer: 'Désolé, je ne peux pas répondre.' }
    } as any);
    const store = useCourseDesignStore();
    store.setFile(frenchFile());
    await store.readSyllabus();

    expect(store.status).toBe('error');
    expect(store.overview.title).toBeNull();
  });

  it('topics and sessions can be corrected and restored like any read text', async () => {
    vi.mocked(basePostAxios).mockResolvedValue(answer() as any);
    const store = useCourseDesignStore();
    store.setFile(frenchFile());
    await store.readSyllabus();

    store.updateTopics('Moyenne, médiane et mode\n\n  Tableaux croisés  ');
    expect(store.topics).toMatchObject({
      value: 'Moyenne, médiane et mode\nTableaux croisés',
      origin: 'edited'
    });
    store.restoreTopics();
    expect(store.topics?.origin).toBe('extracted');

    store.updateSessions('Séance 1 · Moyenne');
    expect(store.sessions?.origin).toBe('edited');
    store.restoreSessions();
    expect(store.sessions?.value).toBe('Séance 1 · Tendance centrale');
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

describe('courseDesign store: material of different shapes', () => {
  beforeEach(() => {
    vi.mocked(readSyllabusText).mockResolvedValue(FRENCH_SYLLABUS);
  });

  it('a document holding several courses waits for the teacher, then reads only the chosen one', async () => {
    vi.mocked(basePostAxios).mockResolvedValueOnce(
      answer({
        courses_found: [
          'Statistiques descriptives pour les sciences sociales',
          'Moyenne, médiane et mode'
        ]
      }) as any
    );
    const store = useCourseDesignStore();
    store.setFile(frenchFile());
    await store.readSyllabus();

    expect(store.status).toBe('choosing');
    expect(store.coursesFound).toHaveLength(2);
    expect(store.overview.title).toBeNull();

    vi.mocked(basePostAxios).mockResolvedValueOnce(answer() as any);
    await store.chooseCourse('Moyenne, médiane et mode');
    const [, body] = vi.mocked(basePostAxios).mock.calls[1] as [string, any];
    expect(body.query).toContain('« Moyenne, médiane et mode »');
    expect(body.sources[0].payload.slice_content).toBe(FRENCH_SYLLABUS);
    expect(store.status).toBe('ready');
    expect(store.focusCourse).toBe('Moyenne, médiane et mode');
  });

  it('the teacher can say it is one course after all, without another request', async () => {
    vi.mocked(basePostAxios).mockResolvedValueOnce(
      answer({
        courses_found: [
          'Statistiques descriptives pour les sciences sociales',
          'Corrélation linéaire'
        ]
      }) as any
    );
    const store = useCourseDesignStore();
    store.setFile(frenchFile());
    await store.readSyllabus();
    store.keepWholeDocument();

    expect(basePostAxios).toHaveBeenCalledTimes(1);
    expect(store.status).toBe('ready');
    expect(store.overview.title?.value).toBe(
      'Statistiques descriptives pour les sciences sociales'
    );
  });

  it('keeps the material type as the AI interpreted it, until the teacher changes it', async () => {
    vi.mocked(basePostAxios).mockResolvedValue(answer({ material_type: 'lesson' }) as any);
    const store = useCourseDesignStore();
    store.setFile(frenchFile());
    await store.readSyllabus();

    expect(store.materialType).toBe('lesson');
    expect(store.isMaterialTypeChanged).toBe(false);
    expect(store.confirmedCourse.isLesson).toBe(true);
    store.setMaterialType('syllabus');
    expect(store.isMaterialTypeChanged).toBe(true);
    expect(store.confirmedCourse.isLesson).toBe(false);
  });

  it('the confirmed course carries the teacher’s corrections and leaves programme objectives out', async () => {
    vi.mocked(basePostAxios).mockResolvedValue(answer() as any);
    const store = useCourseDesignStore();
    store.setFile(frenchFile());
    await store.readSyllabus();
    store.updateOverview('title', 'Statistiques (L1)');

    expect(store.confirmedCourse).toMatchObject({
      title: 'Statistiques (L1)',
      topics: ['Moyenne, médiane et mode', 'Corrélation linéaire'],
      objectives: ['Construire et lire un tableau croisé.']
    });
  });

  it('accepts excel files', () => {
    const store = useCourseDesignStore();
    store.setFile(new File(['x'], 'plan.xlsx', { type: '' }));
    expect(store.uploadError).toBeNull();
    expect(store.file?.name).toBe('plan.xlsx');
  });
});

describe('courseDesign store: a course from scratch', () => {
  const proposalAnswer = {
    status: 200,
    data: {
      answer: JSON.stringify({
        title: 'Macroéconomie et transition',
        purpose: 'Comprendre les grands agrégats.',
        discipline: 'Économie',
        level: 'L1',
        objectives: ['Définir le PIB.', 'Expliquer le chômage.'],
        topics: ['Le PIB', 'Le chômage'],
        sessions: ['Séance 1 : Le PIB'],
        activities: ['Étude de cas'],
        assessment: ['Examen écrit'],
        sustainability: [
          {
            title: 'Les limites du PIB',
            anchor: 'Le PIB',
            why: 'Le PIB ne mesure pas le bien-être.',
            how: 'Débat.',
            queries: ['limites du PIB', 'beyond GDP']
          }
        ]
      })
    }
  };

  it('sends the brief once and shows every part as WeLearn’s proposal', async () => {
    vi.mocked(basePostAxios).mockResolvedValue(proposalAnswer as any);
    const store = useCourseDesignStore();
    store.brief.idea = 'Une introduction à la macroéconomie';
    store.brief.disciplineLevel = 'Économie, L1';
    await store.draftProposal();

    expect(basePostAxios).toHaveBeenCalledTimes(1);
    const [path, body] = vi.mocked(basePostAxios).mock.calls[0] as [string, any];
    expect(path).toBe('/qna/chat/answer');
    expect(body.sources[0].payload.slice_content).toContain('Économie, L1');
    expect(store.status).toBe('ready');
    expect(store.isScratch).toBe(true);
    expect(store.overview.title).toMatchObject({
      value: 'Macroéconomie et transition',
      origin: 'suggested',
      isSuggestion: true
    });
    expect(store.activities?.value).toBe('Étude de cas');
    expect(store.keptIdeas.map((idea) => idea.title)).toEqual(['Les limites du PIB']);
  });

  it('the teacher keeps, edits, restores or rejects any proposed part', async () => {
    vi.mocked(basePostAxios).mockResolvedValue(proposalAnswer as any);
    const store = useCourseDesignStore();
    store.brief.idea = 'Une introduction à la macroéconomie';
    await store.draftProposal();

    store.updateOverview('title', 'Introduction à la macroéconomie');
    expect(store.overview.title?.origin).toBe('edited');
    store.restoreOverview('title');
    expect(store.overview.title?.origin).toBe('suggested');

    store.removeObjective(1);
    expect(store.objectives.map((objective) => objective.value)).toEqual(['Définir le PIB.']);
    store.updateAssessment('');
    expect(store.assessment).toBeNull();

    store.toggleOpportunity(0);
    expect(store.keptIdeas).toEqual([]);
    expect(store.confirmedCourse.objectives).toEqual(['Définir le PIB.']);
  });

  it('an unusable answer is an error and nothing is shown as a proposal', async () => {
    vi.mocked(basePostAxios).mockResolvedValue({ status: 200, data: { answer: 'Désolé.' } } as any);
    const store = useCourseDesignStore();
    store.brief.idea = 'Une idée';
    await store.draftProposal();

    expect(store.status).toBe('error');
    expect(store.overview.title).toBeNull();
    expect(basePostAxios).toHaveBeenCalledTimes(2);
  });

  it('asks nothing without a course idea', async () => {
    const store = useCourseDesignStore();
    await store.draftProposal();
    expect(basePostAxios).not.toHaveBeenCalled();
    expect(store.status).toBe('idle');
  });
});

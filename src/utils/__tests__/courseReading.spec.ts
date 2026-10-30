import { describe, it, expect } from 'vitest';
import {
  buildReadingRequest,
  guessLanguage,
  parseJsonObject,
  parseReadingAnswer,
  verifyReading
} from '@/utils/courseReading';
import type { CourseReading } from '@/types';

const reading = (overrides: Partial<CourseReading> = {}): CourseReading => ({
  title: null,
  discipline: null,
  level: null,
  description: null,
  topics: [],
  sessions: [],
  objectives: [],
  document_language: null,
  material_type: 'syllabus',
  courses_found: [],
  ...overrides
});

describe('guessLanguage', () => {
  it('recognises French and English syllabi', () => {
    expect(guessLanguage('Ce cours présente les outils de la statistique et des données.')).toBe(
      'fr'
    );
    expect(guessLanguage('This course introduces the tools of statistics and data.')).toBe('en');
  });

  it('uses the fallback when it cannot tell', () => {
    expect(guessLanguage('PIB, inflation', 'en')).toBe('en');
  });
});

describe('buildReadingRequest', () => {
  it('sends the syllabus as the only source and the instructions as the question', () => {
    const request = buildReadingRequest('Le texte du syllabus.', 'en');
    expect(request.lang).toBe('en');
    expect(request.query).toContain('Copy every value word for word');
    expect(request.sources).toHaveLength(1);
    expect(request.sources[0].payload.slice_content).toBe('Le texte du syllabus.');
  });
});

describe('parseReadingAnswer', () => {
  it('reads a JSON answer, even with text around it', () => {
    const parsed = parseReadingAnswer(
      'Voici : {"title": " Macroéconomie ", "topics": ["PIB", 3, ""], "objectives": [{"text": "Définir le PIB.", "scope": "other"}]} Fin.'
    );
    expect(parsed?.title).toBe('Macroéconomie');
    expect(parsed?.topics).toEqual(['PIB']);
    expect(parsed?.objectives).toEqual([{ text: 'Définir le PIB.', scope: 'unspecified' }]);
    expect(parsed?.sessions).toEqual([]);
    expect(parsed?.discipline).toBeNull();
  });

  it('returns null for anything that is not one JSON object', () => {
    expect(parseReadingAnswer('Je ne peux pas répondre.')).toBeNull();
    expect(parseReadingAnswer('{not json}')).toBeNull();
    expect(parseReadingAnswer('[1, 2]')).toBeNull();
  });
});

describe('verifyReading', () => {
  const text = `Introduction à la macro-
économie
Licence 1 – Semestre 1
Contenu : le PIB, l’inflation`;

  it('keeps values written in the document, whatever the line breaks, dashes or quotes', () => {
    const { reading: verified, droppedCount } = verifyReading(
      reading({ level: 'Licence 1 - Semestre 1', topics: ["l'inflation", 'le PIB'] }),
      text
    );
    expect(verified.level).toBe('Licence 1 - Semestre 1');
    expect(verified.topics).toEqual(["l'inflation", 'le PIB']);
    expect(droppedCount).toBe(0);
  });

  it('drops translated, reworded or invented values and counts them', () => {
    const { reading: verified, droppedCount } = verifyReading(
      reading({
        title: 'Introduction to macroeconomics',
        discipline: 'Sociologie',
        topics: ['le PIB', 'GDP'],
        objectives: [{ text: 'Comprendre la croissance.', scope: 'course' }]
      }),
      text
    );
    expect(verified.title).toBeNull();
    expect(verified.discipline).toBeNull();
    expect(verified.topics).toEqual(['le PIB']);
    expect(verified.objectives).toEqual([]);
    expect(droppedCount).toBe(4);
  });

  it('keeps a session whose label is not in the document, without the label', () => {
    const { reading: verified } = verifyReading(
      reading({ sessions: [{ label: 'Séance 9', title: 'le PIB' }] }),
      text
    );
    expect(verified.sessions).toEqual([{ label: null, title: 'le PIB' }]);
  });
});

describe('reading material of different shapes', () => {
  it('asks again for one course only when the teacher chose it', () => {
    expect(buildReadingRequest('Texte.', 'fr', 'Droit des contrats').query).toContain(
      'Ne traite que le cours intitulé « Droit des contrats »'
    );
    expect(buildReadingRequest('Texte.', 'fr').query).not.toContain('Ne traite que');
  });

  it('reads the material type, and an unknown one as "other"', () => {
    expect(parseReadingAnswer('{"material_type": "lesson"}')?.material_type).toBe('lesson');
    expect(parseReadingAnswer('{"material_type": "book"}')?.material_type).toBe('other');
  });

  it('never takes the whole document as its description', () => {
    const text = 'Séance 4 – La photosynthèse. Rappel sur la cellule. Expérience sur l’élodée.';
    const { reading: verified, droppedCount } = verifyReading(
      reading({ description: text, courses_found: ['Séance 4 – La photosynthèse', 'Chimie'] }),
      text
    );
    expect(verified.description).toBeNull();
    expect(verified.courses_found).toEqual(['Séance 4 – La photosynthèse']);
    expect(droppedCount).toBe(2);
  });
});

describe('parseJsonObject', () => {
  it('puts back an object the model forgot to close before closing a list', () => {
    const answer =
      '{"sessions":[{"label":"Séance 10","title":"Révisions"],"objectives":[],"title":"A \\"b\\" ]"}';
    expect(parseJsonObject(answer)).toEqual({
      sessions: [{ label: 'Séance 10', title: 'Révisions' }],
      objectives: [],
      title: 'A "b" ]'
    });
  });

  it('still returns null for text that is not JSON', () => {
    expect(parseJsonObject('{not json at all}')).toBeNull();
  });
});

describe('verifyReading: pdf hyphenation', () => {
  it('finds words split across lines by a hyphen', () => {
    const { reading: verified } = verifyReading(
      reading({ topics: ['steel and concrete based structure'] }),
      'whereas steel and concrete based struc - ture consumes'
    );
    expect(verified.topics).toEqual(['steel and concrete based structure']);
  });
});

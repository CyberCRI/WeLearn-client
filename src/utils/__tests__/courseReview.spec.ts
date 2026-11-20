import { describe, it, expect } from 'vitest';
import { fromSyllabus } from '@/utils/courseCheck';
import {
  applyTopicDrafts,
  confirmCourse,
  contextFromReading,
  coursePartsOf,
  itemsOf,
  noteOf,
  overviewOf,
  reviewFromReading,
  sessionLine,
  sessionParts,
  toConfirmedCourse
} from '@/utils/courseReview';
import { emptyTeachingContext } from '@/utils/teachingContext';
import type { CourseReadResponse, CourseReading } from '@/types';

const TEXT = `Introduction à la macroéconomie
Licence 1 – Semestre 1
Objectifs du cours :
- Définir le PIB.
Thème 1 : Le PIB
Thème 2 : L'inflation`;

const read = (reading: Partial<CourseReading>, extra: Partial<CourseReadResponse> = {}) =>
  ({
    text: TEXT,
    is_text_truncated: false,
    is_partial: false,
    reading: {
      material_type: 'syllabus',
      courses_found: [],
      objectives: [],
      topics: [],
      sessions: [],
      ...reading
    },
    ...extra
  }) as CourseReadResponse;

describe('reviewFromReading', () => {
  it('checks each value against the syllabus text, keeping what is not found', () => {
    const review = reviewFromReading(
      read({
        description: 'A course about growth.',
        summary: 'WeLearn summary.',
        objectives: [{ text: 'Définir le PIB.', scope: 'course' }],
        topics: [
          { title: 'Le PIB', subtopics: ['Mesure'], source: 'Thème 1 : Le PIB' },
          { title: 'Prices', subtopics: [], source: "Thème 2 : L'inflation" },
          { title: 'Debt', subtopics: [], source: 'Not in the text' }
        ],
        sessions: [
          { label: 'Week 1', title: 'GDP' },
          { label: 'Week 2', title: null }
        ]
      })
    );

    expect(review.description).toMatchObject({ origin: 'extracted', verification: 'unverified' });
    expect(review.summary).toMatchObject({ value: 'WeLearn summary.', isSummary: true });
    expect(review.objectives).toEqual([
      expect.objectContaining({
        value: 'Définir le PIB.',
        verification: 'verified',
        group: 'objective'
      })
    ]);
    // copied: its own line; named in the AI's words: its source line, when found
    expect(
      review.topics.map(({ value, verification, isSummary, source }) => ({
        value,
        verification,
        isSummary,
        source
      }))
    ).toEqual([
      { value: 'Le PIB', verification: 'verified', isSummary: false, source: 'Le PIB' },
      {
        value: 'Prices',
        verification: 'verified',
        isSummary: true,
        source: "Thème 2 : L'inflation"
      },
      { value: 'Debt', verification: 'unverified', isSummary: true, source: null }
    ]);
    expect(review.topics[0].subtopics).toEqual(['Mesure']);
    expect(review.plan).toEqual(['Week 1 – GDP', 'Week 2']);
    expect(review.isPartial).toBe(false);
    expect(review.detectedType).toBe('syllabus');
  });

  it('says a long document or a part that could not be read may miss something', () => {
    expect(reviewFromReading(read({}, { is_text_truncated: true })).isPartial).toBe(true);
    expect(reviewFromReading(read({}, { is_partial: true })).isPartial).toBe(true);
  });
});

describe('contextFromReading', () => {
  it('marks what is found word for word as read from the syllabus, the rest for checking', () => {
    const fill = contextFromReading(
      read({
        title: 'Introduction à la macroéconomie',
        discipline: 'Sociologie',
        level: 'Licence 1'
      })
    );
    expect(fill.values).toEqual({
      title: 'Introduction à la macroéconomie',
      discipline: 'Sociologie',
      level: 'l1'
    });
    expect(fill.prefilled).toEqual(['title', 'level']);
    expect(fill.evidence).toEqual({
      title: 'Introduction à la macroéconomie',
      level: 'Licence 1'
    });
    expect(fill.aiFilled).toEqual(['discipline']);
  });

  it('keeps a discipline the syllabus does not state as a suggestion, and an unclear level out', () => {
    const fill = contextFromReading(read({ discipline_suggested: 'Économie', level: 'L1 et L2' }));
    expect(fill.values).toEqual({ discipline: 'Économie' });
    expect(fill.aiSuggested).toEqual(['discipline']);
    expect(fill.prefilled).toEqual([]);
  });
});

describe('the confirmed course', () => {
  const objectives = [
    fromSyllabus('Define GDP.', 'verified', 'objective'),
    fromSyllabus('Work in a team.', 'verified', 'competency'),
    fromSyllabus('Graduates master economics.', 'verified', 'programme'),
    fromSyllabus('Read critically.', 'verified', 'unsorted')
  ];
  const topics = [{ ...fromSyllabus('GDP', 'verified'), subtopics: ['Measure'], source: 'GDP' }];
  const course = confirmCourse(
    { ...emptyTeachingContext(), title: 'Macro', level: 'l1' },
    {
      summary: null,
      description: fromSyllabus('A course on GDP.', 'verified'),
      objectives,
      topics,
      plan: ['Week 1']
    }
  );

  it("keeps the course's own objectives and competencies, never the degree's or unsorted ones", () => {
    expect(course).toMatchObject({
      title: 'Macro',
      discipline: null,
      overview: 'A course on GDP.',
      topics: [{ title: 'GDP', subtopics: ['Measure'], source: 'GDP' }],
      objectives: ['Define GDP.'],
      competencies: ['Work in a team.'],
      sessions: ['Week 1']
    });
    expect(course.level).toBeTruthy();
  });

  it('gives the connections each topic with its subtopics, without its syllabus line', () => {
    expect(toConfirmedCourse(course).topics).toEqual([{ title: 'GDP', subtopics: ['Measure'] }]);
  });

  it('lists the parts of the course a connection may build on', () => {
    expect(coursePartsOf(course)).toEqual([
      'GDP',
      'Measure',
      'Define GDP.',
      'Work in a team.',
      'Week 1'
    ]);
  });
});

describe('session lines', () => {
  it('joins a label and a title, and splits them back', () => {
    const line = sessionLine('Semaine du 15/12', 'CM7 « Évaluation »');
    expect(line).toBe('Semaine du 15/12 – CM7 « Évaluation »');
    expect(sessionParts(line)).toEqual({ label: 'Semaine du 15/12', title: 'CM7 « Évaluation »' });
    expect(sessionLine(null, 'TD6')).toBe('TD6');
    expect(sessionParts('TD6')).toEqual({ label: null, title: 'TD6' });
  });
});

describe('overviewOf', () => {
  it('prefers the summary, then a clear description', () => {
    const description = fromSyllabus('A course on GDP.', 'verified');
    const summary = { ...fromSyllabus('Summary.', 'unchecked'), isSummary: true };
    expect(overviewOf(summary, description)).toBe('Summary.');
    expect(overviewOf(null, description)).toBe('A course on GDP.');
    const tooMuch = fromSyllabus(
      'Intitulé du cours : A. Plan de cours : B. Évaluation : C.',
      'verified'
    );
    expect(overviewOf(null, tooMuch)).toBeNull();
    // the teacher's own description is always theirs to keep
    expect(overviewOf(null, { ...tooMuch, origin: 'edited' })).toBe(tooMuch.value);
  });
});

describe('applyTopicDrafts', () => {
  it('keeps what was read for an unchanged topic, marks a corrected one, adds and removes', () => {
    const topics = [
      { ...fromSyllabus('GDP', 'verified'), source: 'GDP' },
      fromSyllabus('Inflation', 'verified')
    ];
    expect(
      applyTopicDrafts(topics, [
        { from: 0, title: 'GDP', subtopics: [' Measure ', ''] },
        { from: 1, title: '  ', subtopics: [] },
        { from: null, title: 'Debt', subtopics: [] }
      ])
    ).toEqual([
      { ...topics[0], subtopics: ['Measure'] },
      { value: 'Debt', origin: 'added', subtopics: [] }
    ]);
    expect(
      applyTopicDrafts(topics, [{ from: 1, title: 'Prices', subtopics: [] }])[0]
    ).toMatchObject({
      value: 'Prices',
      origin: 'edited',
      original: 'Inflation'
    });
  });
});

describe('objective items', () => {
  it('keeps the place of each item in its group', () => {
    const objectives = [
      fromSyllabus('A', 'verified', 'competency'),
      { value: 'B', origin: 'added' as const }
    ];
    expect(itemsOf(objectives, 'objective')).toEqual([{ field: objectives[1], index: 1 }]);
    expect(itemsOf(objectives, 'competency')).toEqual([{ field: objectives[0], index: 0 }]);
  });

  it('notes only a change by the teacher or a real doubt', () => {
    expect(noteOf(fromSyllabus('A', 'verified'))).toBeNull();
    expect(noteOf(fromSyllabus('A', 'unverified'))).toBe('tutor.check.pleaseCheck');
    expect(noteOf({ value: 'A', origin: 'added' })).toBe('tutor.check.origin.added');
  });
});

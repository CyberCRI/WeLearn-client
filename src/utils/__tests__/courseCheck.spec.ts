import { describe, it, expect } from 'vitest';
import {
  checkObjectives,
  editField,
  fromSyllabus,
  groupInDocument,
  looksLikeMoreThanDescription,
  placeObjectives,
  restoreField,
  verify
} from '@/utils/courseCheck';

// an excerpt of a real first-year syllabus (lines as a pdf export lays them out), without names
const SYLLABUS = `LICENCE SEG – 2025
Les objectifs pédagogiques spécifiques par année dans le cadre du PRL :
L1 → Savoir décrire et comprendre les grands problèmes économiques et de gestion
contemporains
Intitulé du cours :
Introduction à la macroéconomie
L 1- S1
Prérequis :
o En économie : aucun pré-requis.
Objectifs pédagogiques :
o Se familiariser avec les grands indicateurs macroéconomiques (PIB, inflation,
chômage, dette publique…).
o Comprendre leur définition et leur mesure.
o Maitriser une première démarche méthodologique de modélisation en macro
économie.
o Mobiliser des outils théoriques simples d’analyse conjoncturelle (court terme).
Compétences développées :
o Capacité à lire et interpréter les graphiques et tableaux.
o Apprendre à travailler en équipe
Plan de cours :
Chapitre 1. Qu’est-ce que la macroéconomie ? (séance 1/séance2)`;

describe('verify', () => {
  it('finds exact text', () => {
    expect(verify('Comprendre leur définition et leur mesure.', SYLLABUS)).toBe('verified');
  });

  it('finds text across line breaks, whatever the quote style or final full stop', () => {
    expect(
      verify(
        'Se familiariser avec les grands indicateurs macroéconomiques (PIB, inflation, chômage, dette publique...)',
        SYLLABUS
      )
    ).toBe('verified');
    expect(verify("Mobiliser des outils théoriques simples d'analyse", SYLLABUS)).toBe('verified');
    expect(verify('Apprendre à travailler en équipe.', SYLLABUS)).toBe('verified');
  });

  it('does not take a reworded or corrected item for the syllabus wording', () => {
    // the ai added an accent and joined "macro économie"
    expect(
      verify(
        'Maîtriser une première démarche méthodologique de modélisation en macroéconomie.',
        SYLLABUS
      )
    ).toBe('unverified');
    expect(
      verify('Développer la capacité à lire et interpréter les graphiques et tableaux.', SYLLABUS)
    ).toBe('unverified');
  });

  it('says when nothing could be compared', () => {
    expect(verify('Comprendre leur définition et leur mesure.', null)).toBe('unchecked');
  });
});

describe('groupInDocument', () => {
  it('places an item under its heading: objectives, competencies or the degree', () => {
    expect(groupInDocument('Comprendre leur définition et leur mesure.', SYLLABUS)).toBe(
      'objective'
    );
    expect(groupInDocument('Apprendre à travailler en équipe', SYLLABUS)).toBe('competency');
    expect(
      groupInDocument(
        'Savoir décrire et comprendre les grands problèmes économiques et de gestion contemporains',
        SYLLABUS
      )
    ).toBe('programme');
  });

  it('does not take a list item for a heading', () => {
    const text = 'Compétences développées :\no Capacité à lire.\no Apprendre à travailler.';
    expect(groupInDocument('Apprendre à travailler.', text)).toBe('competency');
  });

  it('cannot place an item it cannot find, or under an unrelated heading', () => {
    expect(groupInDocument('Model climate policy.', SYLLABUS)).toBeNull();
    expect(groupInDocument('En économie : aucun pré-requis.', SYLLABUS)).toBeNull();
    expect(groupInDocument('Comprendre leur définition', null)).toBeNull();
  });
});

describe('checkObjectives', () => {
  it('keeps every item, checked and placed in its group', () => {
    const fields = checkObjectives(
      [
        'Comprendre leur définition et leur mesure.',
        'Maîtriser une première démarche méthodologique de modélisation en macroéconomie.',
        'Mobiliser des outils théoriques simples d’analyse conjoncturelle (court terme).',
        'Développer la capacité à lire et interpréter les graphiques et tableaux.',
        'Apprendre à travailler en équipe.'
      ],
      SYLLABUS
    );
    expect(fields.map((field) => [field.verification, field.group])).toEqual([
      ['verified', 'objective'],
      // reworded: kept, flagged, and placed between its two neighbours
      ['unverified', 'objective'],
      ['verified', 'objective'],
      // reworded, last of its list: its neighbours disagree, so it stays a course objective
      ['unverified', 'objective'],
      ['verified', 'competency']
    ]);
  });

  it('keeps everything as course objectives when the file could not be read', () => {
    const fields = checkObjectives(['A.', 'B.'], null);
    expect(fields.map((field) => [field.verification, field.group])).toEqual([
      ['unchecked', 'objective'],
      ['unchecked', 'objective']
    ]);
  });
});

// an excerpt laid out like a real US course outline: the course's outcomes, then general
// education outcomes, then an institutional form listing outcomes for every area
const OUTLINE = `COURSE INTENDED LEARNING OUTCOMES/ASSESSMENT METHODS: To develop an understanding of the
fundamental concepts. Specifically, course objectives include
the following:
LEARNING OUTCOMES ASSESSMENT METHODS
1. Understand the concepts of scarcity, choice and opportunity cost.
GENERAL EDUCATION LEARNING OUTCOMES/ASSESSMENT METHODS
LEARNING OUTCOMES ASSESSMENT METHODS
1. KNOWLEDGE: To develop an introductory understanding of macroeconomic concepts.
Learning Outcomes
A course in this area must meet all the learning outcomes in the right column. A student will:
• Read and listen critically and analytically.
Learning outcomes
• Work in groups on case studies.`;

describe('placeObjectives', () => {
  const place = (items: { text: string; scope: 'course' | 'programme' | 'unspecified' }[]) =>
    placeObjectives(items, OUTLINE).map((field) => field.group);

  it("keeps the course's own outcomes apart from general education and institutional ones", () => {
    expect(
      place([
        {
          text: 'Understand the concepts of scarcity, choice and opportunity cost.',
          scope: 'course'
        },
        {
          text: 'To develop an introductory understanding of macroeconomic concepts.',
          scope: 'unspecified'
        },
        { text: 'Read and listen critically and analytically.', scope: 'unspecified' }
      ])
    ).toEqual(['objective', 'programme', 'programme']);
  });

  it('never takes as the course’s what neither the AI nor the headings place', () => {
    // a generic heading, nothing above it: left for the teacher to sort
    expect(
      placeObjectives(
        [{ text: 'Work in groups on case studies.', scope: 'unspecified' }],
        'Learning outcomes\n• Work in groups on case studies.'
      ).map((field) => field.group)
    ).toEqual(['unsorted']);
    // not found in the text: the AI's word decides, or the teacher
    expect(
      place([
        { text: 'An outcome WeLearn reworded.', scope: 'course' },
        { text: 'Another reworded outcome.', scope: 'unspecified' },
        { text: 'A degree outcome.', scope: 'programme' }
      ])
    ).toEqual(['objective', 'unsorted', 'programme']);
  });

  it('reads the French syllabus as before: course, competencies, degree', () => {
    expect(
      placeObjectives(
        [
          { text: 'Comprendre leur définition et leur mesure.', scope: 'course' },
          { text: 'Apprendre à travailler en équipe', scope: 'course' },
          {
            text: 'Savoir décrire et comprendre les grands problèmes économiques et de gestion contemporains',
            scope: 'unspecified'
          }
        ],
        SYLLABUS
      ).map((field) => [field.group, field.verification])
    ).toEqual([
      ['objective', 'verified'],
      ['competency', 'verified'],
      ['programme', 'verified']
    ]);
  });
});

describe('looksLikeMoreThanDescription', () => {
  it('spots a "description" that holds other parts of the syllabus', () => {
    expect(
      looksLikeMoreThanDescription(
        'Pour rappels : le PRL. Intitulé du cours : Introduction. Plan de cours : Chapitre 1.'
      )
    ).toBe(true);
    expect(looksLikeMoreThanDescription('x'.repeat(1300))).toBe(true);
  });

  it('accepts a real course description', () => {
    expect(
      looksLikeMoreThanDescription(
        'Ce cours présente les grands agrégats macroéconomiques et les débats de politique économique.'
      )
    ).toBe(false);
  });
});

describe('course fields', () => {
  it('marks a corrected piece and keeps its original wording and check', () => {
    const field = editField(fromSyllabus('Define GDP.', 'verified'), 'Define GDP and its limits.');
    expect(field).toMatchObject({
      value: 'Define GDP and its limits.',
      origin: 'edited',
      original: 'Define GDP.',
      verification: 'verified'
    });
    expect(restoreField(field)).toEqual(fromSyllabus('Define GDP.', 'verified'));
  });

  it('counts a correction back to the original wording as read again', () => {
    const field = editField(fromSyllabus('Define GDP.', 'verified'), 'Define GDP.');
    expect(field.origin).toBe('extracted');
  });

  it('keeps an added piece as added, with nothing to restore', () => {
    const added = { value: 'Read a table.', origin: 'added' as const };
    expect(editField(added, 'Read two tables.')).toEqual({
      value: 'Read two tables.',
      origin: 'added'
    });
    expect(restoreField(added)).toBe(added);
  });
});

describe('courseCheck: descriptive parts are not objectives', () => {
  const TEXT = [
    'Objective of the Course',
    'This course aims to train students in human rights advocacy.',
    'Summary',
    'This course provides an overview of the terrain of international human rights advocacy,',
    'including forms of action. In particular, this course will help students develop their advocacy skills.',
    'Prerequisites',
    'Basic knowledge of statistics'
  ].join('\n');

  it('leaves a sentence of the summary or the prerequisites to the teacher, even reworded', async () => {
    const { placeObjectives } = await import('@/utils/courseCheck');
    const placed = placeObjectives(
      [
        { text: 'train students in human rights advocacy', scope: 'course' },
        // reworded by the AI from the summary: found by its words
        {
          text: 'provide an overview of the terrain of international human rights advocacy',
          scope: 'course'
        },
        { text: 'Basic knowledge of statistics', scope: 'course' }
      ],
      TEXT
    );
    expect(placed.map(({ group }) => group)).toEqual(['objective', 'unsorted', 'unsorted']);
  });

  it('keeps a reworded item it cannot place among the others as before', async () => {
    const { headingScope } = await import('@/utils/courseCheck');
    expect(headingScope('something else entirely written here by the model', TEXT)).toBeNull();
  });
});

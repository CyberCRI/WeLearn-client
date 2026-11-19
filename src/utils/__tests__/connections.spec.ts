import { describe, expect, it } from 'vitest';
import { evidenceState, placeInCourse, sourceLink, sourceName } from '@/utils/connections';
import type { ConnectionEvidence, Document } from '@/types';

const doc = (details: Record<string, unknown> = {}, corpus = 'wikipedia'): Document =>
  ({
    score: 0.9,
    payload: {
      document_id: 'a',
      document_title: 'Title a',
      document_url: 'https://example.org/a',
      document_corpus: corpus,
      document_details: details
    }
  }) as unknown as Document;

describe('connections: a connection and its evidence', () => {
  const evidence = { status: 'supported' } as ConnectionEvidence;

  it('is pending until judged, then takes the judgement; a failed call is unchecked', () => {
    expect(evidenceState({ evidence: null, hasCheckFailed: false })).toBe('pending');
    expect(evidenceState({ evidence, hasCheckFailed: false })).toBe('supported');
    expect(evidenceState({ evidence: null, hasCheckFailed: true })).toBe('unchecked');
    expect(evidenceState({ evidence, hasCheckFailed: true })).toBe('unchecked');
  });
});

describe('connections: sources', () => {
  it('links to the quoted passage, at the DOI when there is one', () => {
    expect(sourceLink(doc(), 'Le PIB ignore la dégradation')).toBe(
      'https://example.org/a#:~:text=Le%20PIB%20ignore%20la%20d%C3%A9gradation'
    );
    expect(sourceLink(doc())).toBe('https://example.org/a');
    expect(sourceLink(doc({ doi: 'https://doi.org/10.1/x' }), 'a-b')).toBe(
      'https://doi.org/10.1/x#:~:text=a%2Db'
    );
    expect(sourceLink(doc({ doi: '10.1/x' }))).toBe('https://example.org/a');
  });

  it('names a source by its journal or publisher, else its collection', () => {
    expect(sourceName(doc({ journal: 'Nature', publisher: 'Springer' }))).toBe('Nature');
    expect(sourceName(doc({ publisher: 'Springer' }))).toBe('Springer');
    expect(sourceName(doc({}, 'bmj-open'))).toBe('BMJ Open');
    expect(sourceName(doc({}, 'no-such-corpus'))).toBe('no such corpus');
  });
});

describe('connections: where a connection sits in the course', () => {
  const course = {
    topics: ['Évaluation des performances', 'Stratégie'],
    objectives: ['Comprendre les outils de gestion.'],
    competencies: ['Travailler en équipe'],
    sessions: [
      'Semaine du 15/12 – CM7 « Évaluation des performances »',
      'Semaine du 01/12 – CM2 & CM3 Stratégie',
      'Chapitre 1. Introduction'
    ]
  };

  it('splits a session into its subject and its placement', () => {
    expect(placeInCourse(course.sessions[0], { ...course, topics: [] })).toMatchObject({
      kind: 'session',
      subject: 'Évaluation des performances',
      placement: 'CM7 · Semaine du 15/12'
    });
    // a chapter without a week or session label: no placement is invented
    expect(placeInCourse('Chapitre 1. Introduction', course)).toMatchObject({
      subject: 'Chapitre 1. Introduction',
      placement: null
    });
  });

  it('places a topic only through the one session naming it', () => {
    expect(placeInCourse('Évaluation des performances', course)).toMatchObject({
      kind: 'topic',
      subject: 'Évaluation des performances',
      placement: 'CM7 · Semaine du 15/12'
    });
    expect(
      placeInCourse('Stratégie', {
        ...course,
        sessions: [...course.sessions, 'Séance 9 – Stratégie']
      })?.placement
    ).toBeNull();
  });

  it('names an objective or competency by its number, never placed', () => {
    expect(placeInCourse('Comprendre les outils de gestion.', course)).toMatchObject({
      kind: 'objective',
      index: 0,
      placement: null
    });
    expect(placeInCourse('Travailler en équipe', course)).toMatchObject({ kind: 'competency' });
    expect(placeInCourse(null, course)).toBeNull();
  });
});

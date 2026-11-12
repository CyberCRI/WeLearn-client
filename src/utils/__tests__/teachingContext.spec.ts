import { describe, it, expect } from 'vitest';
import { formatHours, readTeachingContext } from '@/utils/teachingContext';

describe('readTeachingContext', () => {
  it('reads sessions and their length when the syllabus states both, with the line', () => {
    expect(readTeachingContext('Workload: 36 hours (12 sessions of 3 hours)')).toEqual({
      values: { sessions: 12, sessionLength: 3 },
      evidence: {
        sessions: 'Workload: 36 hours (12 sessions of 3 hours)',
        sessionLength: 'Workload: 36 hours (12 sessions of 3 hours)'
      }
    });
    expect(readTeachingContext('Volume horaire : 36 h (12 séances de 1,5 h)').values).toEqual({
      sessions: 12,
      sessionLength: 1.5
    });
  });

  it('leaves out a length that is not one of the quick choices', () => {
    expect(readTeachingContext('10 sessions of 5 hours').values).toEqual({ sessions: 10 });
  });

  it('reads a number of sessions stated alone', () => {
    expect(readTeachingContext('The course has 8 sessions.').values).toEqual({ sessions: 8 });
  });

  it('reads nothing when nothing is stated', () => {
    expect(readTeachingContext('Session 1: What is macroeconomics?')).toEqual({
      values: {},
      evidence: {}
    });
  });

  it('reads the title, level, format and session types of a real syllabus', () => {
    const text = [
      'LICENCE SEG – 2025',
      'L1 → Savoir décrire les grands problèmes',
      'L2 → Savoir identifier les principaux facteurs',
      'Intitulé du cours :',
      'Introduction à la macroéconomie',
      'L 1- S1',
      '- CM : 24H (21H en présentiel – 3H en distanciel)',
      '- TD : 17H'
    ].join('\n');
    const { values, evidence } = readTeachingContext(text);
    expect(values).toEqual({
      title: 'Introduction à la macroéconomie',
      level: 'l1',
      sessionMode: 'HYBRIDE',
      sessionType: 'mixed'
    });
    // the level comes from the line under the title, not from the degree overview
    expect(evidence.level).toBe('L 1- S1');
    expect(evidence.sessionMode).toBe('- CM : 24H (21H en présentiel – 3H en distanciel)');
  });

  it('reads labelled values on one line, and English levels and modes', () => {
    const { values } = readTeachingContext(
      'Course title: Ecology\nDiscipline: Biology\nSecond-year bachelor\nClass size: 40\nTaught online.\nSeminars and lab sessions'
    );
    expect(values).toEqual({
      title: 'Ecology',
      discipline: 'Biology',
      level: 'l2',
      classSize: 40,
      sessionMode: 'DISTANCIEL',
      sessionType: 'mixed'
    });
  });

  it('reads the title under a "SYLLABUS" header, or a plain "Title:" line', () => {
    expect(readTeachingContext('SYLLABUS\nIntroduction à la gestion\n2025').values.title).toBe(
      'Introduction à la gestion'
    );
    expect(readTeachingContext('TITLE: Macroeconomics').values.title).toBe('Macroeconomics');
  });

  it('leaves the number of sessions to the teacher when the syllabus gives several', () => {
    const text = 'CM : 7 séances en présentiel de 3h\nTD : 5 séances de 3h';
    expect(readTeachingContext(text).values.sessions).toBeUndefined();
    expect(readTeachingContext(text).values.sessionLength).toBeUndefined();
  });

  it('leaves a level stated in several conflicting ways to the teacher', () => {
    expect(readTeachingContext('L1 → décrire\nL2 → identifier\nL3 → évaluer').values).toEqual({});
  });

  it('reads one format and one session type', () => {
    expect(readTeachingContext('Cours en présentiel\nTD : 12 h').values).toEqual({
      sessionMode: 'PRESENTIEL',
      sessionType: 'tutorial'
    });
    expect(readTeachingContext('Enseignement hybride\nCours magistral').values).toEqual({
      sessionMode: 'HYBRIDE',
      sessionType: 'lecture'
    });
  });

  it('does not take "la distance" or a French "lecture" (reading) for a format or type', () => {
    expect(readTeachingContext('Mesurer la distance.\nUne lecture attentive.').values).toEqual({});
  });
});

describe('formatHours', () => {
  it('writes hours the same way in both languages', () => {
    expect(formatHours(2)).toBe('2 h');
    expect(formatHours(1.5)).toBe('1 h 30');
  });
});

describe('readTeachingContext: the line after SYLLABUS', () => {
  it('does not take a teacher or a year for the course title', () => {
    expect(
      readTeachingContext('SYLLABUS\nProfessor: Eugénie MERIEAU\nSession: July 2026').values.title
    ).toBeUndefined();
    expect(readTeachingContext('SYLLABUS\n2026\nPolitics').values.title).toBeUndefined();
    expect(readTeachingContext('SYLLABUS\nHuman Rights Advocacy').values.title).toBe(
      'Human Rights Advocacy'
    );
  });
});

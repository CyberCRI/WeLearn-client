import { describe, it, expect } from 'vitest';
import { formatHours, readTeachingContext } from '@/utils/teachingContext';

describe('readTeachingContext', () => {
  it('reads sessions and their length when the syllabus states both', () => {
    expect(readTeachingContext('Workload: 36 hours (12 sessions of 3 hours)')).toEqual({
      sessions: 12,
      sessionLength: 3
    });
    expect(readTeachingContext('Volume horaire : 36 h (12 séances de 1,5 h)')).toEqual({
      sessions: 12,
      sessionLength: 1.5
    });
  });

  it('leaves out a length that is not one of the quick choices', () => {
    expect(readTeachingContext('10 sessions of 5 hours')).toEqual({ sessions: 10 });
  });

  it('reads a number of sessions stated alone', () => {
    expect(readTeachingContext('The course has 8 sessions.')).toEqual({ sessions: 8 });
  });

  it('reads nothing when nothing is stated', () => {
    expect(readTeachingContext('Session 1: What is macroeconomics?')).toEqual({});
  });
});

describe('formatHours', () => {
  it('writes hours the same way in both languages', () => {
    expect(formatHours(2)).toBe('2 h');
    expect(formatHours(1.5)).toBe('1 h 30');
  });
});

import { describe, it, expect } from 'vitest';
import { emptyTeachingContext, formatHours, levelFromText } from '@/utils/teachingContext';

describe('levelFromText', () => {
  it('names the quick choice of a level written in words', () => {
    expect(levelFromText('Licence 1, Semestre 1')).toBe('l1');
    expect(levelFromText('L 2')).toBe('l2');
    expect(levelFromText('Master 2')).toBe('m2');
    expect(levelFromText('First-year Bachelor')).toBe('l1');
  });

  it('names none for no level, or several', () => {
    expect(levelFromText('Undergraduate')).toBe('');
    expect(levelFromText('L1 et L2')).toBe('');
  });
});

describe('formatHours', () => {
  it('writes hours the same way in both languages', () => {
    expect(formatHours(2)).toBe('2 h');
    expect(formatHours(1.5)).toBe('1 h 30');
  });
});

describe('emptyTeachingContext', () => {
  it('leaves everything to the teacher', () => {
    expect(Object.values(emptyTeachingContext()).every((v) => v === '' || v === null)).toBe(true);
  });
});

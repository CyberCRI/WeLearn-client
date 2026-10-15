import { describe, it, expect } from 'vitest';
import { calculateProgress } from '../progress';

describe('calculateProgress', () => {
  it('should give a small head start on the first step', () => {
    expect(calculateProgress(0, 4)).toBeCloseTo(5);
  });

  it('should scale with the current step', () => {
    expect(calculateProgress(1, 4)).toBeCloseTo(38.33);
    expect(calculateProgress(3, 4)).toBeCloseTo(105);
  });

  it('should return 100 when there is a single step or none', () => {
    expect(calculateProgress(0, 1)).toBe(100);
    expect(calculateProgress(0, 0)).toBe(100);
  });
});

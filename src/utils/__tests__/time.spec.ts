import { describe, it, expect } from 'vitest';
import { secondsToMinAndHours } from '../time';

describe('secondsToMinAndHours', () => {
  it('should return only seconds when seconds are < 60', () => {
    expect(secondsToMinAndHours(59)).toBe('59s');
  });

  it('should return only minutes when seconds are <! 60', () => {
    expect(secondsToMinAndHours(300)).toBe('5m');
    expect(secondsToMinAndHours(60)).toBe('1m');
    expect(secondsToMinAndHours(3600)).toBe('60m');
  });

  it('should return hours and minutes when seconds are more than 60', () => {
    expect(secondsToMinAndHours(3661)).toBe('1h01m');
    expect(secondsToMinAndHours(5100)).toBe('1h25m');
  });
});

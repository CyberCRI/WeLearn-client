import { describe, expect, it } from 'vitest';
import { idToLabel } from '../strings';

describe('idToLabel', () => {
  it('replaces every hyphen with a space', () => {
    expect(idToLabel('world-bank-open-knowledge-repository')).toBe(
      'world bank open knowledge repository'
    );
  });

  it('leaves an id without hyphens unchanged', () => {
    expect(idToLabel('openalex')).toBe('openalex');
  });
});

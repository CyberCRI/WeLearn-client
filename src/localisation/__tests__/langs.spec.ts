import { describe, expect, it } from 'vitest';
import { fr } from '../fr';
import { en } from '../en';

describe('localisation', () => {
  it('should have the same number of keys in fr and en', () => {
    expect(Object.keys(fr).length).toEqual(Object.keys(en).length);
  });
});

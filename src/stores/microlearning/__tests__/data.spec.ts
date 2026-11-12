import { describe, expect, it } from 'vitest';
import { DATA } from '../data';

// both languages show the same journey, so every list must line up item for item
const shape = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(shape)
    : value && typeof value === 'object'
      ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)]))
      : typeof value;

describe('microlearning data', () => {
  it('has the same disciplines and structure in fr and en', () => {
    expect(shape(DATA.en)).toEqual(shape(DATA.fr));
  });

  it('keeps colors, tag classes and links identical across languages', () => {
    for (const disc of Object.keys(DATA.fr) as (keyof typeof DATA.fr)[]) {
      const [frFlip, frComp, frAct, frRef] = DATA.fr[disc].steps;
      const [enFlip, enComp, enAct, enRef] = DATA.en[disc].steps;
      expect(
        enFlip.cards.map((c) => c.color),
        disc
      ).toEqual(frFlip.cards.map((c) => c.color));
      expect(
        enComp.featured.map((c) => c.tagClass),
        disc
      ).toEqual(frComp.featured.map((c) => c.tagClass));
      expect(
        enAct.apports.map((a) => a.color),
        disc
      ).toEqual(frAct.apports.map((a) => a.color));
      expect(enRef.resource.href, disc).toBe(frRef.resource.href);
    }
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { MODULES, getModuleContent, isModuleId, nextModule } from '@/learn/modules';
import { getProgress, saveProgress } from '@/learn/progress';
import { SOURCES } from '@/learn/sources';
import { emptySort, placeCard, isSortDone, firstTryCount, shuffled } from '@/learn/sort';
import type { Cite, ModuleId } from '@/types/learn/modules';

// shape of a content tree with every string replaced by a marker: EN and FR must match exactly
const shape = (v: unknown): unknown =>
  Array.isArray(v)
    ? v.map(shape)
    : v && typeof v === 'object'
      ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, shape(x)]))
      : typeof v === 'string'
        ? 'str'
        : v;

// ids, bins and numbers must be identical across languages (only display text differs)
const ids = (v: unknown): unknown =>
  Array.isArray(v)
    ? v.map(ids)
    : v && typeof v === 'object'
      ? Object.fromEntries(
          Object.entries(v)
            .filter(([k, x]) => !(k === 'goal' && typeof x === 'string')) // module intro text, not an SDG
            .filter(([k]) =>
              [
                'id',
                'bin',
                'type',
                'src',
                'check',
                'goal',
                'goals',
                'linked',
                'answer',
                'ids',
                'steps',
                'items',
                'cards',
                'bins',
                'ps',
                'focus',
                'statements',
                'options',
                'areas',
                'events',
                'cite',
                'map',
                'examples'
              ].includes(k)
            )
            .map(([k, x]) => [k, ids(x)])
        )
      : v;

const allCites = (v: unknown): Cite[] =>
  Array.isArray(v)
    ? v.flatMap(allCites)
    : v && typeof v === 'object'
      ? 'src' in v
        ? [v as Cite]
        : Object.values(v).flatMap(allCites)
      : [];

const TYPED_MODULES = MODULES.map((m) => m.id).filter(isModuleId);
const content = (id: ModuleId, lang: 'en' | 'fr') => getModuleContent(id, lang);

describe('Learn modules', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('lists the typed modules then the discipline module, in order', () => {
    expect(MODULES.map((m) => m.id)).toEqual(['foundations', 'frameworks', 'discipline']);
    expect(TYPED_MODULES).toEqual(['foundations', 'frameworks']);
    expect(isModuleId('discipline')).toBe(false);
    expect(isModuleId('toString')).toBe(false);
  });

  it('points each module to the next one, and the last to none', () => {
    expect(nextModule('foundations')?.id).toBe('frameworks');
    expect(nextModule('frameworks')?.id).toBe('discipline');
    expect(nextModule('discipline')).toBeNull();
  });

  it('falls back to French for any other locale', () => {
    expect(getModuleContent('foundations', 'de')).toBe(getModuleContent('foundations', 'fr'));
  });

  it.each(TYPED_MODULES)('%s: EN and FR have the same structure and ids', (id) => {
    expect(shape(content(id, 'fr'))).toEqual(shape(content(id, 'en')));
    expect(ids(content(id, 'fr'))).toEqual(ids(content(id, 'en')));
  });

  it.each(TYPED_MODULES)('%s: step ids are unique', (id) => {
    const stepIds = content(id, 'en').steps.map((s) => s.id);
    expect(new Set(stepIds).size).toBe(stepIds.length);
  });

  it.each(TYPED_MODULES)('%s: every citation points to a known source', (id) => {
    for (const cite of [...allCites(content(id, 'en')), ...allCites(content(id, 'fr'))]) {
      expect(SOURCES).toHaveProperty(cite.src);
    }
  });

  it.each(TYPED_MODULES)('%s: every sort card belongs to an existing bin', (id) => {
    for (const step of content(id, 'en').steps) {
      if (step.type !== 'sort') continue;
      const bins = step.bins.map((b) => b.id);
      step.cards.forEach((c) => expect(bins).toContain(c.bin));
    }
  });

  it('sorting: wrong placements are counted and only correct ones stay', () => {
    const cards = [
      { id: 'a', bin: 'x' },
      { id: 'b', bin: 'y' }
    ];
    let s = emptySort();
    let r = placeCard(s, cards[0], 'y');
    expect(r.correct).toBe(false);
    s = r.state;
    expect(s.placed).toEqual({});
    s = placeCard(s, cards[0], 'x').state;
    s = placeCard(s, cards[1], 'y').state;
    expect(isSortDone(s, 2)).toBe(true);
    expect(firstTryCount(s)).toBe(1);
    r = placeCard(s, cards[1], 'x'); // already placed: ignored
    expect(r.state).toBe(s);
  });

  it('shuffles sort cards without losing any, and never returns the answer order', () => {
    const items = ['a', 'b', 'c', 'd'];
    for (let i = 0; i < 20; i++) {
      const out = shuffled(items);
      expect([...out].sort()).toEqual(items);
      expect(out).not.toEqual(items);
    }
    // a "random" that keeps everything in place still gets rotated
    expect(shuffled(items, () => 0.999)).toEqual(['b', 'c', 'd', 'a']);
    expect(items).toEqual(['a', 'b', 'c', 'd']);
  });

  it('merges saved progress per module and survives a reload', () => {
    expect(getProgress('foundations')).toEqual({});
    saveProgress('foundations', { confidenceBefore: 2 });
    saveProgress('foundations', { completedAt: '2026-10-02', confidenceAfter: 4 });
    saveProgress('frameworks', { confidenceBefore: 3 });

    expect(JSON.parse(localStorage.getItem('learnProgress') ?? '{}').foundations).toEqual({
      confidenceBefore: 2,
      completedAt: '2026-10-02',
      confidenceAfter: 4
    });
    expect(getProgress('frameworks')).toEqual({ confidenceBefore: 3 });
  });
});

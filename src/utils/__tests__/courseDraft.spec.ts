import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DRAFT_KEY,
  DRAFT_MAX_AGE_MS,
  DRAFT_VERSION,
  canStore,
  isWholeDraft,
  readStoredDraft,
  removeDraft,
  textFingerprint,
  writeDraft,
  type SyllabusDraft
} from '@/utils/courseDraft';

const SAVED_AT = '2026-11-01T10:00:00.000Z';

const draft = (overrides: Record<string, unknown> = {}): SyllabusDraft =>
  ({
    version: DRAFT_VERSION,
    savedAt: SAVED_AT,
    text: textFingerprint('Ecology'),
    course: {
      step: 3,
      reading: { text: 'Ecology' },
      teachingContext: { title: 'Ecology' },
      courseObjectives: [],
      courseTopics: [],
      coursePlan: []
    },
    connections: { status: 'ready', connections: [{ id: 'idea-1', title: 'Soil carbon' }] },
    ...overrides
  }) as unknown as SyllabusDraft;

describe('courseDraft', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fingerprints a text by its length and a hash, the same text the same way', () => {
    expect(textFingerprint('Ecology')).toBe(textFingerprint('Ecology'));
    expect(textFingerprint('Ecology')).not.toBe(textFingerprint('Ecologie'));
    expect(textFingerprint('Ecology')).toMatch(/^7:/);
    expect(textFingerprint(null)).toBe('none');
  });

  it('accepts only a whole draft of this version, from a read course', () => {
    expect(isWholeDraft(draft())).toBe(true);
    expect(isWholeDraft(draft({ version: DRAFT_VERSION + 1 }))).toBe(false);
    expect(isWholeDraft(draft({ savedAt: 'yesterday' }))).toBe(false);
    expect(isWholeDraft({ ...draft(), course: { ...draft().course, step: 1 } })).toBe(false);
    expect(isWholeDraft({ ...draft(), course: { ...draft().course, reading: null } })).toBe(false);
    expect(
      isWholeDraft({ ...draft(), connections: { status: 'ready', connections: [{ id: 1 }] } })
    ).toBe(false);
    expect(isWholeDraft('draft')).toBe(false);
  });

  it('reads back what was written, and says when nothing or something broken is there', () => {
    expect(readStoredDraft()).toEqual({ state: 'none' });

    expect(writeDraft(draft())).toBe('saved');
    expect(readStoredDraft(Date.parse(SAVED_AT))).toEqual({ state: 'found', draft: draft() });

    localStorage.setItem(DRAFT_KEY, JSON.stringify({ version: 0 }));
    expect(readStoredDraft()).toEqual({ state: 'invalid' });
  });

  it('removes a draft older than 30 days instead of offering it', () => {
    writeDraft(draft());

    expect(readStoredDraft(Date.parse(SAVED_AT) + DRAFT_MAX_AGE_MS).state).toBe('found');
    expect(readStoredDraft(Date.parse(SAVED_AT) + DRAFT_MAX_AGE_MS + 1)).toEqual({
      state: 'none'
    });
    expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
  });

  it('says when the storage is full, or cannot be used at all', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    setItem.mockImplementationOnce(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
    expect(writeDraft(draft())).toBe('full');

    setItem.mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    expect(writeDraft(draft())).toBe('unavailable');
    expect(canStore()).toBe(false);

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    expect(readStoredDraft()).toEqual({ state: 'unavailable' });
  });

  it('removes the draft', () => {
    writeDraft(draft());
    expect(canStore()).toBe(true);

    expect(removeDraft()).toBe(true);
    expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
  });
});

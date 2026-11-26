import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearFromSessionStorage,
  clearFromStorage,
  clearFromStorageWhere,
  clearLegacyKeys,
  getFromSessionStorage,
  getFromStorage,
  isOlderThan,
  saveToSessionStorage,
  saveToStorage
} from '../storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('saves a value as json and reads it back', () => {
    saveToStorage('chat', [{ role: 'user', content: 'hi' }]);

    expect(localStorage.getItem('chat')).toBe('[{"role":"user","content":"hi"}]');
    expect(getFromStorage('chat')).toEqual([{ role: 'user', content: 'hi' }]);
  });

  it('returns null for a missing key', () => {
    expect(getFromStorage('missing')).toBeNull();
  });

  it('returns null and logs when the stored value is not json', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('broken', '{not json');

    expect(getFromStorage('broken')).toBeNull();
    expect(consoleError).toHaveBeenCalledOnce();
  });

  it('clears a key', () => {
    saveToStorage('searchInput', 'query');
    clearFromStorage('searchInput');

    expect(localStorage.getItem('searchInput')).toBeNull();
  });

  it('does the same in sessionStorage, for what only this tab keeps', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    saveToSessionStorage('searchResults', [{ id: 'doc-1' }]);

    expect(sessionStorage.getItem('searchResults')).toBe('[{"id":"doc-1"}]');
    expect(getFromSessionStorage('searchResults')).toEqual([{ id: 'doc-1' }]);
    expect(localStorage.getItem('searchResults')).toBeNull();
    expect(getFromSessionStorage('missing')).toBeNull();

    sessionStorage.setItem('broken', '{not json');
    expect(getFromSessionStorage('broken')).toBeNull();
    expect(consoleError).toHaveBeenCalledOnce();

    clearFromSessionStorage('searchResults');
    expect(sessionStorage.getItem('searchResults')).toBeNull();
  });

  it('clears the keys that match', () => {
    saveToStorage('evalForm:a', true);
    saveToStorage('evalForm:b', true);
    saveToStorage('language', 'fr');

    clearFromStorageWhere((key) => key.startsWith('evalForm:'));

    expect(Object.keys({ ...localStorage })).toEqual(['language']);
  });

  it('tells a date older than a duration, or one that cannot be read', () => {
    const now = Date.parse('2026-11-26T12:00:00Z');
    const day = 24 * 60 * 60 * 1000;

    expect(isOlderThan('2026-11-26T00:00:00Z', day, now)).toBe(false);
    expect(isOlderThan('2026-11-25T11:00:00Z', day, now)).toBe(true);
    expect(isOlderThan('not a date', day, now)).toBe(true);
    expect(isOlderThan(undefined, day, now)).toBe(true);
  });

  it('removes what older versions kept and this one does not', () => {
    for (const key of [
      'chat',
      'chatSources',
      'searchInput',
      'searchMessageId',
      'courseMetadaRef'
    ]) {
      saveToStorage(key, 'old');
    }
    saveToStorage('chatThreadId', 'thread-1');
    saveToSessionStorage('chatSources', { threadId: 'thread-1', docs: [] });

    clearLegacyKeys();

    expect(Object.keys({ ...localStorage })).toEqual(['chatThreadId']);
    expect(getFromSessionStorage('chatSources')).not.toBeNull();
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearFromStorage, getFromStorage, saveToStorage } from '../storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
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
});

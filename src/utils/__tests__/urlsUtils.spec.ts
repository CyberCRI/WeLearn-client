import { afterEach, describe, expect, it } from 'vitest';
import { getPagePath, getQueryParamValue, isInPage } from '../urlsUtils';

describe('urlsUtils', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('reads a query param from the current url', () => {
    window.history.pushState({}, '', '/search?score=true');

    expect(getQueryParamValue('score')).toBe('true');
    expect(getQueryParamValue('lang')).toBeNull();
  });

  it('returns the current path', () => {
    window.history.pushState({}, '', '/tutor?step=2');

    expect(getPagePath()).toBe('/tutor');
  });

  it('tells whether the current path contains a page', () => {
    window.history.pushState({}, '', '/q-and-a');

    expect(isInPage('q-and-a')).toBe(true);
    expect(isInPage('search')).toBe(false);
  });
});

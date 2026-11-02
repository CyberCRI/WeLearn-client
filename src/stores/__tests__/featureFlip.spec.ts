import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import type { Environment } from '@/types';
import { useFeatureFlipStore } from '../featureFlip';

const env = vi.hoisted(() => ({ name: 'prod' as Environment }));

vi.mock('@/utils/env', () => ({
  ENVIRONMENTS: ['dev', 'staging', 'test', 'prod'],
  get ENVIRONMENT_NAME() {
    return env.name;
  }
}));

const PAGE_FEATURES = ['chat', 'tutor', 'search', 'bookmarks', 'about', 'microlearning'] as const;

describe('featureFlip store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it.each<Environment>(['dev', 'staging', 'test', 'prod'])('enables every page in %s', (name) => {
    env.name = name;
    const store = useFeatureFlipStore();

    PAGE_FEATURES.forEach((feature) => expect(store.isFeatureEnabled(feature)).toBe(true));
  });

  it.each<[Environment, boolean]>([
    ['dev', true],
    ['staging', false],
    ['test', false],
    ['prod', false]
  ])('workshop in %s: %s', (name, expected) => {
    env.name = name;
    const store = useFeatureFlipStore();

    expect(store.isFeatureEnabled('workshop')).toBe(expected);
  });

  it.each<[Environment, boolean]>([
    ['dev', true],
    ['staging', true],
    ['test', false],
    ['prod', false]
  ])('auth in %s: %s', (name, expected) => {
    env.name = name;
    const store = useFeatureFlipStore();

    expect(store.isFeatureEnabled('auth')).toBe(expected);
  });

  it.each<[Environment, boolean]>([
    ['dev', true],
    ['staging', false],
    ['test', false],
    ['prod', false]
  ])('analytics in %s: %s', (name, expected) => {
    env.name = name;
    const store = useFeatureFlipStore();

    expect(store.isFeatureEnabled('analytics')).toBe(expected);
  });
});

describe('featureFlip preview', () => {
  const openWith = (search: string) => {
    window.history.replaceState({}, '', `/q-and-a${search}`);
    setActivePinia(createPinia());
    return useFeatureFlipStore();
  };

  beforeEach(() => {
    env.name = 'prod';
    localStorage.clear();
  });

  it('keeps every feature off-env as is without the param', () => {
    const store = openWith('');

    expect(store.previewFeatures).toEqual([]);
    expect(store.isFeatureEnabled('auth')).toBe(false);
  });

  it('turns on only the requested features', () => {
    const store = openWith('?preview=auth');

    expect(store.isFeatureEnabled('auth')).toBe(true);
    expect(store.isFeatureEnabled('analytics')).toBe(false);
    expect(store.previewFeatures).toEqual(['auth']);
  });

  it('takes a comma list and ignores unknown names', () => {
    const store = openWith('?preview=auth,%20analytics,foo,toString');

    expect(store.previewFeatures).toEqual(['auth', 'analytics']);
  });

  it('survives a reload without the param', () => {
    openWith('?preview=auth');
    const store = openWith('');

    expect(store.isFeatureEnabled('auth')).toBe(true);
  });

  it('adds to the features already saved', () => {
    openWith('?preview=auth');
    const store = openWith('?preview=analytics');

    expect(store.previewFeatures).toEqual(['auth', 'analytics']);
  });

  it('is cleared by preview=off', () => {
    openWith('?preview=auth');
    openWith('?preview=off');
    const store = openWith('');

    expect(store.isFeatureEnabled('auth')).toBe(false);
    expect(localStorage.getItem('featurePreview')).toBeNull();
  });

  it('drops unknown names from a tampered storage value', () => {
    localStorage.setItem('featurePreview', JSON.stringify(['foo', 'auth']));
    const store = openWith('');

    expect(store.previewFeatures).toEqual(['auth']);
  });

  it('ignores a storage value that is not a list', () => {
    localStorage.setItem('featurePreview', JSON.stringify('auth'));
    const store = openWith('');

    expect(store.previewFeatures).toEqual([]);
  });
});

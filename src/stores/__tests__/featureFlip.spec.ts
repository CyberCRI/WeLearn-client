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
});

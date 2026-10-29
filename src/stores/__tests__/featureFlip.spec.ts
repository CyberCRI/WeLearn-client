import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useFeatureFlipStore } from '../featureFlip';

const env = vi.hoisted(() => ({ isDev: false }));

vi.mock('@/utils/env', () => ({
  get IS_DEV_ENVIRONMENT() {
    return env.isDev;
  }
}));

describe('featureFlip store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('enables the known features only', () => {
    const store = useFeatureFlipStore();

    expect(store.isFeatureEnabled('chat')).toBe(true);
    expect(store.isFeatureEnabled('unknown')).toBe(false);
  });

  it.each([
    [true, 'enables', true],
    [false, 'disables', false]
  ])('isWorkshopFeatureEnabled: dev=%s %s the workshop features', (isDev, _, expected) => {
    env.isDev = isDev;
    const store = useFeatureFlipStore();

    expect(store.isWorkshopFeatureEnabled()).toBe(expected);
    expect(store.isDevEnvironment).toBe(expected);
  });
});

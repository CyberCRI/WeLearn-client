import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import FeaturesPage from '../FeaturesPage.vue';
import { useFeatureFlipStore } from '@/stores/featureFlip';
import { reloadPage } from '@/utils/navigation';

// the test build: chat on, syllabusV2 off, analytics previewed in this browser
vi.mock('@/utils/env', () => ({
  ENVIRONMENTS: ['dev', 'staging', 'test', 'prod'],
  ENVIRONMENT_NAME: 'test'
}));
vi.mock('@/utils/navigation', () => ({ reloadPage: vi.fn() }));

const row = (wrapper: ReturnType<typeof mount>, feature: string) =>
  wrapper.get(`[data-testid="feature-${feature}"]`);

describe('FeaturesPage', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('featurePreview', JSON.stringify(['analytics']));
    vi.mocked(reloadPage).mockClear();
    setActivePinia(createPinia());
  });

  const mountPage = () => mount(FeaturesPage, { global: { stubs: { RouterLink: true } } });

  it('says, for each feature, whether it is on here and how', () => {
    const wrapper = mountPage();

    expect(row(wrapper, 'chat').get('[data-testid="status"]').text()).toBe(
      'features.status.environment'
    );
    expect(row(wrapper, 'analytics').get('[data-testid="status"]').text()).toBe(
      'features.status.preview'
    );
    expect(row(wrapper, 'syllabusV2').get('[data-testid="status"]').text()).toBe(
      'features.status.off'
    );
    expect(row(wrapper, 'syllabusV2').text()).toContain('dev');
  });

  it('previews a feature that is off, and stops a preview, with a page load', async () => {
    const wrapper = mountPage();
    const store = useFeatureFlipStore();
    const keep = vi.spyOn(store, 'keepPreviewFeatures');

    await row(wrapper, 'syllabusV2').get('[data-testid="start-preview"]').trigger('click');
    expect(keep).toHaveBeenLastCalledWith(['analytics', 'syllabusV2']);

    await row(wrapper, 'analytics').get('[data-testid="stop-preview"]').trigger('click');
    expect(keep).toHaveBeenLastCalledWith([]);

    await wrapper.get('[data-testid="stop-all-previews"]').trigger('click');
    expect(keep).toHaveBeenLastCalledWith([]);
    expect(reloadPage).toHaveBeenCalledTimes(3);
  });

  it('offers no preview for a feature on here, nor for the page itself', () => {
    const wrapper = mountPage();

    expect(row(wrapper, 'chat').find('[data-testid="start-preview"]').exists()).toBe(false);
    expect(row(wrapper, 'featuresPage').find('[data-testid="start-preview"]').exists()).toBe(false);
  });
});

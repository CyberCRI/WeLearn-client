import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import SummariesStep from '@/components/tutor/SummariesStep.vue';

const mountStep = () =>
  mount(SummariesStep, {
    props: {
      summaries: ['A summary'],
      files: { 'a.pdf': new File(['a'], 'a.pdf', { type: 'application/pdf' }) },
      updateSummary: vi.fn(),
      action: vi.fn()
    }
  });

describe('SummariesStep', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    localStorage.removeItem('featurePreview');
  });

  it('shows no AI label while the syllabusV2 flag is off', () => {
    expect(mountStep().find('[data-testid="ai-label"]').exists()).toBe(false);
  });

  it('says WeLearn AI analyzed the documents when the flag is on', () => {
    localStorage.setItem('featurePreview', JSON.stringify(['syllabusV2']));
    expect(mountStep().find('[data-testid="ai-label"]').text()).toBe('tutor.summaryStep.aiLabel');
  });
});

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SummariesStep from '@/components/tutor/SummariesStep.vue';

describe('SummariesStep', () => {
  it('says the summaries were analysed by WeLearn AI', () => {
    const wrapper = mount(SummariesStep, {
      props: {
        summaries: ['A summary'],
        files: { 'a.pdf': new File(['a'], 'a.pdf', { type: 'application/pdf' }) },
        updateSummary: vi.fn(),
        action: vi.fn()
      }
    });
    expect(wrapper.find('[data-testid="ai-label"]').text()).toBe('tutor.summaryStep.aiLabel');
  });
});

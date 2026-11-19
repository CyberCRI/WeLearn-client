import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ReadingProgress from '@/components/tutor/ReadingProgress.vue';

const mountProgress = (props: Record<string, unknown> = {}) =>
  mount(ReadingProgress, {
    props: {
      fileName: 'syllabus.pdf',
      phase: 'sending',
      uploadProgress: 40,
      startedAt: null,
      ...props
    }
  });

describe('ReadingProgress', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the real progress of sending the syllabus, the reading still to come', () => {
    const wrapper = mountProgress();
    expect(wrapper.text()).toContain('syllabus.pdf');
    expect(wrapper.find('[data-testid="step-sending"]').classes()).toContain('is-active');
    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('40');
    expect(wrapper.find('[data-testid="step-reading"]').classes()).toContain('is-pending');
    expect(wrapper.find('[data-testid="elapsed"]').exists()).toBe(false);
  });

  it('ticks the sending, then counts the seconds while WeLearn reads, never a percentage', async () => {
    vi.useFakeTimers();
    const start = Date.now();
    const wrapper = mountProgress({ phase: 'reading', startedAt: start });
    expect(wrapper.find('[data-testid="step-sending"]').classes()).toContain('is-done');
    expect(wrapper.find('[data-testid="step-sending"]').text()).toContain('tutor.reading.sent');
    expect(wrapper.find('[data-testid="step-reading"] [aria-valuenow]').exists()).toBe(false);
    vi.advanceTimersByTime(3000);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-testid="elapsed"]').text()).toBe('tutor.reading.elapsed');
  });

  it('can be cancelled', async () => {
    const wrapper = mountProgress();
    await wrapper.find('[data-testid="cancel-reading"]').trigger('click');
    expect(wrapper.emitted('cancel')).toHaveLength(1);
  });
});

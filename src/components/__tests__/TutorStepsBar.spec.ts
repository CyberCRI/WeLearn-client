import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TutorStepsBar from '@/components/tutor/TutorStepsBar.vue';
import ProgressBar from '@/components/microlearning/ProgressBar.vue';
import { scrollToAnchor } from '@/utils/navigation';

vi.mock('@/utils/navigation', () => ({ scrollToAnchor: vi.fn() }));

describe('TutorStepsBar', () => {
  it('shows the current step, counted from 1 like the tutor store', () => {
    const wrapper = mount(TutorStepsBar, { props: { labels: ['a', 'b', 'c', 'd'], step: 3 } });
    expect(wrapper.findComponent(ProgressBar).props()).toMatchObject({
      currentStep: 2,
      labels: ['a', 'b', 'c', 'd'],
      clickable: true
    });
  });

  it('scrolls to the step picked in the bar', () => {
    const wrapper = mount(TutorStepsBar, { props: { labels: ['a', 'b'], step: 2 } });
    wrapper.findComponent(ProgressBar).vm.$emit('select', 0);
    expect(scrollToAnchor).toHaveBeenLastCalledWith('target-1');
  });
});

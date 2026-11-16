import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AiNote from '@/components/tutor/AiNote.vue';
import TooltipComponent from '@/components/TooltipComponent.vue';

describe('AiNote', () => {
  it('shows a short label, its explanation in a tooltip and to screen readers', () => {
    const wrapper = mount(AiNote, { props: { label: 'To check', detail: 'Read by WeLearn AI' } });
    expect(wrapper.text()).toContain('To check');
    expect(wrapper.attributes('aria-label')).toBe('To check: Read by WeLearn AI');
    expect(wrapper.attributes('tabindex')).toBe('0');
    expect(wrapper.findComponent(TooltipComponent).props('tooltipText')).toBe('Read by WeLearn AI');
  });
});

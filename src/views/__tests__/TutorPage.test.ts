import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import TutorPage from '../TutorPage.vue';
import ScratchWizard from '@/components/tutor/ScratchWizard.vue';

// the wizard scrolls to the current step on mount, but the wrapper isn't in the document
vi.mock('@/utils/navigation', () => ({ scrollToAnchor: vi.fn() }));

describe('TutorPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders properly', () => {
    const wrapper = mount(TutorPage);
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders the current syllabus creator', () => {
    const wrapper = mount(TutorPage, { shallow: true });
    expect(wrapper.findComponent(ScratchWizard).exists()).toBe(true);
  });
});

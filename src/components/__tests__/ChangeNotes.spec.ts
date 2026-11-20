import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ChangeNotes from '@/components/tutor/development/ChangeNotes.vue';
import { exists, proposal, text } from './developmentFixtures';

describe('ChangeNotes', () => {
  it('folds the pedagogical notes, GreenComp by its name', () => {
    const wrapper = mount(ChangeNotes, {
      props: {
        guidance: {
          learning: 'Compare indicators.',
          teaching: null,
          check: 'A short quiz.',
          greencomp: { id: 'systems_thinking', how: 'Links economy and nature.' }
        }
      }
    });
    expect(text(wrapper, 'note-learning')).toBe('Compare indicators.');
    expect(text(wrapper, 'note-check')).toBe('A short quiz.');
    expect(exists(wrapper, 'note-teaching')).toBe(false);
    expect(text(wrapper, 'note-greencomp')).toContain('tutor.greencomp.systems_thinking');
  });

  it('shows nothing without notes', () => {
    const wrapper = mount(ChangeNotes, { props: { guidance: proposal().guidance } });
    expect(exists(wrapper, 'pedagogical-notes')).toBe(false);
  });
});

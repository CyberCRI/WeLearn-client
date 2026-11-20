import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ChangeWording from '@/components/tutor/development/ChangeWording.vue';
import { exists, text } from './developmentFixtures';

const suggested = 'Add the ecological footprint next to GDP.';

describe('ChangeWording', () => {
  it("shows the suggestion, or the teacher's own wording, said so", async () => {
    const wrapper = mount(ChangeWording, {
      props: { suggested, edited: null, isEditing: false }
    });
    expect(text(wrapper, 'change-text')).toBe(suggested);
    expect(exists(wrapper, 'change-edited')).toBe(false);

    await wrapper.setProps({ edited: 'My own wording.' });
    expect(text(wrapper, 'change-text')).toBe('My own wording.');
    expect(exists(wrapper, 'change-edited')).toBe(true);
  });

  it('edits from the current wording, saves only a non-empty one, and cancels', async () => {
    const wrapper = mount(ChangeWording, {
      props: { suggested, edited: null, isEditing: true }
    });
    const editor = wrapper.find('textarea');
    expect((editor.element as HTMLTextAreaElement).value).toBe(suggested);

    await editor.setValue('');
    expect(wrapper.find('[data-testid="save-change"]').attributes('disabled')).toBeDefined();
    await editor.setValue('My own wording.');
    await wrapper.find('[data-testid="save-change"]').trigger('click');
    expect(wrapper.emitted('save')).toEqual([['My own wording.']]);

    await wrapper.find('[data-testid="cancel-edit"]').trigger('click');
    await editor.trigger('keydown.esc');
    expect(wrapper.emitted('cancel')).toHaveLength(2);
  });

  it('starts a new edit from the saved wording', async () => {
    const wrapper = mount(ChangeWording, {
      props: { suggested, edited: 'My own wording.', isEditing: false }
    });
    await wrapper.setProps({ isEditing: true });
    expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('My own wording.');
  });
});

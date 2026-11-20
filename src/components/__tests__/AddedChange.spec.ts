import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AddedChange from '@/components/tutor/updated/AddedChange.vue';
import { approvedChange } from '@/utils/__tests__/approvedChange';
import { exists, text } from './developmentFixtures';

describe('AddedChange', () => {
  it('labels the change, says its session, and lists its sources', () => {
    const wrapper = mount(AddedChange, {
      props: {
        change: approvedChange(1, { session: 'CM5 · Week 2' }),
        label: 'Addition to a topic',
        sources: 'Sources : Doc'
      }
    });
    expect(wrapper.find('.added-label').text()).toContain('Addition to a topic');
    expect(text(wrapper, 'added-session')).toBe('· CM5 · Week 2');
    expect(text(wrapper, 'change-text')).toBe('Changement 1.');
    expect(text(wrapper, 'added-sources')).toBe('Sources : Doc');
  });

  it("says the teacher's own wording, and saves an edit for its connection", async () => {
    const wrapper = mount(AddedChange, {
      props: { change: approvedChange(2, { text: 'Mine.' }), label: 'Topic' }
    });
    expect(exists(wrapper, 'change-edited')).toBe(true);

    await wrapper.find('[data-testid="edit-added"]').trigger('click');
    expect(exists(wrapper, 'edit-added')).toBe(false);
    expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('Mine.');
    expect(text(wrapper, 'save-change')).toBe('tutor.check.saveChanges');
    await wrapper.find('textarea').setValue('Better.');
    await wrapper.find('[data-testid="save-change"]').trigger('click');
    expect(wrapper.emitted('save')).toEqual([['2', 'Better.']]);
    expect(exists(wrapper, 'change-editor')).toBe(false);

    await wrapper.find('[data-testid="edit-added"]').trigger('click');
    await wrapper.find('[data-testid="cancel-edit"]').trigger('click');
    expect(exists(wrapper, 'change-editor')).toBe(false);
  });
});

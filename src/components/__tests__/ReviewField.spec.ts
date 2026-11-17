import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ReviewField from '@/components/tutor/ReviewField.vue';
import { fromSyllabus } from '@/utils/courseCheck';

const origin = (props: Record<string, unknown>) =>
  mount(ReviewField, { props: props as never })
    .find('[data-testid="field-origin"]')
    .text();

describe('ReviewField', () => {
  it('shows text read as expected without a label: the check stays in the background', () => {
    for (const verification of ['verified', 'unchecked'] as const) {
      const wrapper = mount(ReviewField, {
        props: { field: fromSyllabus('Define GDP.', verification) }
      });
      expect(wrapper.find('[data-testid="field-text"]').text()).toBe('Define GDP.');
      expect(wrapper.find('[data-testid="field-origin"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="restore-field"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="remove-field"]').exists()).toBe(false);
    }
  });

  it('marks text not found word for word', () => {
    const unverified = mount(ReviewField, {
      props: { field: fromSyllabus('Define GDP.', 'unverified') }
    });
    expect(unverified.find('[data-testid="field-origin"]').text()).toBe(
      'tutor.check.origin.unverified'
    );
    expect(unverified.find('[data-testid="review-field"]').classes()).toContain('is-unverified');
  });

  it("labels the teacher's own text as theirs, whatever was read before", () => {
    expect(
      origin({
        field: { value: 'New', origin: 'edited', original: 'Old', verification: 'unverified' }
      })
    ).toBe('tutor.check.origin.edited');
    expect(origin({ field: { value: 'Mine', origin: 'added' } })).toBe('tutor.check.origin.added');
  });

  it('folds a long text, and shows it whole on demand', async () => {
    const wrapper = mount(ReviewField, {
      props: { field: fromSyllabus('x'.repeat(800), 'verified'), isCollapsible: true }
    });
    expect(wrapper.find('[data-testid="field-text"]').classes()).toContain('is-clamped');
    await wrapper.find('[data-testid="toggle-text"]').trigger('click');
    expect(wrapper.find('[data-testid="field-text"]').classes()).not.toContain('is-clamped');
    const short = mount(ReviewField, {
      props: { field: fromSyllabus('Short.', 'verified'), isCollapsible: true }
    });
    expect(short.find('[data-testid="toggle-text"]').exists()).toBe(false);
  });

  it('edits the text and saves it', async () => {
    const wrapper = mount(ReviewField, {
      props: { field: fromSyllabus('Define GDP.', 'verified') }
    });
    await wrapper.find('[data-testid="edit-field"]').trigger('click');
    await wrapper.find('[data-testid="field-editor"]').setValue('Define GDP and its limits.');
    await wrapper.find('[data-testid="save-field"]').trigger('click');
    expect(wrapper.emitted('save')).toEqual([['Define GDP and its limits.']]);
    expect(wrapper.find('[data-testid="field-editor"]').exists()).toBe(false);
  });

  it('cancels an edit with Escape', async () => {
    const wrapper = mount(ReviewField, {
      props: { field: fromSyllabus('Define GDP.', 'verified') }
    });
    await wrapper.find('[data-testid="edit-field"]').trigger('click');
    await wrapper.find('[data-testid="field-editor"]').trigger('keydown', { key: 'Escape' });
    expect(wrapper.find('[data-testid="field-editor"]').exists()).toBe(false);
    expect(wrapper.emitted('save')).toBeUndefined();
  });

  it('offers to restore a corrected text and to remove one', async () => {
    const wrapper = mount(ReviewField, {
      props: {
        field: { value: 'New', origin: 'edited', original: 'Old' },
        canRemove: true
      }
    });
    await wrapper.find('[data-testid="restore-field"]').trigger('click');
    await wrapper.find('[data-testid="remove-field"]').trigger('click');
    expect(wrapper.emitted('restore')).toHaveLength(1);
    expect(wrapper.emitted('remove')).toHaveLength(1);
  });

  it('says what is missing and offers to add it', async () => {
    const wrapper = mount(ReviewField, {
      props: { field: null, missingText: 'Not found.', addLabel: 'Add' }
    });
    expect(wrapper.find('[data-testid="field-missing"]').text()).toBe('Not found.');
    await wrapper.find('[data-testid="add-field"]').trigger('click');
    await wrapper.find('[data-testid="field-editor"]').setValue('A description.');
    await wrapper.find('[data-testid="save-field"]').trigger('click');
    expect(wrapper.emitted('save')).toEqual([['A description.']]);
  });
});

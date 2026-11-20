import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import CompleteDocument from '@/components/tutor/updated/CompleteDocument.vue';
import type { CompleteLabels, CompletePlan } from '@/utils/completeSyllabus';
import { approvedChange } from '@/utils/__tests__/approvedChange';
import { exists, resource } from './developmentFixtures';

const LABELS = {
  title: 'Syllabus',
  note: 'Note.',
  change: 'Approved change',
  sources: 'Sources',
  toPlace: 'Changes to place',
  toPlaceNote: 'Place them.',
  kinds: { objective: 'Objective', topic: 'Topic', teaching: 'Teaching', assessment: 'Assessment' }
} satisfies CompleteLabels;

const revision = approvedChange(1, { kind: 'objective', original: 'Use indicators.' });
const PLAN: CompletePlan = {
  entries: [
    { type: 'line', text: 'OBJECTIVES', isReplaced: false },
    { type: 'line', text: 'Use indicators.', isReplaced: true },
    { type: 'change', change: revision, action: 'replace', anchor: 'Use indicators.' },
    { type: 'line', text: '', isReplaced: false },
    { type: 'line', text: '', isReplaced: false },
    { type: 'line', text: 'Week 1', isReplaced: false }
  ],
  toPlace: [approvedChange(2, { kind: 'assessment', resources: [resource('direct', null)] })]
};

describe('CompleteDocument', () => {
  it('shows every line, a heading bold, the replaced one struck, and the changes in place', () => {
    const wrapper = mount(CompleteDocument, { props: { plan: PLAN, labels: LABELS } });
    const lines = wrapper.findAll('[data-testid="document-line"]');
    expect(lines.map((line) => line.text())).toEqual(['OBJECTIVES', 'Use indicators.', 'Week 1']);
    expect(lines[0].classes()).toContain('heading');
    expect(wrapper.find('[data-testid="document-replaced"]').text()).toBe('Use indicators.');
    // two empty lines show as one gap
    expect(wrapper.findAll('.gap')).toHaveLength(1);
    const added = wrapper.findAll('[data-testid="added"]');
    expect(added[0].text()).toContain('Approved change · Objective');
  });

  it('lists the changes without a reliable place last, with their sources', () => {
    const wrapper = mount(CompleteDocument, { props: { plan: PLAN, labels: LABELS } });
    expect(exists(wrapper, 'document-to-place')).toBe(true);
    const last = wrapper.findAll('[data-testid="added"]').at(-1)!;
    expect(last.find('[data-testid="added-sources"]').text()).toBe(
      'Sources : Doc direct — https://example.org/a'
    );
  });

  it('passes an edit on with its connection', async () => {
    const wrapper = mount(CompleteDocument, {
      props: { plan: { ...PLAN, toPlace: [] }, labels: LABELS }
    });
    await wrapper.find('[data-testid="edit-added"]').trigger('click');
    await wrapper.find('textarea').setValue('Compare indicators.');
    await wrapper.find('[data-testid="save-change"]').trigger('click');
    expect(wrapper.emitted('save')).toEqual([['1', 'Compare indicators.']]);
  });
});

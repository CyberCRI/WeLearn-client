import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import UpdatedOutline from '@/components/tutor/updated/UpdatedOutline.vue';
import { approvedChange } from '@/utils/__tests__/approvedChange';
import { exists, seedCourse } from './developmentFixtures';

vi.mock('@/utils/fetch', () => ({ basePostAxios: vi.fn() }));

const CHANGES = [
  approvedChange(1, {
    kind: 'objective',
    original: 'Use indicators.',
    placement: 'Use indicators.'
  }),
  approvedChange(2, { placement: 'Measure' }),
  approvedChange(3, { kind: 'assessment', placement: null })
];

describe('UpdatedOutline', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    seedCourse().teachingContext.title = 'Macroeconomics';
  });

  it('shows the confirmed course with each change in its place, a revision instead', () => {
    const wrapper = mount(UpdatedOutline, { props: { changes: CHANGES } });
    expect(wrapper.find('.course-title').text()).toBe('Macroeconomics');
    const objectives = wrapper.findAll('ol > li');
    expect(objectives[0].text()).toBe('Define GDP.');
    // the revised objective: its new wording, the original one click away
    expect(objectives[1].find('[data-testid="revised"]').text()).toContain('Changement 1.');
    expect(objectives[1].find('details').text()).toContain('Use indicators.');
    // a subtopic's change goes under its topic
    expect(wrapper.find('ul > li').text()).toContain('Changement 2.');
    // no place: kept apart, never placed by guess
    expect(exists(wrapper, 'outline-unplaced')).toBe(true);
    expect(wrapper.findAll('[data-testid="added"]').at(-1)!.text()).toContain('Changement 3.');
  });

  it('shows the outline only when it holds a change', () => {
    const wrapper = mount(UpdatedOutline, { props: { changes: CHANGES } });
    expect(wrapper.text()).not.toContain('Week 1 – GDP');
    const withSession = mount(UpdatedOutline, {
      props: { changes: [approvedChange(4, { kind: 'teaching', placement: 'Week 1 – GDP' })] }
    });
    expect(withSession.text()).toContain('Week 1 – GDP');
  });

  it('passes an edit on with its connection', async () => {
    const wrapper = mount(UpdatedOutline, { props: { changes: CHANGES } });
    await wrapper.find('[data-testid="edit-added"]').trigger('click');
    await wrapper.find('textarea').setValue('Compare indicators.');
    await wrapper.find('[data-testid="save-change"]').trigger('click');
    expect(wrapper.emitted('save')).toEqual([['1', 'Compare indicators.']]);
  });
});

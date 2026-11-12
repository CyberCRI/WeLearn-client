import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import UpdatedSyllabus from '@/components/tutor/UpdatedSyllabus.vue';
import { useConnectionsStore, type Connection } from '@/stores/connections';
import { useTutorStore } from '@/stores/tutor';
import { convertMarkdownToDocx, downloadDocx } from '@/utils/md-to-docx';
import type { AdaptationProposal } from '@/utils/connections';

vi.mock('@/utils/md-to-docx', () => ({
  convertMarkdownToDocx: vi.fn(async () => new Blob(['docx'])),
  downloadDocx: vi.fn()
}));
vi.mock('@/stores/bookmarks', () => ({
  useBookmarksStore: () => ({ toggleBookmark: vi.fn(), isBookmarked: () => false })
}));

const proposal = (values: Partial<AdaptationProposal>): AdaptationProposal => ({
  kind: 'topic',
  original: 'Stratégie',
  suggested: 'Add the planetary boundaries.',
  why: 'It fits the strategy topic.',
  support: 'strong',
  resources: [],
  guidance: {
    learning: 'Compare two strategies for their environmental effects.',
    greencomp: null,
    teaching: null,
    check: null
  },
  ...values
});

const connection = (
  id: number,
  values: Partial<AdaptationProposal>,
  placement: string | null = null
) =>
  ({
    id,
    title: `Connection ${id}`,
    anchor: null,
    anchorLabel: null,
    why: '',
    resources: [],
    decision: 'selected',
    development: {
      status: 'ready',
      proposal: proposal(values),
      decision: 'accepted',
      edited: null,
      placement
    }
  }) as Connection;

const prepare = () => {
  const tutor = useTutorStore();
  tutor.teachingContext = { ...tutor.teachingContext, title: 'Introduction to management' };
  tutor.courseTopics = [
    { value: 'Stratégie', origin: 'extracted' },
    { value: 'Marketing', origin: 'extracted' }
  ];
  tutor.courseObjectives = [{ value: 'Explain the basics.', origin: 'extracted' }];
  const store = useConnectionsStore();
  store.connections = [
    connection(0, {}),
    connection(1, {
      kind: 'objective',
      original: 'Explain the basics.',
      suggested: 'Explain the basics and their limits.'
    }),
    connection(2, {
      kind: 'assessment',
      original: null,
      suggested: 'Add a sustainability question.'
    })
  ];
  return { tutor, store };
};

describe('UpdatedSyllabus (step 4)', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('says plainly when no change was accepted, and leads back', async () => {
    const tutor = useTutorStore();
    tutor.setStep(4);
    const wrapper = mount(UpdatedSyllabus);
    expect(wrapper.find('[data-testid="no-changes"] p').text()).toBe('tutor.updated.noChanges');
    // no updated course is shown when nothing changed
    expect(wrapper.find('[data-testid="course-view"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="download-word"]').exists()).toBe(false);
    // one clear action back to the connections
    await wrapper.find('[data-testid="empty-back"]').trigger('click');
    expect(tutor.step).toBe(3);
  });

  it('lists the changes by where they belong; edits and removes them', async () => {
    const { store } = prepare();
    const wrapper = mount(UpdatedSyllabus);
    expect(wrapper.find('[data-testid="updated-course-line"]').text()).toBe(
      'Introduction to management · tutor.updated.approvedCount'
    );
    // the updated course first; the changes alone on request
    expect(wrapper.find('[data-testid="course-view"]').exists()).toBe(true);
    await wrapper.find('[data-testid="view-changes"]').trigger('click');
    const groups = wrapper.findAll('[data-testid="change-group"]');
    expect(groups.map((group) => group.find('h2').text())).toEqual([
      'Explain the basics.',
      'Stratégie',
      'tutor.updated.placementUnknown'
    ]);

    await wrapper.findAll('[data-testid="edit-approved"]')[1].trigger('click');
    await wrapper
      .find('[data-testid="approved-editor"]')
      .setValue('Add the planetary boundaries case.');
    await wrapper.find('[data-testid="save-approved"]').trigger('click');
    expect(store.acceptedChanges.find((c) => c.connectionId === 0)?.text).toBe(
      'Add the planetary boundaries case.'
    );

    // an unplaced change gets its place from the teacher, among real course parts
    await wrapper.find('[data-testid="place-approved"]').setValue('Marketing');
    expect(store.acceptedChanges.find((c) => c.connectionId === 2)?.placement).toBe('Marketing');

    await wrapper.findAll('[data-testid="remove-approved"]')[0].trigger('click');
    expect(store.acceptedChanges.map((c) => c.connectionId)).toEqual([0, 2]);
    expect(store.connections[1].development?.decision).toBe('kept');
  });

  it('shows a structured preview of the course with the changes in place', async () => {
    prepare();
    const wrapper = mount(UpdatedSyllabus);
    const view = wrapper.find('[data-testid="course-view"]');
    expect(view.find('[data-testid="outline-note"]').text()).toBe('tutor.updated.outlineNote');
    expect(view.text()).toContain('Explain the basics and their limits.');
    expect(view.find('[data-testid="revised"]').exists()).toBe(true);
    // each approved change marked with its kind, the exact wording below
    expect(
      view
        .findAll('[data-testid="added"]')
        .map((added) => [
          added.find('.added-label').text(),
          added.find('[data-testid="added-text"]').text()
        ])
    ).toEqual([
      // in the syllabus's language (english here), like the exports
      ['Addition to a topic', 'Add the planetary boundaries.'],
      ['Assessment change', 'Add a sustainability question.']
    ]);
  });

  it('edits an approved change where it shows; every view follows', async () => {
    const { store } = prepare();
    const wrapper = mount(UpdatedSyllabus);
    const topic = wrapper.findAll('[data-testid="added"]')[0];
    await topic.find('[data-testid="edit-added"]').trigger('click');
    await topic.find('[data-testid="added-editor"]').setValue('Add the doughnut model.');
    await topic.find('[data-testid="save-added"]').trigger('click');
    expect(store.acceptedChanges.find((c) => c.connectionId === 0)?.text).toBe(
      'Add the doughnut model.'
    );
    expect(wrapper.find('[data-testid="course-view"]').text()).toContain('Add the doughnut model.');
    await wrapper.find('[data-testid="view-changes"]').trigger('click');
    expect(wrapper.findAll('[data-testid="approved-text"]').map((p) => p.text())).toContain(
      'Add the doughnut model.'
    );
  });

  it('previews the document it downloads: the syllabus text in order, changes where they go', async () => {
    const { tutor, store } = prepare();
    tutor.documentText = [
      'INTRODUCTION TO MANAGEMENT',
      'This course introduces how organisations are run and how managers decide. '.repeat(4),
      'OBJECTIVES',
      'Explain the basics.',
      'CONTENT',
      'Stratégie',
      'Marketing',
      'ASSESSMENT',
      'Final written exam, two hours.',
      'REFERENCES',
      'Mintzberg, H. (1989). Mintzberg on Management.'
    ].join('\n');
    const wrapper = mount(UpdatedSyllabus);
    expect(wrapper.find('[data-testid="download-complete"]').exists()).toBe(true);
    const doc = wrapper.find('[data-testid="complete-document"]');
    // every original section is there, not only the topics and objectives
    expect(doc.text()).toContain('Final written exam, two hours.');
    expect(doc.text()).toContain('Mintzberg, H. (1989)');
    // the revised objective keeps its original visible, struck through
    expect(doc.find('[data-testid="document-replaced"]').text()).toBe('Explain the basics.');
    // the topic change right after its topic, as in the word document
    const order = doc
      .findAll('[data-testid="document-line"], [data-testid="added-text"]')
      .map((el) => el.text());
    expect(order.indexOf('Add the planetary boundaries.')).toBe(order.indexOf('Stratégie') + 1);
    // the change with no place in the text waits at the end, as in the document
    expect(order[order.length - 1]).toBe('Add a sustainability question.');
    // an edit here is the approved wording everywhere
    const topic = doc.findAll('[data-testid="added"]')[1];
    await topic.find('[data-testid="edit-added"]').trigger('click');
    await topic.find('[data-testid="added-editor"]').setValue('Add the doughnut model.');
    await topic.find('[data-testid="save-added"]').trigger('click');
    expect(store.acceptedChanges.find((c) => c.connectionId === 0)?.text).toBe(
      'Add the doughnut model.'
    );
    expect(wrapper.find('[data-testid="complete-document"]').text()).toContain(
      'Add the doughnut model.'
    );
  });

  it('adds the optional pedagogical appendix to the word export only when asked', async () => {
    prepare();
    const wrapper = mount(UpdatedSyllabus);
    const choice = wrapper.find('[data-testid="appendix-choice"] input');
    expect((choice.element as HTMLInputElement).checked).toBe(false);
    await wrapper.find('[data-testid="download-word"]').trigger('click');
    await flushPromises();
    const plain = vi.mocked(convertMarkdownToDocx).mock.calls.at(-1)?.[0] || '';
    expect(plain).not.toContain('Compare two strategies for their environmental effects.');

    await choice.setValue(true);
    await wrapper.find('[data-testid="download-word"]').trigger('click');
    await flushPromises();
    const withNotes = vi.mocked(convertMarkdownToDocx).mock.calls.at(-1)?.[0] || '';
    // after the syllabus, labelled as optional notes, linked to the change they belong to
    const appendix = withNotes.slice(withNotes.indexOf('## Pedagogical appendix (optional)'));
    expect(appendix).toContain('not learning objectives or assessment requirements');
    expect(appendix).toContain('Add the planetary boundaries.');
    expect(appendix).toContain(
      '- Intended student learning : Compare two strategies for their environmental effects.'
    );
  });

  it('copies the changes and downloads a word document of the updated course', async () => {
    prepare();
    const writeText = vi.fn(async () => undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const wrapper = mount(UpdatedSyllabus);
    // without a verified complete text, the outline download is the one main export
    expect(wrapper.find('.exports [data-testid="download-word"]').exists()).toBe(true);
    // copying sits with the changes, as a secondary action
    expect(wrapper.find('[data-testid="copy-changes"]').exists()).toBe(false);
    await wrapper.find('[data-testid="view-changes"]').trigger('click');
    await wrapper.find('[data-testid="copy-changes"]').trigger('click');
    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining('Add the planetary boundaries.')
    );

    // without the syllabus's text there is no complete version, and the page says so
    expect(wrapper.find('[data-testid="download-complete"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="complete-note"]').text()).toBe(
      'tutor.updated.complete.unavailable'
    );
    await wrapper.find('[data-testid="download-word"]').trigger('click');
    await flushPromises();
    expect(downloadDocx).toHaveBeenCalled();
    const markdown = vi.mocked(convertMarkdownToDocx).mock.calls[0][0];
    expect(markdown).toContain('# Introduction to management');
    expect(markdown).toContain('Explain the basics and their limits.');
    // the optional notes never become part of the syllabus
    expect(markdown).not.toContain('Compare two strategies for their environmental effects.');
    expect(vi.mocked(downloadDocx).mock.calls[0][1]).toMatch(
      /^Introduction-to-management-.*\.docx$/
    );
  });
});

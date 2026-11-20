import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import UpdatedSyllabus from '@/components/tutor/updated/UpdatedSyllabus.vue';
import { exportSyllabus } from '@/utils/syllabusDownload';
import {
  exists,
  proposal,
  seedAccepted,
  seedCourse,
  seedReading,
  text
} from './developmentFixtures';

vi.mock('@/utils/fetch', () => ({ basePostAxios: vi.fn() }));
vi.mock('@/utils/syllabusDownload', () => ({ exportSyllabus: vi.fn() }));

const TOPIC = proposal({ kind: 'topic', original: 'GDP', suggested: 'Add the footprint.' });
const REVISION = proposal({
  kind: 'objective',
  original: 'Use indicators.',
  suggested: 'Use indicators beyond GDP.'
});

describe('UpdatedSyllabus', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.mocked(exportSyllabus).mockReset().mockResolvedValue(true);
    seedCourse().teachingContext.title = 'Macroeconomics';
  });

  it('says when nothing was accepted, with the way back', async () => {
    const course = seedCourse();
    seedReading();
    course.step = 4;
    const wrapper = mount(UpdatedSyllabus);
    expect(exists(wrapper, 'no-changes')).toBe(true);
    expect(exists(wrapper, 'download-word')).toBe(false);
    await wrapper.find('[data-testid="empty-back"]').trigger('click');
    expect(course.step).toBe(3);
  });

  it('shows the complete syllabus when its whole text was read: the document they download', () => {
    seedReading();
    seedAccepted(TOPIC, REVISION);
    const wrapper = mount(UpdatedSyllabus);
    expect(text(wrapper, 'updated-count')).toContain('Macroeconomics');
    expect(text(wrapper, 'outline-note')).toBe('tutor.updated.outlineNoteComplete');
    expect(exists(wrapper, 'complete-document')).toBe(true);
    expect(text(wrapper, 'document-replaced')).toBe('Use indicators.');
    expect(exists(wrapper, 'download-complete')).toBe(true);
  });

  it('shows the confirmed outline otherwise, and an edit there changes the change', async () => {
    const store = seedAccepted(TOPIC);
    const wrapper = mount(UpdatedSyllabus);
    expect(text(wrapper, 'outline-note')).toBe('tutor.updated.outlineNote');
    expect(exists(wrapper, 'updated-outline')).toBe(true);

    await wrapper.find('[data-testid="edit-added"]').trigger('click');
    await wrapper.find('textarea').setValue('My wording.');
    await wrapper.find('[data-testid="save-change"]').trigger('click');
    expect(store.acceptedChanges[0].text).toBe('My wording.');
  });

  it('lists the changes alone, to copy, with the outline download next to them', async () => {
    seedReading();
    seedAccepted(TOPIC);
    const wrapper = mount(UpdatedSyllabus);
    await wrapper.find('[data-testid="view-changes"]').trigger('click');
    expect(exists(wrapper, 'changes')).toBe(true);
    expect(exists(wrapper, 'copy-changes')).toBe(true);

    await wrapper.find('[data-testid="download-outline"]').trigger('click');
    await flushPromises();
    expect(vi.mocked(exportSyllabus).mock.calls[0][0].fileName).toBe(
      'Macroeconomics-mis-a-jour.docx'
    );
  });

  it('downloads the word document from the export bar', async () => {
    seedReading();
    seedAccepted(TOPIC);
    const wrapper = mount(UpdatedSyllabus);
    await wrapper.find('[data-testid="download-complete"]').trigger('click');
    await flushPromises();
    expect(vi.mocked(exportSyllabus).mock.calls[0][0].fileName).toBe(
      'Macroeconomics-complet-mis-a-jour.docx'
    );
  });
});

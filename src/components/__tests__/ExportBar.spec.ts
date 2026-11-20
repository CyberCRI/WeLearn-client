import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ExportBar from '@/components/tutor/updated/ExportBar.vue';
import { exists, text } from '@/__tests__/coursePathFixtures';

const props = {
  isCompleteReady: true,
  toPlaceCount: 0,
  hasNotes: false,
  isExporting: false,
  hasExportError: false
};

describe('ExportBar', () => {
  it('downloads the complete syllabus when it is ready, the outline otherwise', async () => {
    const wrapper = mount(ExportBar, { props });
    expect(text(wrapper, 'complete-note')).toBe('tutor.updated.complete.layoutNote');
    await wrapper.find('[data-testid="download-complete"]').trigger('click');

    await wrapper.setProps({ isCompleteReady: false });
    expect(text(wrapper, 'complete-note')).toBe('tutor.updated.complete.unavailable');
    await wrapper.find('[data-testid="download-word"]').trigger('click');
    expect(wrapper.emitted('download')).toEqual([
      ['complete', false],
      ['outline', false]
    ]);
  });

  it('offers the appendix only when a change has notes, off until ticked', async () => {
    const wrapper = mount(ExportBar, { props });
    expect(exists(wrapper, 'appendix-choice')).toBe(false);

    await wrapper.setProps({ hasNotes: true });
    await wrapper.find('#pedagogical-appendix').setValue(true);
    await wrapper.find('[data-testid="download-complete"]').trigger('click');
    expect(wrapper.emitted('download')).toEqual([['complete', true]]);
  });

  it('says when the document could not be made', () => {
    const wrapper = mount(ExportBar, { props: { ...props, hasExportError: true } });
    expect(text(wrapper, 'export-error')).toBe('tutor.updated.downloadError');
  });
});

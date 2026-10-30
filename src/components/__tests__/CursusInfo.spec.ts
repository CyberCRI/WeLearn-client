import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CursusInfo from '@/components/tutor/CursusInfo.vue';

const syllabus = new File(['a'], 'syllabus.pdf', { type: 'application/pdf' });

const mountInfo = (props: Record<string, unknown> = {}) =>
  mount(CursusInfo, {
    props: {
      file: null,
      fileError: { state: false, reason: null },
      setFile: vi.fn(),
      removeFile: vi.fn(),
      storedLanguage: 'fr',
      selectLang: vi.fn(),
      action: vi.fn(),
      ...props
    }
  });

const pick = async (wrapper: ReturnType<typeof mountInfo>, files: File[]) => {
  const input = wrapper.find('[data-testid="file-input"]');
  Object.defineProperty(input.element, 'files', { value: files, configurable: true });
  await input.trigger('change');
  return input;
};

describe('CursusInfo (screen "Your course")', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('takes one syllabus file and clears the input so it can be picked again', async () => {
    const wrapper = mountInfo();
    const input = await pick(wrapper, [syllabus]);
    expect(wrapper.props('setFile')).toHaveBeenCalledWith(syllabus);
    expect((input.element as HTMLInputElement).value).toBe('');
    expect(input.attributes('multiple')).toBeUndefined();
  });

  it('takes a dropped file', async () => {
    const wrapper = mountInfo();
    await wrapper.find('.dropzone').trigger('drop', { dataTransfer: { files: [syllabus] } });
    expect(wrapper.props('setFile')).toHaveBeenCalledWith(syllabus);
  });

  it('highlights the drop zone while a file is dragged over it', async () => {
    const wrapper = mountInfo();
    const zone = wrapper.find('.dropzone');
    await zone.trigger('dragover');
    expect(zone.classes()).toContain('dragging');
    await zone.trigger('dragleave');
    expect(zone.classes()).not.toContain('dragging');
  });

  it('shows the chosen file, which can be removed', async () => {
    const wrapper = mountInfo({ file: syllabus });
    expect(wrapper.find('[data-testid="file"]').text()).toContain('syllabus.pdf');
    await wrapper.find('[data-testid="file"] .delete').trigger('click');
    expect(wrapper.props('removeFile')).toHaveBeenCalled();
  });

  it('shows why a file was refused', () => {
    const wrapper = mountInfo({ fileError: { state: true, reason: 'BIG_FILE' } });
    expect(wrapper.find('[data-testid="file-error"]').text()).toBe('tutor.BIG_FILE');
  });

  it('continues only once a syllabus is added', async () => {
    const empty = mountInfo();
    expect(empty.find('[data-testid="tutor-next-button"]').attributes('disabled')).toBeDefined();
    const ready = mountInfo({ file: syllabus });
    await ready.find('[data-testid="tutor-next-button"]').trigger('click');
    expect(ready.props('action')).toHaveBeenCalled();
  });

  it('changes the course language', async () => {
    const wrapper = mountInfo();
    await wrapper.find('#course-lang').setValue('en');
    expect(wrapper.props('selectLang')).toHaveBeenCalledWith('en');
  });

  it('says the syllabus is sent to WeLearn for AI analysis', () => {
    const wrapper = mountInfo();
    expect(wrapper.find('[data-testid="ai-notice"]').text()).toBe('tutor.course.aiNotice');
  });
});

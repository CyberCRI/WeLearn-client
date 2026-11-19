import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import CourseUpload from '@/components/tutor/CourseUpload.vue';

const mountUpload = (props: Record<string, unknown> = {}) => {
  const handlers = {
    setFile: vi.fn(),
    removeFile: vi.fn(),
    selectLanguage: vi.fn(),
    action: vi.fn()
  };
  const wrapper = mount(CourseUpload, {
    props: {
      file: null,
      fileError: null,
      language: 'fr',
      readError: null,
      ...handlers,
      ...props
    }
  });
  return { wrapper, ...handlers };
};

const pdf = new File(['x'], 'syllabus.pdf', { type: 'application/pdf' });

describe('CourseUpload', () => {
  it('asks for one syllabus file, and only continues with one', () => {
    const { wrapper } = mountUpload();
    expect(wrapper.find('h1').text()).toBe('tutor.course.title');
    const input = wrapper.find('[data-testid="course-file-input"]');
    expect(input.attributes('multiple')).toBeUndefined();
    expect(wrapper.find('[data-testid="read-course-button"]').attributes('disabled')).toBeDefined();
    expect(wrapper.text()).toContain('tutor.course.noFile');
    expect(wrapper.find('[data-testid="ai-notice"]').text()).toBe('tutor.course.aiNotice');
  });

  it('takes the picked or dropped file', async () => {
    const { wrapper, setFile } = mountUpload();
    const input = wrapper.find('[data-testid="course-file-input"]');
    Object.defineProperty(input.element, 'files', { value: [pdf] });
    await input.trigger('change');
    await wrapper.find('.dropzone').trigger('drop', { dataTransfer: { files: [pdf] } });
    expect(setFile).toHaveBeenNthCalledWith(1, pdf);
    expect(setFile).toHaveBeenNthCalledWith(2, pdf);
  });

  it('shows the file, can remove it, and reads it', async () => {
    const { wrapper, removeFile, action } = mountUpload({ file: pdf });
    expect(wrapper.find('[data-testid="course-file"]').text()).toContain('syllabus.pdf');
    await wrapper.find('[data-testid="course-file"] .delete').trigger('click');
    expect(removeFile).toHaveBeenCalled();
    await wrapper.find('[data-testid="read-course-button"]').trigger('click');
    expect(action).toHaveBeenCalled();
  });

  it('lets the teacher pick the language WeLearn answers in', async () => {
    const { wrapper, selectLanguage } = mountUpload();
    await wrapper.find('[data-testid="course-lang"]').setValue('en');
    expect(selectLanguage).toHaveBeenCalledWith('en');
  });

  it('tells a refused file and a reading that failed', () => {
    const { wrapper } = mountUpload({ fileError: 'BIG_FILE', readError: 'emptyText' });
    expect(wrapper.find('[data-testid="course-file-error"]').text()).toBe('tutor.BIG_FILE');
    expect(wrapper.find('[data-testid="read-error"]').text()).toContain(
      'tutor.reading.emptyText.title'
    );
  });
});

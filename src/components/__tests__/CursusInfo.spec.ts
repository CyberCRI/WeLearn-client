import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CursusInfo from '@/components/tutor/CursusInfo.vue';

const originalScrollIntoView = Element.prototype.scrollIntoView;

const mountInfo = (props: Record<string, unknown> = {}) =>
  mount(CursusInfo, {
    attachTo: document.body,
    props: {
      files: { 'a.pdf': new File(['a'], 'a.pdf', { type: 'application/pdf' }) },
      addFiles: vi.fn(),
      removeFile: vi.fn(),
      fileError: { state: false, reason: null },
      courseTitle: '',
      level: '',
      duration: '',
      description: '',
      action: vi.fn(),
      storedLanguage: 'fr',
      selectLang: vi.fn(),
      ...props
    }
  });

describe('CursusInfo', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    Element.prototype.scrollIntoView = originalScrollIntoView;
    document.body.innerHTML = '';
  });

  it('adds the picked files and clears the input so the same file can be picked again', async () => {
    const wrapper = mountInfo();
    const input = wrapper.find('[data-testid="file-input"]');
    const file = new File(['b'], 'b.pdf', { type: 'application/pdf' });
    Object.defineProperty(input.element, 'files', { value: [file], configurable: true });
    await input.trigger('change');
    expect(wrapper.props('addFiles')).toHaveBeenCalledWith([file]);
    expect((input.element as HTMLInputElement).value).toBe('');
  });

  it('highlights the dropzone while dragging and adds the dropped files', async () => {
    const wrapper = mountInfo();
    const dropzone = wrapper.find('.dropzone');
    await dropzone.trigger('dragover');
    expect(dropzone.classes()).toContain('dragging');
    await dropzone.trigger('dragleave');
    expect(dropzone.classes()).not.toContain('dragging');

    await dropzone.trigger('dragover');
    const file = new File(['c'], 'c.txt', { type: 'text/plain' });
    await dropzone.trigger('drop', { dataTransfer: { files: [file] } });
    expect(dropzone.classes()).not.toContain('dragging');
    expect(wrapper.props('addFiles')).toHaveBeenCalledWith([file]);
  });

  it('removes a file from the list', async () => {
    const wrapper = mountInfo();
    await wrapper.find('[data-testid="file-list"] button').trigger('click');
    expect(wrapper.props('removeFile')).toHaveBeenCalledWith('a.pdf');
  });

  it('selects the syllabus language', async () => {
    const wrapper = mountInfo();
    await wrapper.find('#cursus-lang').setValue('en');
    expect(wrapper.props('selectLang')).toHaveBeenCalledWith('en');
  });

  it('emits the course details as they are typed', async () => {
    const wrapper = mountInfo();
    await wrapper.find('#cursus-title').setValue('Ecology');
    await wrapper.find('#cursus-level').setValue('Master');
    await wrapper.find('#cursus-duration').setValue('10h');
    await wrapper.find('#cursus-description').setValue('About soils');
    expect(wrapper.emitted('update:courseTitle')).toEqual([['Ecology']]);
    expect(wrapper.emitted('update:level')).toEqual([['Master']]);
    expect(wrapper.emitted('update:duration')).toEqual([['10h']]);
    expect(wrapper.emitted('update:description')).toEqual([['About soils']]);
  });

  it('continues right away when course details are filled', async () => {
    const wrapper = mountInfo({ courseTitle: 'Ecology' });
    await wrapper.find('[data-testid="tutor-next-button"]').trigger('click');
    expect(wrapper.props('action')).toHaveBeenCalledTimes(1);
    expect(wrapper.find('.nudge').exists()).toBe(false);
  });

  it('nudges once without details, then continues anyway', async () => {
    const wrapper = mountInfo();
    await wrapper.find('[data-testid="tutor-next-button"]').trigger('click');
    const nudge = wrapper.find('.nudge');
    expect(nudge.exists()).toBe(true);
    expect(wrapper.props('action')).not.toHaveBeenCalled();
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center'
    });

    await nudge.find('.is-text').trigger('click');
    expect(wrapper.props('action')).toHaveBeenCalledTimes(1);
    expect(wrapper.find('.nudge').exists()).toBe(false);
  });

  it('takes the user to the course title from the nudge', async () => {
    const wrapper = mountInfo();
    await wrapper.find('[data-testid="tutor-next-button"]').trigger('click');
    await wrapper.find('.nudge .button:not(.is-text)').trigger('click');
    expect(wrapper.find('.nudge').exists()).toBe(false);
    expect(document.activeElement).toBe(wrapper.find('#cursus-title').element);
    expect(wrapper.props('action')).not.toHaveBeenCalled();
  });
});

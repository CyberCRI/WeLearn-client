import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FileDropzone from '@/components/tutor/FileDropzone.vue';

const pdf = new File(['x'], 'a.pdf', { type: 'application/pdf' });
const txt = new File(['y'], 'b.txt', { type: 'text/plain' });

describe('FileDropzone', () => {
  it('shows the texts of its path, one file by default', () => {
    const wrapper = mount(FileDropzone, { props: { label: 'Drop here', limits: 'One file' } });
    expect(wrapper.text()).toContain('Drop here');
    expect(wrapper.text()).toContain('One file');
    const input = wrapper.find('[data-testid="file-input"]');
    expect(input.attributes('multiple')).toBeUndefined();
    expect(input.attributes('accept')).toContain('application/pdf');
  });

  it('takes several files when asked, under its own test id', () => {
    const wrapper = mount(FileDropzone, {
      props: { label: 'l', limits: 'm', multiple: true, inputTestId: 'materials' }
    });
    expect(wrapper.find('[data-testid="materials"]').attributes('multiple')).toBeDefined();
  });

  it('gives the picked files, and lets the same file be picked again', async () => {
    const wrapper = mount(FileDropzone, { props: { label: 'l', limits: 'm' } });
    const input = wrapper.find('input');
    Object.defineProperty(input.element, 'files', { value: [pdf, txt] });
    await input.trigger('change');
    expect(wrapper.emitted('pick')).toEqual([[[pdf, txt]]]);
    expect((input.element as HTMLInputElement).value).toBe('');
  });

  it('gives the dropped files and shows the drag', async () => {
    const wrapper = mount(FileDropzone, { props: { label: 'l', limits: 'm' } });
    const zone = wrapper.find('.dropzone');
    await zone.trigger('dragover');
    expect(zone.classes()).toContain('dragging');
    await zone.trigger('dragleave');
    expect(zone.classes()).not.toContain('dragging');
    await zone.trigger('drop', { dataTransfer: { files: [pdf] } });
    expect(wrapper.emitted('pick')).toEqual([[[pdf]]]);
  });

  it('ignores an empty pick or drop', async () => {
    const wrapper = mount(FileDropzone, { props: { label: 'l', limits: 'm' } });
    const input = wrapper.find('input');
    Object.defineProperty(input.element, 'files', { value: [] });
    await input.trigger('change');
    await wrapper.find('.dropzone').trigger('drop', { dataTransfer: { files: [] } });
    expect(wrapper.emitted('pick')).toBeUndefined();
  });
});

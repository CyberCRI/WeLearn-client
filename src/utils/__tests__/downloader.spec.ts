import { afterEach, describe, expect, it, vi } from 'vitest';
// @ts-ignore
import saveAs from 'file-saver';
import { downloadDocx } from '../md-to-docx/downloader';

vi.mock('file-saver', () => ({
  default: vi.fn()
}));

describe('downloadDocx', () => {
  const blob = new Blob(['content']);

  afterEach(() => {
    vi.mocked(saveAs).mockReset();
    vi.restoreAllMocks();
  });

  it('saves the blob with the given filename', () => {
    downloadDocx(blob, 'syllabus.docx');

    expect(saveAs).toHaveBeenCalledWith(blob, 'syllabus.docx');
  });

  it('uses a default filename', () => {
    downloadDocx(blob);

    expect(saveAs).toHaveBeenCalledWith(blob, 'document.docx');
  });

  it('rejects something that is not a blob', () => {
    expect(() => downloadDocx('not a blob' as unknown as Blob)).toThrow('Invalid blob provided');
  });

  it('rejects an empty filename', () => {
    expect(() => downloadDocx(blob, '')).toThrow('Invalid filename provided');
  });

  it('wraps an error thrown while saving', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(saveAs).mockImplementation(() => {
      throw new Error('disk full');
    });

    expect(() => downloadDocx(blob)).toThrow('Failed to save file: disk full');
  });
});

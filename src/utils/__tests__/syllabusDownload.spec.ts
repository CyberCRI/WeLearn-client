import { beforeEach, describe, expect, it, vi } from 'vitest';
import { saveSyllabusFile } from '@/utils/syllabusDownload';
import { downloadDocx } from '@/utils/md-to-docx';
import { basePostAxios } from '@/utils/fetch';
import { track } from '@/utils/analytics';

vi.mock('@/utils/md-to-docx', () => ({ downloadDocx: vi.fn() }));
vi.mock('@/utils/fetch', () => ({ basePostAxios: vi.fn() }));
vi.mock('@/utils/analytics', () => ({ track: vi.fn() }));

describe('saveSyllabusFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('saves the file under its name, then counts the download', async () => {
    const blob = new Blob(['docx']);
    expect(await saveSyllabusFile(async () => blob, 'Course-updated.docx')).toBe(true);
    expect(downloadDocx).toHaveBeenCalledWith(blob, 'Course-updated.docx');
    expect(track).toHaveBeenCalledWith('Syllabus Downloaded', {});
    expect(basePostAxios).toHaveBeenCalledWith('/metric/syllabus_downloaded');
  });

  it('counts nothing when the file could not be made', async () => {
    const isSaved = await saveSyllabusFile(() => Promise.reject(new Error('docx')), 'a.docx');
    expect(isSaved).toBe(false);
    expect(downloadDocx).not.toHaveBeenCalled();
    expect(track).not.toHaveBeenCalled();
    expect(basePostAxios).not.toHaveBeenCalled();
  });

  it('still saves the file when the count fails', async () => {
    vi.mocked(basePostAxios).mockRejectedValueOnce(new Error('network'));
    expect(await saveSyllabusFile(async () => new Blob(['docx']), 'a.docx')).toBe(true);
    expect(downloadDocx).toHaveBeenCalledOnce();
  });
});

import { describe, it, expect } from 'vitest';
import { MAX_COURSE_FILE_SIZE, courseFileError, isCourseFileType } from '@/utils/courseFiles';

const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const file = (name: string, type: string, size = 10) =>
  new File([new Uint8Array(size)], name, { type });

describe('courseFiles', () => {
  it('takes pdf, plain text and word by their type', () => {
    expect(isCourseFileType(file('a.pdf', 'application/pdf'))).toBe(true);
    expect(isCourseFileType(file('a.txt', 'text/plain'))).toBe(true);
    expect(isCourseFileType(file('a.docx', DOCX))).toBe(true);
    expect(isCourseFileType(file('a.csv', 'text/csv'))).toBe(false);
  });

  it('falls back on the extension when the type is empty or generic', () => {
    expect(isCourseFileType(file('a.docx', ''))).toBe(true);
    expect(isCourseFileType(file('A.PDF', 'application/octet-stream'))).toBe(true);
    expect(isCourseFileType(file('a.zip', ''))).toBe(false);
    expect(isCourseFileType(file('docx', ''))).toBe(false);
    // a known other type is refused whatever the name
    expect(isCourseFileType(file('a.docx', 'application/zip'))).toBe(false);
  });

  it('says why a file is refused', () => {
    expect(courseFileError(file('a.pdf', 'application/pdf'))).toBeNull();
    expect(courseFileError(file('a.pdf', 'application/pdf', 0))).toBe('EMPTY_FILE');
    expect(courseFileError(file('a.pdf', 'application/pdf', MAX_COURSE_FILE_SIZE + 1))).toBe(
      'BIG_FILE'
    );
    expect(courseFileError(file('a.png', 'image/png', 0))).toBe('BAD_EXTENSION');
  });
});

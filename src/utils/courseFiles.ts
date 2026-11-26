import type { FileErrorReason } from '@/types';

// the course files WeLearn reads, the same for both paths: the types the API extracts text
// from (pdf, plain text, word) and the size it accepts
export const COURSE_FILE_TYPES = [
  'application/pdf',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
export const COURSE_FILE_EXTENSIONS = ['.pdf', '.txt', '.docx'];
export const MAX_COURSE_FILE_SIZE = 5 * 1024 * 1024;

// some systems give a .docx no type, or a generic binary one: the extension decides then
const UNKNOWN_TYPES = ['', 'application/octet-stream'];

export const isCourseFileType = (file: File) => {
  if (COURSE_FILE_TYPES.includes(file.type)) return true;
  const name = file.name.toLowerCase();
  return (
    UNKNOWN_TYPES.includes(file.type) && COURSE_FILE_EXTENSIONS.some((ext) => name.endsWith(ext))
  );
};

// why a picked file can't be read, or null when it can
export const courseFileError = (file: File): FileErrorReason | null => {
  if (file.size > MAX_COURSE_FILE_SIZE) return 'BIG_FILE';
  if (!isCourseFileType(file)) return 'BAD_EXTENSION';
  if (file.size === 0) return 'EMPTY_FILE';
  return null;
};

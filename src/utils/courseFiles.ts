// the course files WeLearn reads, the same for both paths: the types the API extracts text
// from (pdf, plain text, word) and the size it accepts
export const COURSE_FILE_TYPES = [
  'application/pdf',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
export const MAX_COURSE_FILE_SIZE = 5 * 1024 * 1024;

export const isCourseFileType = (file: File) => COURSE_FILE_TYPES.includes(file.type);

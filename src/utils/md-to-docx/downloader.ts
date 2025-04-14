// @ts-ignore
import saveAs from 'file-saver';

export function downloadDocx(blob: Blob, filename: string = 'document.docx'): void {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be used in browser environments');
  }
  if (!(blob instanceof Blob)) {
    throw new Error('Invalid blob provided');
  }
  if (!filename || typeof filename !== 'string') {
    throw new Error('Invalid filename provided');
  }
  try {
    saveAs(blob, filename);
  } catch (error) {
    console.error('Failed to save file:', error);
    throw new Error(
      `Failed to save file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

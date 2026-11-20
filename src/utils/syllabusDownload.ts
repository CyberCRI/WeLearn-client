import { downloadDocx } from '@/utils/md-to-docx';
import { basePostAxios } from '@/utils/fetch';
import { track } from '@/utils/analytics';

// saves a syllabus word file and counts the download, the same way for every path. resolves false
// when the file could not be made; a failed count is only logged
export const saveSyllabusFile = async (
  makeFile: () => Promise<Blob>,
  fileName: string
): Promise<boolean> => {
  try {
    downloadDocx(await makeFile(), fileName);
  } catch (error) {
    console.error('Error during syllabus download:', error);
    return false;
  }
  track('Syllabus Downloaded', {});
  try {
    await basePostAxios('/metric/syllabus_downloaded');
  } catch (error) {
    console.error('Error during metrics update:', error);
  }
  return true;
};

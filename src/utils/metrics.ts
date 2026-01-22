import { postAxios } from '@/utils/fetch';

export const updateClickedDocument = async (
  doc_id: string,
  message_id: string
): Promise<string> => {
  if (!doc_id) {
    throw new Error('Document ID is required');
  }

  if (!message_id) {
    throw new Error('Message ID is required');
  }

  const body = {
    doc_id: doc_id.trim(),
    message_id: message_id.trim()
  };

  const res = await postAxios('/metric/clicked_document', body);
  return res.data;
};

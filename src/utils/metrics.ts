import { basePostAxios } from '@/utils/fetch';

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

  const res = await basePostAxios('/metric/clicked_document', body);
  return res.data;
};

export function addTheConversationTrackerScript(externalId: string): void {
  const tracker = document.createElement('script');
  tracker.type = 'text/javascript';
  tracker.src = 'https://theconversation.com/javascripts/lib/content_tracker_hook.js';

  tracker.id = 'theconversation_tracker_hook';

  tracker.dataset.counter = `https://counter.theconversation.com/content/${externalId}/count`;

  tracker.async = true;

  tracker.addEventListener('load', () => tracker.remove(), { once: true });
  tracker.addEventListener('error', () => tracker.remove(), { once: true });

  document.body.appendChild(tracker);
}

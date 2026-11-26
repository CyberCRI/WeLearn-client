import { updateClickedDocument } from '@/utils/metrics';
import { isInPage } from '@/utils/urlsUtils';
import { track } from '@/utils/analytics';
import type { SourceOrigin } from '@/types';
import { defineStore } from 'pinia';
import { useChatStore } from '@/stores/chat';
import { useSearchStore } from '@/stores/search';

const PAGE_TO_ORIGIN: [string, SourceOrigin][] = [
  ['q-and-a', 'chat'],
  ['tutor', 'tutor'],
  ['search', 'search'],
  ['bookmarks', 'bookmarks']
];

export const useMetricsStore = defineStore('metrics', () => {
  // implement and move this to a utils file this does not use any state from the store and is only a wrapper around the updateClickedDocument util function
  const getCampaignStatus = async () => {
    // Logic to get campaign status
    return await true;
  };

  // move this to a utils file this does not use any state from the store and is only a wrapper around the updateClickedDocument util function
  const recordClickedDocumentFromchat = async (docId: string) => {
    const origin = PAGE_TO_ORIGIN.find(([page]) => isInPage(page))?.[1] ?? 'other';
    track('Source Opened', { origin });

    // check if in campaign
    if (!(await getCampaignStatus())) {
      return;
    }

    // the answer or the search the clicked source came from, known only until a reload
    let messageId: string | null = null;
    if (isInPage('q-and-a')) {
      messageId = useChatStore().lastMessageId;
    } else if (isInPage('search')) {
      messageId = useSearchStore().lastMessageId;
    }
    if (!messageId || !docId) {
      return;
    }

    // Logic to add clicked document
    await updateClickedDocument(docId, messageId);
  };

  return {
    recordClickedDocumentFromchat
  };
});

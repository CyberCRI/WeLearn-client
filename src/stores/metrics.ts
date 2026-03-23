import { updateClickedDocument } from '@/utils/metrics';
import { isInPage } from '@/utils/urlsUtils';
import { defineStore } from 'pinia';

export const useMetricsStore = defineStore('metrics', () => {
  // implement and move this to a utils file this does not use any state from the store and is only a wrapper around the updateClickedDocument util function
  const getCampaignStatus = async () => {
    // Logic to get campaign status
    return await true;
  };

  // move this to a utils file this does not use any state from the store and is only a wrapper around the updateClickedDocument util function
  const recordClickedDocumentFromchat = async (docId: string) => {
    // check if in campaign
    if (await !getCampaignStatus()) {
      return;
    }

    let storageKey;

    if (isInPage('q-and-a')) {
      storageKey = 'chatMessageId';
    }
    if (isInPage('tutor')) {
      storageKey = 'tutorMessageId';
    }
    if (isInPage('search')) {
      storageKey = 'searchMessageId';
    }

    if (!storageKey) {
      return;
    }

    // get message id from storage
    const messageId = localStorage.getItem(storageKey);
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

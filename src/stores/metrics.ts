import { updateClickedDocument } from '@/utils/metrics';
import { isInPage } from '@/utils/urlsUtils';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMetricsStore = defineStore('metrics', () => {
  const userId = ref<string | null>(localStorage.getItem('userId'));

  const getUserId = computed(() => userId.value);
  const getWorkshopFormUrl = computed(() => {
    return `https://docs.google.com/forms/d/e/1FAIpQLSeUf3GQXt3LsZD24Z3fGkwUE-qhAXF2jkem9zbPnAbnOrReDQ/viewform?usp=pp_url&entry.736499817=${userId.value}`;
  });

  const getCampaignStatus = async () => {
    // Logic to get campaign status
    return await true;
  };

  const recordClickedDocumentFromchat = async (docId: string) => {
    // check if in campaign
    if (await !getCampaignStatus()) {
      return;
    }

    if (!isInPage('q-and-a')) {
      return;
    }
    // get message id from storage
    const messageId = localStorage.getItem('chatMessageId');

    if (!messageId || !docId) {
      return;
    }

    // Logic to add clicked document
    await updateClickedDocument(docId, messageId);
  };

  return {
    getUserId,
    recordClickedDocumentFromchat,
    getWorkshopFormUrl
  };
});

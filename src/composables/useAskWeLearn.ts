import { useRouter } from 'vue-router';
import { useChatStore } from '@/stores/chat';
import { useFiltersStore } from '@/stores/filters';

// opens the existing chat with a question ready in its input box (not sent: the teacher can
// adjust it, then send); used by the teacher space's fast lane and "Ask WeLearn" panels
export const useAskWeLearn = () => {
  const router = useRouter();
  const chatStore = useChatStore();
  const filtersStore = useFiltersStore();

  const askWeLearn = (question: string) => {
    // the filters are shared with search (an explore lens may have set them): answer from the whole library
    filtersStore.sourcesFilters = [];
    chatStore.chatInput = question;
    router.push({ name: 'q-and-a' });
  };

  return { askWeLearn };
};

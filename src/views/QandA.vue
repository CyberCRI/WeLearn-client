<script setup lang="ts">
import { computed } from 'vue';
import ColumnTemplate from '@/components/ColumnTemplate.vue';
import { useChatStore, CHAT_STATUS } from '@/stores/chat';
import ChatComponent from '@/components/ChatComponent.vue';
import SourcesListComponentVue from '@/components/SourcesListComponent.vue';
import ReformulatedQuery from '@/components/ReformulatedQuery.vue';
import ErrorComponent from '@/components/ErrorComponent.vue';
import StepsDescription from '@/components/StepsDescription.vue';

const chatstore = useChatStore();
const computedStatus = computed(() => chatstore.chatStatus);
const descriptions: Record<CHAT_STATUS, string> = {
  [CHAT_STATUS.SEARCHING]: 'sourcesList.fetching',
  [CHAT_STATUS.FORMULATING_ANSWER]: 'sourcesList.formulatingAnswer',
  [CHAT_STATUS.NO_RESULTS]: 'noResults'
};
</script>
<template>
  <ErrorComponent v-if="chatstore.hasError" />
  <ColumnTemplate>
    <template #left-panel>
      <ChatComponent />
    </template>
    <template #rigth-panel>
      <ReformulatedQuery v-if="chatstore.reformulatedQuery" :query="chatstore.reformulatedQuery" />
      <StepsDescription
        v-if="computedStatus !== CHAT_STATUS.DONE"
        :stepDescription="descriptions[computedStatus] || '...'"
      />
      <SourcesListComponentVue
        hideSteps
        v-if="chatstore.sourcesList.length"
        cardType="simple"
        :shouldDisplayScore="!!chatstore.shouldDisplayScore"
        :sourcesList="
          [CHAT_STATUS.DONE, CHAT_STATUS.FORMULATING_ANSWER].includes(computedStatus) &&
          chatstore.sourcesList.slice(0, 7)
        "
        :isSourcesError="computedStatus === CHAT_STATUS.ERROR"
        :isFetchingSources="computedStatus === CHAT_STATUS.SEARCHING"
        :fetchingAnswer="computedStatus === CHAT_STATUS.FORMULATING_ANSWER"
        :noResults="computedStatus === CHAT_STATUS.NO_RESULTS"
        errorCode="UNKNOWN_ERROR"
      />
      <details v-if="computedStatus === CHAT_STATUS.DONE && chatstore.sourcesList.length > 7">
        <summary>{{ $t('moreDocuments') }} ({{ chatstore.sourcesList.length - 7 }})</summary>
        <SourcesListComponentVue
          cardType="simple"
          hideNumber
          :shouldDisplayScore="!!chatstore.shouldDisplayScore"
          :sourcesList="chatstore.sourcesList.slice(7)"
          :isSourcesError="computedStatus === CHAT_STATUS.ERROR"
          :isFetchingSources="computedStatus === CHAT_STATUS.SEARCHING"
          :fetchingAnswer="computedStatus === CHAT_STATUS.FORMULATING_ANSWER"
          errorCode="UNKNOWN_ERROR"
        />
      </details>
    </template>
  </ColumnTemplate>
</template>

<style scoped>
details {
  margin-top: 1rem;
  cursor: pointer;
  summary {
    padding: 0.5rem;
  }
  div {
    padding-left: 1.25rem;
    paddign-top: 0.5rem;
  }

  &:hover {
    summary {
      background-color: var(--neutral-10);
    }
  }
}
</style>

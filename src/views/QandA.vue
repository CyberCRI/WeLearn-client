<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';
import ColumnTemplate from '@/components/ColumnTemplate.vue';
import { useChatStore, CHAT_STATUS } from '@/stores/chat';
import ChatComponent from '@/components/ChatComponent.vue';
import SourcesListComponentVue from '@/components/SourcesListComponent.vue';
import ReformulatedQuery from '@/components/ReformulatedQuery.vue';
import FiltersComponent from '@/components/FiltersComponent.vue';
import ChevronDownIcon from '@/components/icons/ChevronDown.vue';

const chatstore = useChatStore();
const computedStatus = computed(() => chatstore.chatStatus);

onBeforeMount(() => {
  chatstore.initializeChat();
});
</script>
<template>
  <ColumnTemplate>
    <template #left-panel>
      <ChatComponent />
    </template>
    <template #right-panel>
      <FiltersComponent :shouldClose="computedStatus === CHAT_STATUS.FORMULATING_ANSWER" />
      <ReformulatedQuery v-if="chatstore.reformulatedQuery" :query="chatstore.reformulatedQuery" />
      <SourcesListComponentVue
        cardType="simple"
        :exportList="chatstore.sourcesList"
        :shouldDisplayScore="!!chatstore.shouldDisplayScore"
        :sourcesList="
          [
            CHAT_STATUS.DONE,
            CHAT_STATUS.FORMULATING_ANSWER,
            CHAT_STATUS.FORMULATED_ANSWER
          ].includes(computedStatus)
            ? chatstore.sourcesList.slice(0, 7)
            : []
        "
        :isSourcesError="computedStatus === CHAT_STATUS.ERROR"
        :isFetchingSources="computedStatus === CHAT_STATUS.SEARCHING"
        :fetchingAnswer="computedStatus === CHAT_STATUS.FORMULATING_ANSWER"
        :noResults="computedStatus === CHAT_STATUS.NO_RESULTS"
        errorCode="UNKNOWN_ERROR"
      />
      <details
        open
        class="more-sources"
        v-if="computedStatus === CHAT_STATUS.DONE && chatstore.sourcesList.length > 7"
      >
        <summary>
          <span>
            {{ $t('moreDocuments') }}
            <span class="count">{{ chatstore.sourcesList.length - 7 }}</span>
          </span>
          <ChevronDownIcon class="summary-chevron" />
        </summary>
        <SourcesListComponentVue
          cardType="simple"
          hideNumber
          hideExport
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
/* same look as the filter sections: a light row with a count and a chevron */
.more-sources {
  margin-top: 0.5rem;
  border-top: 1px solid var(--neutral-15);
}
.more-sources summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 0.5rem;
  list-style: none;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--neutral-90);
  cursor: pointer;
  border-radius: 0.375rem;
  &::-webkit-details-marker {
    display: none;
  }
  &:hover {
    background-color: var(--neutral-10);
  }
  &:focus-visible {
    outline: 2px solid var(--primary-dark);
    outline-offset: -2px;
  }
}
.count {
  margin-left: 0.25rem;
  padding: 0.0625rem 0.4rem;
  border-radius: 999px;
  background-color: var(--neutral-10);
  color: var(--neutral-70);
  font-size: 0.75rem;
  font-weight: 500;
}
.summary-chevron {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--neutral-70);
  transition: transform 0.2s;
}
.more-sources[open] .summary-chevron {
  transform: rotate(180deg);
}
</style>

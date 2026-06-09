<script setup lang="ts">
import { marked } from 'marked';
import { useActivityStore } from '@/stores/activityGenerator';
import SourcesListComponent from '@/components/SourcesListComponent.vue';
import AssistantAvatar from '@/components/AssistantAvatar.vue';

const store = useActivityStore();
</script>

<template>
  <div class="result-wrapper">
    <div v-if="store.isGenerating && store.generatingPhase === 1" class="status-row">
      <AssistantAvatar />
      <span class="status-text status-pulse">{{ $t('activity.generatingStatus1') }}</span>
    </div>

    <div v-if="store.isGenerating && store.generatingPhase === 2" class="status-row">
      <AssistantAvatar />
      <span class="status-text status-pulse">{{ $t('activity.generatingStatus2') }}</span>
    </div>

    <div
      v-if="store.displayedContent"
      class="content-body"
      v-html="marked.parse(store.displayedContent)"
    />

    <div v-if="store.isGenerating" class="cursor-blink" />

    <div v-if="store.hasGenerated && store.sources.length" class="sources-section">
      <h3 class="sources-title">{{ $t('activity.sourcesTitle') }}</h3>
      <SourcesListComponent
        cardType="simple"
        :sourcesList="store.sources"
        :isSourcesError="false"
        :isFetchingSources="false"
        :noResults="false"
        hideSteps
      />
    </div>
  </div>
</template>

<style scoped>
.result-wrapper {
  padding: 1.5rem 0;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  color: var(--neutral-60, #666);
}

.status-text {
  font-size: 0.875rem;
}

.status-pulse {
  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.content-body {
  font-size: 0.9rem;
  color: var(--neutral-80);
  line-height: 1.65;
}

.content-body :deep(h2) {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
  color: var(--neutral-80);
}

.content-body :deep(h3) {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 1.5rem 0 0.5rem;
  color: var(--neutral-80);
}

.content-body :deep(p) {
  margin: 0 0 0.6rem;
}

.content-body :deep(ul),
.content-body :deep(ol) {
  padding-left: 1.25rem;
  margin: 0 0 0.75rem;
}

.content-body :deep(li) {
  margin-bottom: 0.3rem;
}

.content-body :deep(strong) {
  font-weight: 600;
}

.content-body :deep(em) {
  font-style: italic;
}

.cursor-blink {
  display: inline-block;
  width: 2px;
  height: 1rem;
  background: var(--primary);
  margin-left: 2px;
  animation: blink 0.8s step-end infinite;
  vertical-align: text-bottom;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.sources-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--neutral-20);
}

.sources-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--neutral-80);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
</style>

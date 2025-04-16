<script setup lang="ts">
import { marked } from 'marked';
defineProps<{
  visible?: boolean;
  syllabus?: { content: string; source: string }[];
}>();
</script>
<template>
  <div class="wrapper" :class="{ visible: visible && syllabus.length }">
    <h1 class="title is-4">{{ $t('tutor.thirdStep.title') }}</h1>
    <p class="subtitle is-6">{{ $t('tutor.thirdStep.description') }}</p>
    <!-- syllabus -->
    <details
      :key="item.source"
      v-for="item in syllabus"
      class="details"
      :open="item.source === 'PedagogicalEngineerAgent'"
    >
      <summary class="title is-6 mb-2">
        {{ $t(`tutor.agents.${item.source}`) }}
      </summary>
      <p
        contenteditable="true"
        id="syllabus"
        class="syllabus content"
        v-if="item.content.length"
        v-html="marked.parse(item.content)"
      />
    </details>
  </div>
</template>

<style scoped>
.wrapper {
  overflow: scroll;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  flex-basis: 0;
  transition: flex-grow 0.3s;
}

.wrapper.visible {
  flex-grow: 3;
}

details:not([open]) {
  opacity: 0.5;
}

.syllabus {
  padding: 2rem;
  border: 1px solid var(--neutral-20);
  border-radius: 0.5rem;
  min-height: 10rem;
  max-width: 80rem;
  overflow-y: auto;
  overflow-x: scroll;
  background-color: var(--neutral-10);
  cursor: text;
}
</style>

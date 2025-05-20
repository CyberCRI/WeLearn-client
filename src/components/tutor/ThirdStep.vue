<script setup lang="ts">
import { marked } from 'marked';
import { ref, Ref } from 'vue';
const props = defineProps<{
  visible?: boolean;
  syllabus?: { content: string; source: string }[];
  giveFeedback: (feedback: string) => void;
}>();

const enableFeedback: Ref<boolean> = ref(false);
const feedback: Ref<string> = ref('');
const newSyllabus: Ref<string> = ref('');
const toggleFeedback = async () => {
  if (feedback.value.length > 0) {
    const res = await props.giveFeedback(feedback.value);
    newSyllabus.value = res.syllabus[0].content;
  }
  enableFeedback.value = !enableFeedback.value;
};
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
    <p class="content" v-if="newSyllabus" v-html="marked.parse(newSyllabus)" />
    <textarea class="textarea" v-if="enableFeedback" v-model="feedback"></textarea>
    <button class="button" @click="toggleFeedback">feedback</button>
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

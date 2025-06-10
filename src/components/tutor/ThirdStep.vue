<script setup lang="ts">
import { marked } from 'marked';
import { ref, Ref } from 'vue';
const props = defineProps<{
  visible?: boolean;
  syllabus?: { content: string; source: string };
  giveFeedback: (feedback: string) => void;
}>();

const enableFeedback: Ref<boolean> = ref(false);
const feedback: Ref<string> = ref('');

const toggleFeedback = async () => {
  if (feedback.value.length > 0) {
    await props.giveFeedback(feedback.value);
    feedback.value = '';
  }
  enableFeedback.value = !enableFeedback.value;
};
</script>
<template>
  <div class="wrapper" :class="{ visible: visible }">
    <h1 class="title is-4">{{ $t('tutor.thirdStep.title') }}</h1>
    <p class="subtitle is-6">{{ $t('tutor.thirdStep.description') }}</p>
    <!-- syllabus -->
    <p
      contenteditable="true"
      id="syllabus"
      class="syllabus content"
      v-if="syllabus?.content"
      v-html="marked.parse(syllabus?.content)"
    />
    <textarea class="textarea" v-if="enableFeedback" v-model="feedback"></textarea>
    <button class="button" @click="toggleFeedback">
      {{ enableFeedback ? $t('tutor.thirdStep.sendFeedback') : $t('tutor.thirdStep.giveFeedback') }}
    </button>
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

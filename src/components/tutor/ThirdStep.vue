<script setup lang="ts">
import { marked } from 'marked';
import { ref, type Ref } from 'vue';
const props = defineProps<{
  syllabus?: { content: string; source: string };
  giveFeedback: (feedback: string) => void;
  action: () => {};
  actionText?: string;
  disabled: boolean;
  updateSyllabus: () => void;
}>();

const isEditable: Ref<boolean> = ref(false);

const enableFeedback: Ref<boolean> = ref(false);
const feedback: Ref<string> = ref('');

const toggleFeedback = async () => {
  if (feedback.value.length > 0) {
    await props.giveFeedback(feedback.value);
    feedback.value = '';
  }
  enableFeedback.value = !enableFeedback.value;
};

const handleTextEdit = (event, index) => {
  const newValue = event.target.innerText;
  props.updateSyllabus(index, newValue);
};
</script>
<template>
  <div id="target-4" class="wrapper" :class="{ disabled: disabled }">
    <h1 data-testid="thirdStepTitle" class="title is-4">4 - {{ $t('tutor.thirdStep.title') }}</h1>
    <p class="subtitle is-6">{{ $t('tutor.thirdStep.description') }}</p>
    <!-- syllabus -->
    <p
      :contenteditable="isEditable"
      id="syllabus"
      class="syllabus content"
      v-if="syllabus?.content"
      v-html="marked.parse(syllabus?.content)"
      @blur="handleTextEdit($event, index)"
      @click="isEditable = true"
    />
    <textarea class="textarea" v-if="enableFeedback" v-model="feedback"></textarea>

    <div class="is-flex is-justify-content-end mt-4">
      <button class="button" @click="toggleFeedback">
        {{
          enableFeedback ? $t('tutor.thirdStep.sendFeedback') : $t('tutor.thirdStep.giveFeedback')
        }}
      </button>
      <button class="button is-primary ml-2" @click="action()">download</button>
    </div>
  </div>
</template>

<style scoped>
.button > svg {
  height: 1rem;
  padding-right: 1rem;
}
.wrapper {
  overflow: scroll;
  display: flex;
  height: 100%;
  flex-direction: column;
  flex-grow: 0;
  flex-basis: 0;
  transition: flex-grow 0.3s;
  padding: 5% 0;
  width: 80%;
  margin: auto;
}

.wrapper.disabled {
  opacity: 50%;
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

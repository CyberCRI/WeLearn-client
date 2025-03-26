<script setup lang="ts">
import { ref } from 'vue';
import { marked } from 'marked';
import axios from 'axios';
defineProps<{
  visible?: boolean;
}>();
const syllabus = ref('');

const setSyllabusValue = (text) => {
  syllabus.value = text;
};

axios
  .get('./src/components/tutor/mockedSyllabus.md')
  .then((res) => setSyllabusValue(res.data))
  .catch((err) => console.log(err));
</script>
<template>
  <div class="wrapper" :class="{ visible: visible && syllabus.length }">
    <h1 class="title is-4">{{ $t('tutor.thirdStep.title') }}</h1>
    <p class="subtitle is-6">{{ $t('tutor.thirdStep.description') }}</p>
    <!-- syllabus -->
    <p
      contenteditable="true"
      class="syllabus content"
      v-if="syllabus.length"
      v-html="marked.parse(syllabus)"
    />
  </div>
</template>

<style scoped>
.wrapper {
  overflow: hidden;
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

.syllabus {
  padding: 2rem;
  border: 1px solid var(--neutral-20);
  border-radius: 0.5rem;
  min-height: 10rem;
  overflow-y: auto;
  overflow-x: auto;
  background-color: var(--neutral-10);
  cursor: text;
}
</style>

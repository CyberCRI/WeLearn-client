<script setup lang="ts">
// TODO: use button to make summary editable
// TODO: use button to validate summary --> make it required to go to the next step
// TODO: send edited summaries to the search request
// TODO: Move summary step to a independent component
// figma URL : https://www.figma.com/design/VU4kFsVKJDOMt3PXwn6Jtj/welearn?node-id=452-2032&t=UKKyq5sAsGyr5Qe0-4
import CheckIcon from '@/components/icons/CheckIcon.vue';
import { ref } from 'vue';

const props = defineProps<{
  summaries: [string];
  files: File;
  updateSummary: () => void;
}>();

const editableParagraphs = ref(props.summaries.map(() => true));

function toggleEdit(index) {
  editableParagraphs.value[index] = !editableParagraphs.value[index];

  if (editableParagraphs.value[index]) {
    requestAnimationFrame(() => {
      const el = document.getElementById(`summary_${index}`);
      if (!el) return;
      el.focus();

      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    });
  }
}

function preventLineBreaks(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
}

function sanitizePaste(e) {
  e.preventDefault();
  const text = e.clipboardData.getData('text/plain').replace(/\r?\n|\r/g, ' ');
  document.execCommand('insertText', false, text);
}

const handleTextEdit = (event, index) => {
  const newValue = event.target.innerText;
  props.updateSummary(index, newValue);
};
</script>
<template>
  <div class="summaries-section">
    <h2 class="title is-4 mt-4">2 - {{ $t('tutor.secondStep.summariesTitle') }}</h2>
    <p class="subtitle is-6">
      {{ $t('tutor.secondStep.summariesDescription') }}
    </p>
    <div id="summaries" :key="index" v-for="(summary, index) in summaries">
      <h2 class="title is-6 mt-4">
        {{ Object.values(files)[index]?.name || $t('tutor.secondStep.noFileName') }}
      </h2>
      <div class="is-flex">
        <p
          :id="`summary_${index}`"
          class="input summary"
          :contenteditable="editableParagraphs[index]"
          @keydown="preventLineBreaks"
          @paste="sanitizePaste"
          @blur="handleTextEdit($event, index)"
          :class="{ validated: !editableParagraphs[index] }"
        >
          {{ summary }}
        </p>
        <div class="mt-2 ml-2">
          <button
            class="button is-white"
            @click="toggleEdit(index)"
            :class="{ validated: !editableParagraphs[index] }"
          >
            <span class="icon is-small">
              <CheckIcon />
            </span>
            <span>validate</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.summaries-section {
  margin: auto;
  height: 80%;
  padding: 5% 0;
}

button.validated {
  color: green;
}

p.validated {
  background-color: var(--neutral-10);
}

.summary {
  width: 80%;
  height: auto;
  padding: 1rem;
  resize: none;
  margin-top: 0.5rem;
}
</style>

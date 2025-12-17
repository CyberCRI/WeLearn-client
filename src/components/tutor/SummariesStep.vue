<script setup lang="ts">
// TODO: use button to make summary editable
// TODO: use button to validate summary --> make it required to go to the next step
// TODO: send edited summaries to the search request
import CheckIcon from '@/components/icons/CheckIcon.vue';
import ChevronDown from '@/components/icons/ChevronDown.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import { ref } from 'vue';

const props = defineProps<{
  summaries: [string];
  files: File;
  updateSummary: () => void;
  action: () => void;
  actionText?: string;
  disabled: boolean;
}>();

const editableParagraphs = ref(props.summaries.map(() => true));

function toggleEdit(index, value) {
  editableParagraphs.value[index] = value;

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
  <div id="target-2" class="summaries-section" :class="{ disabled: disabled }">
    <h2 data-testid="tutor-summaries-title" class="title is-4 mt-4">
      2 - {{ $t('tutor.summaries.title') }}
    </h2>
    <p class="subtitle is-6">
      {{ $t('tutor.summaries.description') }}
    </p>
    <div id="summaries" :key="index" v-for="(summary, index) in summaries">
      <h2 class="title is-6 mt-4">
        {{ Object.values(files)[index]?.name || $t('tutor.summaries.noFileName') }}
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
          <button class="button is-white mt-2" @click="toggleEdit(index, true)">
            <span class="icon is-small">
              <EditIcon />
            </span>
            <span>{{ $t('edit') }}</span>
          </button>
          <button
            data-testid="validate-summary-button"
            class="button is-white"
            @click="toggleEdit(index, false)"
            :class="{ validated: !editableParagraphs[index] }"
          >
            <span class="icon is-small">
              <CheckIcon />
            </span>
            <span>{{ editableParagraphs[index] ? $t('validate') : $t('validated') }}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="is-flex is-justify-content-end mt-4">
      <a class="button is-primary" href="#" @click="action()">
        <ChevronDown />
        {{ $t(`${actionText || 'next'}`) }}
      </a>
    </div>
  </div>
</template>
<style scoped>
.button > svg {
  height: 1rem;
  padding-right: 1rem;
}
.summaries-section {
  margin: auto;
  height: 80%;
  padding: 5% 0;
  width: 80%;
}
.summaries-section.disabled {
  height: 10%;
  & > * {
    opacity: 50%;
  }
}

button.validated {
  color: green;
}

p.validated {
  background-color: var(--neutral-10);
}

.summary {
  width: 100%;
  height: auto;
  padding: 1rem;
  resize: none;
  margin-top: 0.5rem;
}
</style>

<script lang="ts" setup>
import CheckIcon from '@/components/icons/CheckIcon.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import { ref } from 'vue';
const props = defineProps<{
  paragraphList: [string];
  title: string;
  updateSummary: (index: number, content: string) => void;
}>();
const editableParagraphs = ref(props.paragraphList.map(() => true));

function toggleEdit(index: number, value: boolean) {
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
      sel?.removeAllRanges();
      sel?.addRange(range);
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
  <div id="editable-paragraphs" :key="index" v-for="(paragraph, index) in paragraphList">
    <h2 class="title is-6 mt-4">
      {{ title }}
    </h2>
    <div class="is-flex is-flex-wrap-wrap">
      <div class="mt-2 ml-auto is-flex is-align-items-center">
        <button class="button is-white" @click="toggleEdit(index, true)">
          <span class="icon is-small">
            <EditIcon />
          </span>
          <span>{{ $t('edit') }}</span>
        </button>
        <button
          data-testid="validate-button"
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
      <p
        :id="`summary_${index}`"
        class="input editable-paragraph"
        :contenteditable="editableParagraphs[index]"
        @keydown="preventLineBreaks"
        @paste="sanitizePaste"
        @blur="handleTextEdit($event, index)"
        :class="{ validated: !editableParagraphs[index] }"
      >
        {{ summary }}
      </p>
    </div>
  </div>
</template>
<style scoped>
.button > svg {
  height: 1rem;
  padding-right: 1rem;
}

button.validated {
  color: green;
}

p.validated {
  background-color: var(--neutral-10);
}

.editable-paragraph {
  width: 100%;
  height: auto;
  padding: 1rem;
  resize: none;
  margin-top: 0.5rem;
}
</style>

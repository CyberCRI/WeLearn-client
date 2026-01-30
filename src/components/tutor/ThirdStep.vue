<script setup lang="ts">
// TODO: add an "edit" button
import { marked } from 'marked';
import { ref, type Ref } from 'vue';
import EditIcon from '@/components/icons/EditIcon.vue';
const props = defineProps<{
  syllabus?: { content: string; source: string };
  giveFeedback: (feedback: string) => void;
  action: () => {};
  actionText?: string;
  disabled: boolean;
  updateSyllabus: () => void;
  restart: () => void;
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
    <h1 data-testid="thirdStepTitle" class="title is-4 is-size-5-mobile">
      4 - {{ $t('tutor.thirdStep.title') }}
    </h1>
    <p class="subtitle is-6">{{ $t('tutor.thirdStep.description') }}</p>
    <!-- syllabus -->

    <div class="is-flex is-flex-direction-column">
      <button class="button is-white ml-auto" @click="isEditable = !isEditable">
        <span class="icon is-small mr-2">
          <EditIcon />
        </span>
        {{ isEditable ? $t('save') : $t('edit') }}
      </button>
      <div class="editable-syllabus-wrapper">
        <p
          :contenteditable="isEditable"
          :class="{ editable: isEditable }"
          id="syllabus"
          class="syllabus content"
          v-if="syllabus?.content"
          v-html="marked.parse(syllabus?.content)"
          @blur="handleTextEdit($event, index)"
          @click="isEditable = true"
        />
      </div>
    </div>

    <textarea class="textarea" v-if="enableFeedback" v-model="feedback"></textarea>

    <div class="actions">
      <button class="button feedback" @click="toggleFeedback">
        {{
          enableFeedback ? $t('tutor.thirdStep.sendFeedback') : $t('tutor.thirdStep.giveFeedback')
        }}
      </button>
      <button class="button is-primary" @click="action()">{{ $t('download') }}</button>
      <button class="button" @click="restart">
        {{ $t('tutor.restartSyllabusCreation') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.actions {
  margin-top: 1rem;
  display: flex;
  justify-content: end;
  padding-bottom: 3rem;
  gap: 1rem;
}

.button.feedback {
  margin-right: auto;
}

.button > svg {
  height: 1rem;
  padding-right: 1rem;
}

.wrapper {
  display: flex;
  height: 100%;
  flex-direction: column;
  flex-grow: 0;
  flex-basis: 0;
  transition: flex-grow 0.3s;
  padding: 5% 0;
  width: 100%;
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

.editable-syllabus-wrapper {
  height: 70vh;
  overflow-y: scroll;
  margin-bottom: 8px;
}
.editable {
  border: 2px solid var(--primary);
  background-color: var(--neutral-0);
}

@media screen and (max-width: 1280px) {
  .actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
  }
  .button.feedback {
    margin-right: 0;
  }

  .syllabus {
    padding: 1rem;
  }

  .content h2 {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
  }
}
</style>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import OpenUrlIcon from '@/components/icons/OpenUrlIcon.vue';
import type { FileErrorReason } from '@/stores/tutor';

interface Props {
  files: Record<string, File>;
  addFiles: (files: FileList | File[]) => void;
  removeFile: (name: string) => void;
  fileError: { state: boolean; reason: FileErrorReason | null };
  courseTitle: string;
  level: string;
  duration: string;
  description: string;
  action: () => void;
  storedLanguage: string;
  selectLang: (lang: string) => void;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:courseTitle': [value: string];
  'update:level': [value: string];
  'update:duration': [value: string];
  'update:description': [value: string];
}>();

const isDragging = ref(false);
const showNudge = ref(false);
const titleInput = ref<HTMLInputElement | null>(null);
const nudge = ref<HTMLElement | null>(null);

const fileNames = computed(() => Object.keys(props.files));
const hasDetails = computed(
  () => !!(props.courseTitle || props.level || props.duration || props.description)
);

const onPick = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files) props.addFiles(input.files);
  // allows picking the same file again after removing it
  input.value = '';
};

const onDrop = (e: DragEvent) => {
  isDragging.value = false;
  if (e.dataTransfer?.files) props.addFiles(e.dataTransfer.files);
};

const onContinue = async () => {
  if (!hasDetails.value && !showNudge.value) {
    showNudge.value = true;
    await nextTick();
    nudge.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  showNudge.value = false;
  props.action();
};

const focusDetails = () => {
  showNudge.value = false;
  titleInput.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  titleInput.value?.focus();
};
</script>

<template>
  <div class="wrapper">
    <h1 class="title is-4 is-size-5-mobile">{{ $t('tutor.documentsStep.title') }}</h1>
    <p class="subtitle is-6 mt-2">{{ $t('tutor.documentsStep.description') }}</p>

    <label
      class="dropzone"
      :class="{ dragging: isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="onDrop"
    >
      <input
        class="is-sr-only"
        type="file"
        multiple
        accept="application/pdf, text/plain, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        data-testid="file-input"
        @change="onPick"
      />
      <span>
        {{ $t('tutor.documentsStep.dropzone') }}
        <span class="browse">{{ $t('tutor.documentsStep.browse') }}</span>
      </span>
      <span class="is-size-7 has-text-grey">{{ $t('tutor.documentsStep.limits') }}</span>
    </label>

    <p v-if="fileError.state" class="has-text-danger mt-2">
      {{ $t(`tutor.${fileError.reason}`) }}
    </p>

    <ul v-if="fileNames.length" class="files" data-testid="file-list">
      <li v-for="name in fileNames" :key="name">
        <span class="file-name">{{ name }}</span>
        <button
          class="delete is-small"
          :aria-label="$t('tutor.documentsStep.removeFile', { name })"
          @click="removeFile(name)"
        />
      </li>
    </ul>

    <p class="is-size-7 has-text-grey mt-2">
      {{ $t('tutor.documentsStep.hint') }}
      <a
        class="example-link"
        href="https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0206282&type=printable"
        target="_blank"
        >{{ $t('tutor.documentsStep.exampleLink') }} <OpenUrlIcon class="icon is-small"
      /></a>
    </p>

    <div class="field mt-5 language">
      <label class="label" for="cursus-lang">{{ $t('tutor.documentsStep.languageLabel') }}</label>
      <div class="select">
        <select
          id="cursus-lang"
          :value="storedLanguage"
          @change="selectLang(($event.target as HTMLSelectElement).value)"
        >
          <option v-for="lang in ['fr', 'en']" :key="lang" :value="lang">
            {{ $t(`lang.${lang}`) }}
          </option>
        </select>
      </div>
    </div>

    <!-- Course details: optional but they make the syllabus fit the course -->
    <div class="details box mt-5">
      <h2 class="title is-5 mb-2 details-title">
        {{ $t('tutor.documentsStep.detailsTitle') }}
        <span class="tag is-primary is-light">{{ $t('tutor.documentsStep.recommended') }}</span>
      </h2>
      <p class="mb-4">{{ $t('tutor.documentsStep.detailsWhy') }}</p>

      <div class="cursus-details">
        <div class="field full">
          <label class="label" for="cursus-title">{{ $t('tutor.documentsStep.titleLabel') }}</label>
          <input
            ref="titleInput"
            class="input"
            type="text"
            id="cursus-title"
            :value="courseTitle"
            @input="emit('update:courseTitle', ($event.target as HTMLInputElement).value)"
            :placeholder="$t('tutor.documentsStep.titlePlaceholder')"
          />
        </div>
        <div class="field">
          <label class="label" for="cursus-level">{{ $t('tutor.documentsStep.levelLabel') }}</label>
          <input
            class="input"
            type="text"
            id="cursus-level"
            :value="level"
            @input="emit('update:level', ($event.target as HTMLInputElement).value)"
            :placeholder="$t('tutor.documentsStep.levelPlaceholder')"
          />
        </div>
        <div class="field">
          <label class="label" for="cursus-duration">
            {{ $t('tutor.documentsStep.durationLabel') }}
          </label>
          <input
            class="input"
            type="text"
            id="cursus-duration"
            :value="duration"
            @input="emit('update:duration', ($event.target as HTMLInputElement).value)"
            :placeholder="$t('tutor.documentsStep.durationPlaceholder')"
          />
        </div>
      </div>

      <div class="field">
        <label class="label" for="cursus-description">
          {{ $t('tutor.documentsStep.descriptionLabel') }}
        </label>
        <textarea
          id="cursus-description"
          class="textarea"
          rows="3"
          :placeholder="$t('tutor.documentsStep.descriptionPlaceholder')"
          :value="description"
          @input="emit('update:description', ($event.target as HTMLTextAreaElement).value)"
        />
      </div>
    </div>

    <div v-if="showNudge" ref="nudge" class="notification is-warning is-light nudge" role="status">
      <p>{{ $t('tutor.documentsStep.nudge') }}</p>
      <div class="buttons mt-2">
        <button class="button is-small" @click="focusDetails">
          {{ $t('tutor.documentsStep.addDetails') }}
        </button>
        <button class="button is-small is-text" @click="onContinue">
          {{ $t('tutor.documentsStep.continueAnyway') }}
        </button>
      </div>
    </div>

    <div class="step-footer">
      <span v-if="!fileNames.length" class="has-text-grey is-size-7">
        {{ $t('tutor.documentsStep.noFile') }}
      </span>
      <button
        data-testid="tutor-next-button"
        class="button is-primary"
        :disabled="!fileNames.length"
        @click="onContinue"
      >
        {{ $t('tutor.documentsStep.action') }} →
      </button>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1.5rem 1rem;
  border: 2px dashed var(--neutral-20);
  border-radius: 0.5rem;
  text-align: center;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background-color 0.2s;
  &:hover,
  &.dragging,
  &:focus-within {
    border-color: var(--primary);
    background-color: var(--neutral-10);
  }
}

.browse {
  color: var(--primary-dark);
  text-decoration: underline;
}

.files {
  margin-top: 0.75rem;
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    background-color: var(--neutral-10);
    margin-bottom: 0.25rem;
  }
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.example-link {
  white-space: nowrap;
  .icon {
    width: 0.9em;
    height: 0.9em;
    vertical-align: -0.1em;
  }
}

.language .select {
  min-width: 12rem;
  select {
    width: 100%;
  }
}

.details-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.details {
  box-shadow: none;
  border: 1px solid var(--neutral-20);
}

.cursus-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 1rem;
  .full {
    grid-column: 1 / -1;
  }
}

.nudge {
  margin-top: 1rem;
  margin-bottom: 0;
}

.step-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .cursus-details {
    grid-template-columns: 1fr;
  }
}
</style>

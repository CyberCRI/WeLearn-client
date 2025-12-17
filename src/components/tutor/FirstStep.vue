<script setup lang="ts">
import { ref, computed } from 'vue';
import ChevronDown from '@/components/icons/ChevronDown.vue';

// TODO: add info that default values will be used if not written down
// TODO: make files required:w

interface Props {
  disabled?: boolean;
  addFile: (e: Event, id: string) => void;
  removeFile: (id: string) => void;
  searchError?: boolean;
  fileError: { state: boolean; reason: 'BIG_FILE' | 'BAD_EXTENSION' | null };
  courseTitle: string;
  level: string;
  duration: string;
  description: string;
  action: () => void;
  actionText?: string;
  addedFilesTitles: string[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:courseTitle': [value: string];
  'update:level': [value: string];
  'update:duration': [value: string];
  'update:description': [value: string];
}>();

const MAX_FILES = 3;
const inputGroupLength = ref(1);
const uid = ref(0);
const inputGroupRef = ref<HTMLElement | null>(null);
const inputContainerRef = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const deleteButtonRef = ref<HTMLButtonElement | null>(null);

const canAddMoreFiles = computed(() => inputGroupLength.value < MAX_FILES);
const hasMultipleFiles = computed(() => inputGroupLength.value > 1);

const updateInputGroupLength = () => {
  inputGroupLength.value = document.querySelectorAll('.input-group input').length;
};

const removeElementById = (id: string) => {
  const element = document.getElementById(id);
  if (element && element.parentNode === inputGroupRef.value) {
    inputGroupRef.value?.removeChild(element);
  }
  updateInputGroupLength();
};

const handleRemoveFile = (id: string) => {
  props.removeFile(id);
  removeElementById(id);
};

const createInput = (id: string) => {
  const input = fileInputRef.value?.cloneNode(false) as HTMLInputElement;
  input.id = id;
  input.files = new DataTransfer().files;
  input.addEventListener('change', (e) => props.addFile(e, id));
  return input;
};

const createDeleteButton = (id: string) => {
  const delButton = deleteButtonRef.value?.cloneNode(true) as HTMLButtonElement;
  delButton.disabled = false;
  delButton.addEventListener('click', () => handleRemoveFile(id));
  return delButton;
};

const appendNewInputFile = () => {
  if (!inputGroupRef.value || !inputContainerRef.value) {
    console.error('Input group is not defined');
    return;
  }

  const elementId = `file_${++uid.value}`;
  const container = inputContainerRef.value.cloneNode(false) as HTMLElement;
  container.id = elementId;

  container.appendChild(createInput(elementId));
  container.appendChild(createDeleteButton(elementId));

  inputGroupRef.value.appendChild(container);
  updateInputGroupLength();
};
</script>

<template>
  <div id="target-1" class="wrapper" :class="{ disabled }">
    <h1 class="title is-4">1 - {{ $t('tutor.firstStep.title') }}</h1>
    <p class="subtitle is-6">{{ $t('tutor.firstStep.description') }}</p>

    <!-- File Input Section -->
    <div class="is-flex is-flex-direction-column">
      <div ref="inputGroupRef" class="input-group is-flex is-flex-direction-column">
        <div ref="inputContainerRef" class="is-flex is-flex-direction-row mb-2" id="file_0">
          <input
            ref="fileInputRef"
            class="input"
            type="file"
            accept="application/pdf, text/plain, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            placeholder="Enter the new file"
            data-testid="file-input"
            @change="(e) => props.addFile(e, 'file_0')"
          />
          <button ref="deleteButtonRef" disabled class="button">x</button>
        </div>
      </div>

      <p v-if="fileError.state" class="has-text-danger">
        {{ $t(`tutor.${fileError.reason}`) }}
      </p>

      <div class="is-align-self-flex-end">
        <span class="has-text-grey-light mr-2">{{ $t('tutor.firstStep.acceptedFiles') }}</span>
        <button
          v-if="hasMultipleFiles"
          class="button has-background-grey-light ml-2"
          @click="handleRemoveFile((inputGroupRef?.lastChild as HTMLElement)?.id || '')"
        >
          -
        </button>
        <button class="button" :disabled="!canAddMoreFiles" @click="appendNewInputFile">+</button>
      </div>
    </div>

    <p v-if="searchError" class="has-text-danger mt-2">
      {{ $t('tutor.firstStep.searchError') }}
    </p>

    <!-- Course Description Section -->
    <h2 class="title is-6 mt-4">
      {{ $t('tutor.firstStep.cursusDescriptionTitle') }}
    </h2>
    <p class="subtitle is-6">{{ $t('tutor.firstStep.cursusDescriptionDescription') }}</p>

    <div class="is-flex is-flex-wrap-wrap descriptions">
      <div class="description">
        <label for="cursus-title">{{ $t('tutor.firstStep.cursusTitleLabel') }}</label>
        <input
          class="input"
          type="text"
          id="cursus-title"
          :value="courseTitle"
          @input="emit('update:courseTitle', ($event.target as HTMLInputElement).value)"
          :placeholder="$t('tutor.firstStep.cursusTitlePlaceholder')"
        />
      </div>

      <div class="description">
        <label for="cursus-level">{{ $t('tutor.firstStep.cursusLevelLabel') }}</label>
        <input
          class="input"
          type="text"
          id="cursus-level"
          :value="level"
          @input="emit('update:level', ($event.target as HTMLInputElement).value)"
          :placeholder="$t('tutor.firstStep.cursusLevelPlaceholder')"
        />
      </div>

      <div class="description">
        <label for="cursus-duration">{{ $t('tutor.firstStep.cursusDurationLabel') }}</label>
        <input
          class="input"
          type="text"
          id="cursus-duration"
          :value="duration"
          @input="emit('update:duration', ($event.target as HTMLInputElement).value)"
          :placeholder="$t('tutor.firstStep.cursusDurationPlaceholder')"
        />
      </div>
    </div>

    <label for="cursus-description" class="mt-4">
      {{ $t('tutor.firstStep.cursusDescriptionLabel') }}
    </label>
    <textarea
      id="cursus-description"
      class="textarea mt-1"
      :placeholder="$t('tutor.firstStep.cursusDescriptionPlaceholder')"
      rows="5"
      :value="description"
      @input="emit('update:description', ($event.target as HTMLTextAreaElement).value)"
    />
    <div class="is-flex is-justify-content-end mt-4">
      <a data-testid="tutor-next-button" class="button is-primary" href="#" @click="action()">
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
.wrapper {
  padding: 5% 0;
  height: 80%;
  width: 80%;
  display: flex;
  flex-direction: column;
  transition: all 1s;
  margin: 0 auto;
}

.description {
  width: 32%;
}

.wrapper.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.descriptions {
  gap: 0.5rem;
}
</style>

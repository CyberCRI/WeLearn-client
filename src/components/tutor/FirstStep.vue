<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps<{
  disabled?: boolean;
  addFile: (e: Event, id?: string) => void;
  removeFile: (id: string) => void;
  searchError?: boolean;
  fileError: { state: boolean; reason: string };
}>();
const inputGroupLength = ref(document.querySelectorAll('.input-group input').length || 1);
const uid = ref(0);
const inputGroupRef = ref<HTMLElement | null>(null);
const inputContainerRef = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const deleteButtonRef = ref<HTMLButtonElement | null>(null);

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
  input.files = new DataTransfer().files; // Clear previous files
  input.addEventListener('change', (e) => props.addFile(e, id));
  return input;
};

const createDeletebutton = (id: string) => {
  const delButton = deleteButtonRef.value?.cloneNode(true) as HTMLButtonElement;
  delButton.disabled = false;
  delButton.addEventListener('click', () => {
    handleRemoveFile(id);
  });
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
  const input = createInput(elementId);
  const delButton = createDeletebutton(elementId);

  container.appendChild(input);
  container.appendChild(delButton);
  inputGroupRef.value.appendChild(container);
  updateInputGroupLength();
};
</script>
<template>
  <div class="wrapper" :class="{ disabled: disabled }">
    <h1 class="title is-4">{{ $t('tutor.firstStep.title') }}</h1>
    <p class="subtitle is-6">{{ $t('tutor.firstStep.description') }}</p>
    <div class="is-flex is-flex-wrap-wrap mb-4 descriptions">
      <div class="description">
        <label for="cursus-title">{{ $t('tutor.firstStep.cursusTitleLabel') }}</label>
        <input
          class="input decription"
          type="text"
          id="cursus-title"
          :placeholder="$t('tutor.firstStep.cursusTitlePlaceholder')"
        />
      </div>
      <div class="description">
        <label for="cursus-level">{{ $t('tutor.firstStep.cursusLevelLabel') }}</label>
        <input
          class="input decription"
          type="text"
          id="cursus-level"
          :placeholder="$t('tutor.firstStep.cursusLevelPlaceholder')"
        />
      </div>
      <div class="description">
        <label for="cursus-duration">{{ $t('tutor.firstStep.cursusDurationLabel') }}</label>
        <input
          class="input decription"
          type="text"
          id="cursus-duration"
          :placeholder="$t('tutor.firstStep.cursusDurationPlaceholder')"
        />
      </div>
    </div>
    <div>
      <div ref="inputGroupRef" class="input-group is-flex is-flex-direction-column">
        <div ref="inputContainerRef" class="is-flex is-flex-direction-row" id="file_0">
          <input
            ref="fileInputRef"
            class="input"
            type="file"
            accept="application/pdf, text/*"
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
      <button class="button" :disabled="inputGroupLength === 3" @click="appendNewInputFile">
        +
      </button>
      <button v-if="inputGroupLength > 1" class="button" @click="handleRemoveFile(`file_${uid}`)">
        -
      </button>
    </div>
    <p v-if="searchError" class="has-text-danger mt-2">
      {{ $t('tutor.firstStep.searchError') }}
    </p>
  </div>
</template>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 0.25;
  flex-shrink: 0.25;
  flex-basis: 30%;
  transition: all 1s;
  margin: 0 auto;
}

.wrapper.disabled {
  flex-basis: 25%;
  opacity: 0.5;
  pointer-events: none;
  flex-grow: 0.25;
}

.description {
  width: calc((100% / 3) - (0.5rem * 2));
}

.descriptions {
  gap: 0.5rem;
}
</style>

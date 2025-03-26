<script setup lang="ts">
import { ref } from 'vue';
defineProps<{
  disabled?: boolean;
}>();
const inputGroupLength = ref(1);

// TODO: think of a vue way of doing this
const appendNewInputFile = () => {
  const inputGroup = document.querySelector('.input-group');
  const div = document.createElement('div');
  div.className = 'is-flex is-flex-direction-row';
  const deleteButton = document.createElement('button');
  deleteButton.className = 'button';
  deleteButton.innerHTML = 'x';
  deleteButton.onclick = () => {
    inputGroup.removeChild(div);
    inputGroupLength.value -= 1;
  };
  const input = document.createElement('input');
  input.id = `file-${inputGroupLength.value}`;
  input.type = 'file';
  input.className = 'input';
  input.placeholder = 'Enter the name of the file';
  div.appendChild(input);
  div.appendChild(deleteButton);
  inputGroup.appendChild(div);
  inputGroupLength.value += 1;
};

const removeFirstChild = () => {
  const inputGroup = document.querySelector('.input-group');
  inputGroup.removeChild(inputGroup.firstChild);
  inputGroupLength.value -= 1;
};

const removeLastInputFile = () => {
  const inputGroup = document.querySelector('.input-group');
  inputGroup.removeChild(inputGroup.lastChild);
  inputGroupLength.value -= 1;
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
      <div class="input-group is-flex is-flex-direction-column">
        <div class="is-flex is-flex-direction-row" id="first">
          <input class="input" type="file" placeholder="Enter the name of the file" />
          <button class="button" @click="removeFirstChild">x</button>
        </div>
      </div>
      <button class="button" :disabled="inputGroupLength === 3" @click="appendNewInputFile">
        +
      </button>
      <button v-if="inputGroupLength > 1" class="button" @click="removeLastInputFile">-</button>
    </div>
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

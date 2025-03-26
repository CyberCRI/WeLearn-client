<script setup lang="ts">
import { ref } from 'vue';
defineProps<{
  disabled?: boolean;
}>();
const inputGroupLength = ref(1);

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
  flex-shrink: 1;
  flex-basis: 1;
  transition: all 2s;
  margin: 0 auto;
}

.wrapper.disabled {
  opacity: 0.5;
  pointer-events: none;
  flex-grow: 0.5;
}
</style>

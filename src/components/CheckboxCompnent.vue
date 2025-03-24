<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{
  label: string;
  value: string;
  id: string;
  name: string;
  modelValue?: string[] | string;
  checked: boolean;
  selectAll?: () => void;
  isDisabled?: boolean;
  isCapitalized?: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'selectAll']);

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});
</script>
<template>
  <label :aria-label="value" class="container" :class="{ disabled: isDisabled }">
    <div class="checkbox-label" :class="[isCapitalized && 'is-capitalized']">
      <p>{{ label }}</p>
      <slot name="test"></slot>
    </div>
    <input
      :key="value"
      type="checkbox"
      :value="value"
      :id="id"
      v-model="model"
      @change="$emit('selectAll')"
      :checked="checked"
      :disabled="isDisabled"
    />
    <span class="checkmark"></span>
  </label>
</template>
<style scoped>
/* Customize the label (the container) */
.container {
  display: flex;
  position: relative;
  align-items: center;

  padding-left: 1.5rem;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  &:hover {
    color: var(--neutral-80);
  }
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
  font-size: 1rem;
  & > * {
    display: flex;
    margin-block: auto;
  }
  &:hover {
    background-color: var(--neutral-10);
  }
}
.disabled {
  color: var(--neutral-50);
  cursor: not-allowed;
}
/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0.25rem;
  left: 0;
  height: 1rem;
  width: 1rem;
  background-color: var(--neutral-0);
  outline: 0.125rem solid var(--neutral-50);
  border-radius: 0.125rem;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: var(--neutral-0);
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: white;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 0.25rem;
  top: 0.25rem;
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--primary);
}
</style>

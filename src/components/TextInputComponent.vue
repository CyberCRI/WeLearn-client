<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    id: string;
    label: string;
    modelValue?: string;
    type?: 'text' | 'email';
    required?: boolean;
    autocomplete?: string;
    hint?: string;
    error?: string;
  }>(),
  { modelValue: '', type: 'text', required: false }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  blur: [];
}>();

const inputRef = ref<HTMLInputElement | null>(null);

const hintId = computed(() => `${props.id}-hint`);
const errorId = computed(() => `${props.id}-error`);
// screen readers read the hint, then the error, after the label
const describedBy = computed(
  () =>
    [props.hint && hintId.value, props.error && errorId.value].filter(Boolean).join(' ') ||
    undefined
);

const handleInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
};

defineExpose({ focus: () => inputRef.value?.focus() });
</script>

<template>
  <div class="field">
    <label class="label" :for="id">
      {{ label }}
      <span v-if="required" class="has-text-danger" aria-hidden="true">*</span>
    </label>
    <div class="control" :class="{ 'has-icons-left': $slots.icon }">
      <input
        ref="inputRef"
        class="input"
        :class="{ 'is-danger': error }"
        :id="id"
        :type="type"
        :value="modelValue"
        :required="required"
        :aria-required="required || undefined"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        :autocomplete="autocomplete"
        @input="handleInput"
        @blur="emit('blur')"
      />
      <div v-if="$slots.icon" class="icon-wrapper">
        <span class="icon is-small is-left" aria-hidden="true">
          <slot name="icon"></slot>
        </span>
      </div>
    </div>
    <p v-if="hint" :id="hintId" class="help">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="help is-danger">{{ error }}</p>
  </div>
</template>

<style scoped>
.label {
  font-weight: 700;
}

/* the wrapper centers the icon over the input's left padding. the icon is no longer a
   sibling of the input, so bulma's blue `.input:focus ~ .icon` color doesn't apply */
.icon-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--bulma-control-height);
  pointer-events: none;
}

.icon-wrapper .icon {
  position: static;
}
</style>

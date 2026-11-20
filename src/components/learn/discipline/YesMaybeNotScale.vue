<template>
  <div class="scaleWrapper">
    <button
      type="button"
      class="scaleValue"
      :key="value"
      v-for="value in scale"
      :class="{ selected: selected === value }"
      :disabled="disabled"
      @click="selected = value"
    >
      {{ $t(value) }}
    </button>
  </div>
</template>

<script setup lang="ts">
const scale = ['yes', 'maybe', 'notForNow'];
const selected = defineModel<string>();
defineProps<{ disabled?: boolean }>();
</script>

<style lang="css" scoped>
.scaleWrapper {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.scaleValue {
  background-color: var(--neutral-0);
  flex: 1;
  text-align: center;
  padding: 0.5rem 0rem;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  cursor: pointer;
  border: 1px solid var(--neutral-50);
  font: inherit;
  color: inherit;
}

.scaleValue:disabled {
  cursor: default;
}

.scaleValue:hover:not(:disabled) {
  border-color: var(--primary-hover);
  color: var(--primary-hover);
}

.scaleValue.selected {
  background-color: var(--primary-hover);
  border-color: var(--primary-hover);
  color: var(--neutral-0);
}
</style>

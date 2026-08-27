<template>
  <div class="scaleWrapper">
    <div
      class="scaleValue"
      :key="value"
      v-for="value in scale"
      :class="{ selected: selected === value }"
      @click="selectValue(value)"
    >
      {{ $t(value) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
const scale = ['yes', 'maybe', 'notForNow'];
const selected: Ref<string | undefined> = ref(undefined);

const selectValue = (val: string) => {
  selected.value = val;
};
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
}

.scaleValue:hover {
  border-color: var(--primary-hover);
  color: var(--primary-hover);
}

.scaleValue.selected {
  background-color: var(--primary-hover);
  border-color: var(--primary-hover);
  color: var(--neutral-0);
}
</style>

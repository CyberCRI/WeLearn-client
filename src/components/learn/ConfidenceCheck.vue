<script setup lang="ts">
// 1–5 self-rating (before / after a module). Native radios: keyboard and screen-reader friendly.
defineProps<{ question: string; name: string }>();
const model = defineModel<number | null>({ default: null });
</script>

<template>
  <fieldset class="confidence">
    <legend class="mb-2">{{ question }}</legend>
    <div class="scale">
      <span class="end">{{ $t('learn.module.confidenceLow') }}</span>
      <label v-for="n in 5" :key="n" class="point" :class="{ selected: model === n }">
        <input v-model="model" type="radio" :name="name" :value="n" />
        <span>{{ n }}</span>
      </label>
      <span class="end">{{ $t('learn.module.confidenceHigh') }}</span>
    </div>
  </fieldset>
</template>

<style scoped>
.confidence {
  border: 1px solid var(--neutral-20);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  background: var(--neutral-0);
}

.scale {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.end {
  font-size: 0.8rem;
  color: var(--neutral-70);
}

.point {
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  border: 1px solid var(--neutral-50);
  border-radius: 50%;
  cursor: pointer;
  transition:
    transform 0.15s,
    background-color 0.15s;
}

.point input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.point:has(input:focus-visible) {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.point.selected {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--neutral-0);
  transform: scale(1.1);
}
</style>

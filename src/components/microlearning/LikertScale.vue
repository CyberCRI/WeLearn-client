<template>
  <div class="scaleWrapper">
    <div class="scaleLevel" :key="value" v-for="value in scale">
      <div class="scaleValue" :class="{ selected: selected === value }" @click="selectValue(value)">
        {{ value }}
      </div>
      <span class="levelLegend" v-if="value === 1 || value == 5">{{
        value === 1 ? $t('autoEvaluation.notAtAll') : $t('autoEvaluation.tottally')
      }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
const scale = [1, 2, 3, 4, 5];
const selected: Ref<number | undefined> = ref(undefined);

const selectValue = (val: number) => {
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
  text-align: center;
  padding: 0.5rem 2rem;
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

.levelLegend {
  font-size: 0.8rem;
  color: var(--neutral-80);
}

.scaleLevel {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
</style>

<script setup lang="ts">
import { SDGs } from '@/components/SDG';

defineProps<{
  filterArr: number[];
  toggleFilter: (index: number) => void;
}>();
</script>

<template>
  <div class="sdgs">
    <div :key="sdg" v-for="(sdg, index) in SDGs">
      <CheckboxCompnentVue
        :name="sdg + index"
        :id="sdg + index"
        :value="index + 1"
        :label="`${$t('sdg')}`"
        :checked="filterArr?.includes(index + 1)"
        @select-all="() => index !== SDGs.length - 1 && $emit('toggleFilter', index)"
      />
    </div>
  </div>
</template>

<style scoped>
.sdgs {
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
  gap: 0.25rem;
  padding-top: 0.25rem;
}

.sdg-element-last {
  pointer-events: none;
  opacity: 0.3;
}

.sdg-element:hover {
  box-shadow:
    inset 0 -3em 3em rgba(0, 0, 0, 0.1),
    0.3em 0.3em 1em rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.sdg-img {
  padding: 0;
  border-radius: 0.25rem;
  height: 3rem;
}

.filter-true {
  border: red 1px solid;
}
.sdg-element {
  height: 3rem;
  width: 3rem;
}

.active {
  border: blue 0.25rem solid;
  opacity: 0.5;
}

@media screen and (min-width: 576px) {
  .sdgs {
    width: 100%;

    gap: 1rem;
    padding-top: 0.5rem;
  }

  .sdg-img {
    position: absolute;
    padding: 0;
    border-radius: 0.25rem;
    height: 5rem;
  }

  .sdg-element {
    height: 5rem;
    width: 5rem;
  }
}
</style>

<script setup lang="ts">
import PillComponent from '@/components/PillComponent.vue';
import FilterSettingIcon from '@/components/icons/FilterSettingIcon.vue';
import { ref } from 'vue';

const visibleFilters = ref(true);
const toggleFilters = () => (visibleFilters.value = !visibleFilters.value);
const filters = ref(['4', '6', '8']);

const clearFilters = () => {
  filters.value = [];
};
</script>
<template>
  <div
    class="is-clickable is-flex is-align-items-center is-align-content-center mt-4 mb-5"
    @click="toggleFilters"
  >
    <FilterSettingIcon class="mr-4" /> <span>Search filters</span>
  </div>
  <div v-if="filters.length" class="selection is-flex my-4">
    <PillComponent :key="filter" v-for="filter in filters" :content="filter" />
    <p class="ml-auto mr-6" @click="clearFilters">Remove all</p>
  </div>
  <p v-else class="selection is-flex my-4">
    <span class="has-text-grey">No filters selected</span>
  </p>
  <div :class="{ hide: !visibleFilters }" class="pr-5 filters">
    <input class="input" type="text" placeholder="Search..." />
    <details class="filter-section" open>
      <summary>Sources</summary>
      <div class="filter-options">
        <p>Wikipedia</p>
        <p>Ted</p>
        <p>Wikipedia</p>
        <p>Ted</p>
        <p>Wikipedia</p>
        <p>Wikipedia</p>
        <p>Wikipedia</p>
        <p>Wikipedia</p>
        <p>Wikipedia</p>
        <p>Ted</p>
        <p>Ted</p>
        <p>Ted</p>
        <p>Ted</p>
        <p>Wikipedia</p>
        <p>Wikipedia</p>
        <p>Wikipedia</p>
        <p>Ted</p>
        <p>Ted</p>
        <p>Ted</p>
        <p>Ted</p>
        <p>Wikipedia</p>
        <p>Wikipedia</p>
        <p>Wikipedia</p>
        <p>Ted</p>
        <p>Ted</p>
        <p>Ted</p>
      </div>
    </details>
    <details class="filter-section" open>
      <summary>SDGs</summary>
      <div class="filter-options">
        <p>Wikipedia</p>
        <p>Ted</p>
        <p>Wikipedia</p>
        <p>Wikipedia</p>
        <p>Wikipedia</p>
        <p>Wikipedia</p>
        <p>Wikipedia</p>
        <p>Wikipedia</p>
        <p>Ted</p>
        <p>Ted</p>
        <p>Ted</p>
        <p>Ted</p>
        <p>Wikipedia</p>
        <p>Wikipedia</p>
        <p>Wikipedia</p>
        <p>Ted</p>
        <p>Ted</p>
        <p>Ted</p>
        <p>Ted</p>
        <p>Wikipedia</p>
        <p>Wikipedia</p>
        <p>Wikipedia</p>
        <p>Ted</p>
        <p>Ted</p>
        <p>Ted</p>
        <p>Ted</p>
      </div>
    </details>
  </div>
</template>

<style scoped>
.filters {
  max-height: 75%;
  transition:
    max-height 0.5s,
    opacity 0.5s;
  overflow-y: auto;
}
.filters.hide {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.filter-section {
  padding: 0.5rem;
  position: relative;
}

summary {
  cursor: pointer;
  font-weight: bold;
  padding: 0.5rem;
  background-color: var(--neutral-10);
  border-radius: 0.25rem;
  position: sticky;
}

.filter-section[open] {
  max-height: 50%;
}

details > .filter-options {
  max-height: 25vh;
  overflow-y: auto;
}
</style>

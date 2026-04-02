<script setup lang="ts">
import CheckboxCompnentVue from '@/components/CheckboxCompnent.vue';
import { useFiltersStore } from '@/stores/filters';
import type { Corpus } from '@/types';

defineProps<{ isUp?: boolean; context?: string; availableSources: Record<string, Corpus[]> }>();
const filters = useFiltersStore();
</script>
<template>
  <div v-for="(sources, category) in availableSources" :key="category">
    <details open>
      <summary :data-category="category" class="font-bold is-clickable">
        {{ $t(`categories.${category}`) }}
      </summary>

      <div v-for="source in sources" :key="source.name">
        <CheckboxCompnentVue
          :name="source.name"
          :id="source.name"
          v-model="filters.sourcesFilters"
          :value="source.name"
          :label="$t(`corpus.${source.name}`)"
          :checked="filters.sourcesFilters.includes(source.name)"
          isCapitalized
        >
        </CheckboxCompnentVue>
      </div>
    </details>
  </div>
</template>

<style scoped>
summary {
  margin-top: 0.5rem;

  cursor: pointer;
  padding: 0.2rem;
  border-radius: 0.25rem;
  position: sticky;
}
</style>

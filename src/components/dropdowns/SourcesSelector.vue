<script setup lang="ts">
import CheckboxCompnentVue from '@/components/CheckboxCompnent.vue';
import { useFiltersStore } from '@/stores/filters';

defineProps<{ isUp?: boolean; context?: string; availableSources: Record<string, any>[] }>();
const filters = useFiltersStore();
</script>
<template>
  <div :key="source.name" class="my-2" v-for="source in availableSources">
    <CheckboxCompnentVue
      :name="source.name"
      :id="source.name"
      v-model="filters.sourcesFilters"
      :value="source.name"
      :label="source.translated"
      :checked="filters.sourcesFilters.includes(source.name)"
      isCapitalized
    >
    </CheckboxCompnentVue>
  </div>
</template>

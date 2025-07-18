<script setup lang="ts">
import CheckboxCompnentVue from '@/components/CheckboxCompnent.vue';
import { useSourcesStore } from '@/stores/sources';
import { useFiltersStore } from '@/stores/filters';

defineProps<{ isUp?: boolean; context?: string }>();
const sources = useSourcesStore();
const filters = useFiltersStore();
</script>
<template>
  <div :key="source.name" class="my-2" v-for="source in sources.sourcesList">
    <CheckboxCompnentVue
      :name="source.name"
      :id="source.name"
      v-model="filters.sourcesFilters"
      :value="source.name"
      :label="`${$t(`corpus.${source.name.replace('-', ' ')}`, `${source.name.replace('-', ' ')}`)}`"
      :checked="filters.sourcesFilters.includes(source.name)"
      isCapitalized
    >
    </CheckboxCompnentVue>
  </div>
</template>

<script setup lang="ts">
import CheckboxCompnentVue from '@/components/CheckboxCompnent.vue';
import { useSourcesStore } from '@/stores/sources';
import { useFiltersStore } from '@/stores/filters';

defineProps<{ isUp?: boolean; context?: string }>();
const sources = useSourcesStore();
const filters = useFiltersStore();

const not_in_search = !window.location.pathname.includes('search');
</script>
<template>
  <div :key="source.name" class="my-2" v-for="source in sources.sourcesList">
    <CheckboxCompnentVue
      :name="source.name"
      :id="source.name"
      v-model="filters.sourcesFilters"
      :value="source.name"
      :label="`${$t(`corpus.${source.name}`, `${source.name.replace('-', ' ')}`)}`"
      :isDisabled="!source.is_allowed && not_in_search"
      :checked="filters.sourcesFilters.includes(source.name)"
      isCapitalized
    >
    </CheckboxCompnentVue>
  </div>
</template>

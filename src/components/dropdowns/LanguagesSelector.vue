<script setup lang="ts">
import CheckboxCompnentVue from '@/components/CheckboxCompnent.vue';
import { useFiltersStore } from '@/stores/filters';

defineProps<{ isUp?: boolean; context?: string; availableLanguages: Record<string, string>[] }>();
const filters = useFiltersStore();
</script>
<template>
  <div class="is-flex">
    <div :key="lang.value" class="mx-2 mt-2" v-for="lang in availableLanguages">
      <CheckboxCompnentVue
        :name="lang.value"
        :id="lang.value"
        v-model="filters.languageFilters"
        :value="lang.value"
        :label="$t(`lang.${lang.value}`)"
        :checked="filters.languageFilters.includes(lang.value)"
      >
      </CheckboxCompnentVue>
    </div>
  </div>
</template>

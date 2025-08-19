<script setup lang="ts">
import CheckboxCompnentVue from '@/components/CheckboxCompnent.vue';
import { useFiltersStore } from '@/stores/filters';

const store = useFiltersStore();
</script>
<template>
  <div :key="sdg" class="my-2" v-for="sdg in store.sdgList">
    <CheckboxCompnentVue
      :name="sdg.toString()"
      :id="sdg.toString()"
      v-model="store.sdgFilters"
      :label="`${sdg} - ${$t(`sdgs.${sdg}`)}`"
      :value="`${sdg}`"
      :checked="store.sdgFilters?.includes(sdg)"
    />
  </div>
</template>

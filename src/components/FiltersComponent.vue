<script setup lang="ts">
import GenericPillComponent from '@/components/GenericPillComponent.vue';
import FilterSettingIcon from '@/components/icons/FilterSettingIcon.vue';
import ChevronDownIcon from '@/components/icons/ChevronDown.vue';
import ChevronUpIcon from '@/components/icons/ChevronUp.vue';
import SDGSelector from '@/components/dropdowns/SDGSelector.vue';
import SourcesSelector from '@/components/dropdowns/SourcesSelector.vue';
import { useFiltersStore } from '@/stores/filters';
import { ref } from 'vue';

const visibleFilters = ref(true);
const filters = useFiltersStore();
const toggleFilters = () => (visibleFilters.value = !visibleFilters.value);

const clearFilters = () => {
  filters.handleResetFilters();
};
</script>
<template>
  <div
    class="is-clickable is-flex is-align-items-center is-align-content-center mt-4 mb-5"
    @click="toggleFilters"
  >
    <FilterSettingIcon class="mr-4" />
    <span class="is-flex is-align-items-center is-size-6">{{ $t('searchFilters') }}</span>
    <div class="chevron-icon">
      <ChevronUpIcon class="ml-2" v-if="visibleFilters" />
      <ChevronDownIcon class="ml-2" v-else />
    </div>
  </div>
  <div v-if="filters.hasFilters" class="is-flex">
    <div class="is-flex is-flex-direction-column">
      <div class="is-flex flex-wrap selection mb-1" v-if="filters.sourcesFilters.length">
        <p>{{ $t('sources') }}{{ $t(':') }}</p>
        <GenericPillComponent
          class="mx-1 is-capitalized"
          bgColor="primary"
          :key="filter"
          v-for="filter in filters.sourcesFilters"
          :content="`${$t(`corpus.${filter.replace('-', ' ')}`, `${filter.replace('-', ' ')}`)}`"
        >
          <template #actions>
            <span class="is-clickable" @click="filters.handleSourcesFilterChange(filter)"> x </span>
          </template>
        </GenericPillComponent>
      </div>
      <div class="is-flex flex-wrap selection mb-1" v-if="filters.sdgFilters.length">
        <p>{{ $t('sdgsAcronym') }}{{ $t(':') }}</p>
        <GenericPillComponent
          class="mx-1"
          bgColor="primary"
          :key="filter"
          v-for="filter in filters.sdgFilters"
          :content="filter"
        >
          <template #actions>
            <span class="is-clickable" @click="filters.handleSdgFilterChange(filter)"> x </span>
          </template>
        </GenericPillComponent>
      </div>
    </div>
    <p class="ml-auto mr-6 remove-all" @click="clearFilters">{{ $t('removeAll') }}</p>
  </div>
  <p v-else>
    <span class="has-text-grey">{{ $t('noFiltersSelected') }}</span>
  </p>
  <div :class="{ hide: !visibleFilters }" class="pr-5 filters">
    <input class="input" type="text" :placeholder="$t('searchBarPlaceholder')" />

    <details class="filter-section" open>
      <summary>{{ $t('sources') }}</summary>
      <div class="filter-options">
        <SourcesSelector />
      </div>
    </details>
    <details class="filter-section" open>
      <summary>{{ $t('sdgsAcronym') }}</summary>
      <div class="filter-options">
        <SDGSelector />
      </div>
    </details>
  </div>
</template>

<style scoped>
.selection {
  flex-wrap: wrap;
}
.chevron-icon {
  height: 1.5rem;
  width: 1.5rem;
}
.remove-all {
  cursor: pointer;
  color: var(--primary-60);
  font-weight: bold;
  font-size: 0.875rem;
  width: 6rem;
  white-space: nowrap;
}
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
  padding-left: 1rem;
}
</style>

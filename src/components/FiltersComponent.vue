<script setup lang="ts">
import GenericPillComponent from '@/components/GenericPillComponent.vue';
import FilterSettingIcon from '@/components/icons/FilterSettingIcon.vue';
import ChevronDownIcon from '@/components/icons/ChevronDown.vue';
import ChevronUpIcon from '@/components/icons/ChevronUp.vue';
import SDGSelector from '@/components/dropdowns/SDGSelector.vue';
import SourcesSelector from '@/components/dropdowns/SourcesSelector.vue';
import LanguagesSelector from '@/components/dropdowns/LanguagesSelector.vue';
import { useFiltersStore } from '@/stores/filters';
import { useSourcesStore } from '@/stores/sources';
import { computed, watch, toRefs } from 'vue';

const props = defineProps<{
  shouldClose?: boolean;
}>();

const sourcesStore = useSourcesStore();
const { shouldClose } = toRefs(props);

const filters = useFiltersStore();
const hideFilters = computed(() => !filters.panelOpen);
watch(shouldClose, (close) => {
  if (close) {
    filters.panelOpen = false;
  }
});

const toggleFilters = () => (filters.panelOpen = !filters.panelOpen);
const syncSection = (key: 'sources' | 'sdgs' | 'languages', e: Event) =>
  (filters.openSections[key] = (e.target as HTMLDetailsElement).open);

const activeCount = computed(
  () => filters.sourcesFilters.length + filters.sdgFilters.length + filters.languageFilters.length
);

const clearFilters = () => {
  filters.handleResetFilters();
};
</script>
<template>
  <!-- two-line header (like a list item with a leading icon): the icon spans and centres on
       title + status line; the status line stays outside the collapsible part so count + clear are always visible -->
  <div class="filters-head">
    <FilterSettingIcon class="head-icon" aria-hidden="true" @click="toggleFilters" />
    <button
      type="button"
      class="filters-toggle"
      :aria-expanded="!hideFilters"
      @click="toggleFilters"
    >
      <span>{{ $t('searchFilters') }}</span>
      <ChevronUpIcon class="chevron-icon" v-if="!hideFilters" />
      <ChevronDownIcon class="chevron-icon" v-else />
    </button>
    <p class="status-line">
      <template v-if="filters.hasFilters">
        <span>{{ $t('filtersSelected', activeCount) }}</span>
        <span aria-hidden="true">·</span>
        <button class="remove-all" :aria-label="$t('clearFilters')" @click="clearFilters">
          {{ $t('removeAll') }}
        </button>
      </template>
      <span v-else class="has-text-grey">{{ $t('noFiltersSelected') }}</span>
    </p>
  </div>
  <!-- phones: when the panel is collapsed the status line is the summary, the pills would eat the screen -->
  <div v-if="filters.hasFilters" class="is-flex pills" :class="{ 'pills-collapsed': hideFilters }">
    <div class="is-flex is-flex-direction-column">
      <div class="is-flex flex-wrap selection mb-1" v-if="filters.sourcesFilters.length">
        <p>{{ $t('sources') }}{{ $t(':') }}</p>
        <GenericPillComponent
          class="mx-1 is-capitalized mt-1"
          bgColor="primary"
          :key="filter"
          v-for="filter in filters.sourcesFilters"
          :content="`${$t(`corpus.${filter}`, `${filter.replace('-', ' ')}`)}`"
        >
          <template #actions>
            <button
              class="remove-pill"
              :aria-label="$t('removeSelection')"
              @click="filters.handleSourcesFilterChange(filter)"
            >
              ×
            </button>
          </template>
        </GenericPillComponent>
      </div>
      <div class="is-flex flex-wrap selection mb-1" v-if="filters.sdgFilters.length">
        <p>{{ $t('sdgsAcronym') }}{{ $t(':') }}</p>
        <GenericPillComponent
          class="mx-1 mt-1"
          bgColor="primary"
          :key="filter"
          v-for="filter in filters.sdgFilters"
          :content="filter.toString()"
        >
          <template #actions>
            <button
              class="remove-pill"
              :aria-label="$t('removeSelection')"
              @click="filters.handleSdgFilterChange(filter)"
            >
              ×
            </button>
          </template>
        </GenericPillComponent>
      </div>
      <div class="is-flex flex-wrap selection mb-1" v-if="filters.languageFilters.length">
        <p>{{ $t('languages') }}{{ $t(':') }}</p>
        <GenericPillComponent
          class="mx-1"
          bgColor="primary"
          :key="filter"
          v-for="filter in filters.languageFilters"
          :content="$t(`lang.${filter}`, `${filter}`)"
        >
          <template #actions>
            <button
              class="remove-pill"
              :aria-label="$t('removeSelection')"
              @click="filters.handleLanguageFilterChange(filter)"
            >
              ×
            </button>
          </template>
        </GenericPillComponent>
      </div>
    </div>
  </div>
  <div :class="{ hide: hideFilters }" class="pr-5 filters">
    <details
      class="filter-section"
      :open="filters.openSections.sources"
      @toggle="syncSection('sources', $event)"
    >
      <summary>{{ $t('sources') }}</summary>
      <div class="filter-options">
        <SourcesSelector :availableSources="sourcesStore.sourcesList || {}" />
      </div>
    </details>
    <details
      class="filter-section"
      :open="filters.openSections.sdgs"
      @toggle="syncSection('sdgs', $event)"
    >
      <summary>{{ $t('sdgsAcronym') }}</summary>
      <div class="filter-options">
        <SDGSelector />
      </div>
    </details>
    <details
      class="filter-section"
      :open="filters.openSections.languages"
      @toggle="syncSection('languages', $event)"
    >
      <summary>{{ $t('languages') }}</summary>
      <div class="filter-options">
        <LanguagesSelector :availableLanguages="filters.languageList" />
      </div>
    </details>
  </div>
</template>

<style scoped>
.remove-pill {
  all: unset;
  cursor: pointer;
  margin-left: 0.25rem;
  font-size: 1rem;
  line-height: 1;
}
.remove-pill:focus-visible {
  outline: 2px solid currentColor;
}
.selection {
  flex-wrap: wrap;
}
.filters-head {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 0.75rem;
  row-gap: 0.125rem;
  align-items: center;
  margin: 1rem 0;
}
.head-icon {
  grid-row: 1 / span 2;
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
}
.filters-toggle {
  all: unset;
  cursor: pointer;
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
}
/* desktop: keep clear of the sidebar open/close button pinned to the panel's top-right */
@media (min-width: 992px) {
  .filters-toggle {
    max-width: calc(100% - 4rem);
  }
}
.chevron-icon {
  flex-shrink: 0;
  height: 1.25rem;
  width: 1.25rem;
}
.remove-all {
  all: unset;
  cursor: pointer;
  color: var(--primary-dark);
  font-size: 0.875rem;
  white-space: nowrap;
  &:hover,
  &:focus-visible {
    text-decoration: underline;
  }
}
/* sits in the grid's second column, under the "Search filters" label, so it reads as its subtitle */
.status-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}
@media (max-width: 991px) {
  .pills-collapsed {
    display: none !important;
  }
}
.filters {
  max-height: 90%;
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
  max-height: 100%;
}

details > .filter-options {
  max-height: 100%;
  overflow-y: auto;
  padding-left: 1rem;
}
</style>

<script setup lang="ts">
import GenericPillComponent from '@/components/GenericPillComponent.vue';
import FilterSettingIcon from '@/components/icons/FilterSettingIcon.vue';
import ChevronDownIcon from '@/components/icons/ChevronDown.vue';
import ChevronUpIcon from '@/components/icons/ChevronUp.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';
import SDGSelector from '@/components/dropdowns/SDGSelector.vue';
import SourcesSelector from '@/components/dropdowns/SourcesSelector.vue';
import LanguagesSelector from '@/components/dropdowns/LanguagesSelector.vue';
import { useFiltersStore } from '@/stores/filters';
import { useSourcesStore } from '@/stores/sources';
import { computed, watch, toRefs } from 'vue';
import { idToLabel } from '@/utils/strings';

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
      <span v-else>{{ $t('noFiltersSelected') }}</span>
    </p>
  </div>
  <!-- phones: when the panel is collapsed the status line is the summary, the chips would eat the screen -->
  <div v-if="filters.hasFilters" class="pills" :class="{ 'pills-collapsed': hideFilters }">
    <div class="selection" v-if="filters.sourcesFilters.length">
      <span class="selection-label">{{ $t('sources') }}</span>
      <GenericPillComponent
        class="is-capitalized"
        :key="filter"
        v-for="filter in filters.sourcesFilters"
        :content="$t(`corpus.${filter}`, idToLabel(filter))"
      >
        <template #actions>
          <button
            class="remove-pill"
            :aria-label="$t('removeSelection')"
            @click="filters.handleSourcesFilterChange(filter)"
          >
            <CloseIcon />
          </button>
        </template>
      </GenericPillComponent>
    </div>
    <div class="selection" v-if="filters.sdgFilters.length">
      <span class="selection-label">{{ $t('sdgsAcronym') }}</span>
      <GenericPillComponent
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
            <CloseIcon />
          </button>
        </template>
      </GenericPillComponent>
    </div>
    <div class="selection" v-if="filters.languageFilters.length">
      <span class="selection-label">{{ $t('languages') }}</span>
      <GenericPillComponent
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
            <CloseIcon />
          </button>
        </template>
      </GenericPillComponent>
    </div>
  </div>
  <div :class="{ hide: hideFilters }" class="filters">
    <details
      class="filter-section"
      :open="filters.openSections.sources"
      @toggle="syncSection('sources', $event)"
    >
      <summary>
        {{ $t('sources') }}
        <ChevronDownIcon class="summary-chevron" />
      </summary>
      <div class="filter-options">
        <SourcesSelector :availableSources="sourcesStore.sourcesList || {}" />
      </div>
    </details>
    <details
      class="filter-section"
      :open="filters.openSections.sdgs"
      @toggle="syncSection('sdgs', $event)"
    >
      <summary>
        {{ $t('sdgsAcronym') }}
        <ChevronDownIcon class="summary-chevron" />
      </summary>
      <div class="filter-options">
        <SDGSelector />
      </div>
    </details>
    <details
      class="filter-section"
      :open="filters.openSections.languages"
      @toggle="syncSection('languages', $event)"
    >
      <summary>
        {{ $t('languages') }}
        <ChevronDownIcon class="summary-chevron" />
      </summary>
      <div class="filter-options">
        <LanguagesSelector :availableLanguages="filters.languageList" />
      </div>
    </details>
  </div>
</template>

<style scoped>
.filters-head {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 0.75rem;
  row-gap: 0.125rem;
  align-items: center;
  margin: 1rem 0 0.75rem;
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
  gap: 0.375rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--neutral-90);
  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
}
.chevron-icon {
  flex-shrink: 0;
  height: 0.875rem;
  width: 0.875rem;
  color: var(--neutral-70);
}
/* second grid column: sits under the title text, reads as its subtitle */
.status-line {
  grid-column: 2;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  color: var(--neutral-70);
}
.remove-all {
  all: unset;
  cursor: pointer;
  color: var(--primary-dark);
  font-weight: 500;
  white-space: nowrap;
  &:hover,
  &:focus-visible {
    text-decoration: underline;
  }
}

/* selected filters: one row per kind, label then chips, all centred on one line */
.pills {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.selection {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
}
.selection-label {
  min-width: 4.5rem;
  font-size: 0.8rem;
  color: var(--neutral-70);
}
.remove-pill {
  all: unset;
  display: flex;
  padding: 0.125rem;
  border-radius: 50%;
  color: var(--neutral-70);
  cursor: pointer;
  &:hover {
    background-color: var(--neutral-20);
    color: var(--neutral-100);
  }
  &:focus-visible {
    outline: 2px solid var(--primary-dark);
  }
}
.remove-pill :deep(svg) {
  width: 0.75rem;
  height: 0.75rem;
}
/* options read smaller than their section and category titles */
.filter-options :deep(.checkbox-label) {
  font-size: 0.875rem;
}
@media (max-width: 991px) {
  .pills-collapsed {
    display: none !important;
  }
}

/* no scroll of its own: the side panel is the one scroller, nested scrollers made the wheel stick at the ends */
.filters {
  transition: opacity 0.3s;
}
.filters.hide {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

/* sections: light rows split by hairlines, chevron on the right */
.filter-section {
  border-top: 1px solid var(--neutral-15);
}
.filter-section:last-child {
  border-bottom: 1px solid var(--neutral-15);
}
summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0.25rem;
  list-style: none;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--neutral-90);
  cursor: pointer;
  &::-webkit-details-marker {
    display: none;
  }
  &:hover {
    color: var(--neutral-100);
  }
  &:focus-visible {
    outline: 2px solid var(--primary-dark);
    outline-offset: -2px;
    border-radius: 0.25rem;
  }
}
.summary-chevron {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--neutral-70);
  transition: transform 0.2s;
}
details[open] > summary .summary-chevron {
  transform: rotate(180deg);
}
details > .filter-options {
  padding: 0 0.25rem 0.75rem;
}
</style>

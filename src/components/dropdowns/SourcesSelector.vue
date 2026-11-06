<script setup lang="ts">
import CheckboxCompnentVue from '@/components/CheckboxCompnent.vue';
import ChevronDownIcon from '@/components/icons/ChevronDown.vue';
import ChevronUpIcon from '@/components/icons/ChevronUp.vue';
import LineIcon from '@/components/icons/LineIcon.vue';
import { useFiltersStore } from '@/stores/filters';
import type { Corpus } from '@/types';
import { idToLabel } from '@/utils/strings';

defineProps<{ isUp?: boolean; context?: string; availableSources: Record<string, Corpus[]> }>();
const filters = useFiltersStore();

const names = (sources: Corpus[]) => sources.map((source) => source.name);
const selectedCount = (sources: Corpus[]) =>
  sources.filter((source) => filters.sourcesFilters.includes(source.name)).length;

// categories are open by default; the chevron folds them (ticking the category never does)
const folded = filters.foldedCategories;
</script>
<template>
  <div v-for="(sources, category) in availableSources" :key="category" class="category">
    <div class="category-row">
      <CheckboxCompnentVue
        class="category-checkbox"
        :name="`all-${category}`"
        :id="`all-${category}`"
        :value="`${category}`"
        :modelValue="selectedCount(sources) === sources.length ? [`${category}`] : []"
        label=""
        :checked="selectedCount(sources) === sources.length"
        :isIndeterminate="selectedCount(sources) > 0 && selectedCount(sources) < sources.length"
        @selectAll="filters.toggleCategorySources(names(sources))"
      >
        <template #test>
          <!-- same icon as on the result cards -->
          <LineIcon class="category-icon" :name="`${category}`" />
          <span class="category-name">{{ $t(`categories.${category}`) }}</span>
        </template>
      </CheckboxCompnentVue>
      <span class="count">{{ selectedCount(sources) }}/{{ sources.length }}</span>
      <button
        class="fold"
        :aria-expanded="!folded[category]"
        :aria-label="$t(`categories.${category}`)"
        @click="folded[category] = !folded[category]"
      >
        <ChevronDownIcon v-if="folded[category]" />
        <ChevronUpIcon v-else />
      </button>
    </div>

    <div v-show="!folded[category]" class="category-sources">
      <div v-for="source in sources" :key="source.name">
        <CheckboxCompnentVue
          :name="source.name"
          :id="source.name"
          v-model="filters.sourcesFilters"
          :value="source.name"
          :label="$t(`corpus.${source.name}`, idToLabel(source.name))"
          :checked="filters.sourcesFilters.includes(source.name)"
          isCapitalized
        >
        </CheckboxCompnentVue>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category {
  margin-top: 0.5rem;
}

.category-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.category-checkbox {
  flex: 1;
  min-width: 0;
  /* the label text lives in the slot, drop the empty default label */
  :deep(.checkbox-label > p:empty) {
    display: none;
  }
}

/* tighter gap so the category name lines up with its sources' checkboxes */
.category-row .category-checkbox {
  padding-left: 1.25rem;
}

.category-icon {
  margin-right: 0.5rem;
  color: var(--neutral-70);
}

.category-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--neutral-90);
}

.count {
  font-size: 0.75rem;
  color: var(--neutral-70);
  font-variant-numeric: tabular-nums;
}

.fold {
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  color: var(--neutral-70);
  cursor: pointer;
  border-radius: 0.25rem;
  &:hover {
    background-color: var(--neutral-10);
  }
  &:focus-visible {
    outline: 2px solid var(--primary);
  }
}

.fold :deep(svg) {
  width: 0.75rem;
  height: 0.75rem;
}

.category-sources {
  padding-left: 2.25rem;
}
</style>

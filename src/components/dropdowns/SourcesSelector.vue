<script setup lang="ts">
import CheckboxCompnentVue from '@/components/CheckboxCompnent.vue';
import ChevronDownIcon from '@/components/icons/ChevronDown.vue';
import ChevronUpIcon from '@/components/icons/ChevronUp.vue';
import { useFiltersStore } from '@/stores/filters';
import type { Corpus } from '@/types';
import { ref } from 'vue';

defineProps<{ isUp?: boolean; context?: string; availableSources: Record<string, Corpus[]> }>();
const filters = useFiltersStore();

const names = (sources: Corpus[]) => sources.map((source) => source.name);
const selectedCount = (sources: Corpus[]) =>
  sources.filter((source) => filters.sourcesFilters.includes(source.name)).length;

// categories are open by default; the chevron folds them (ticking the category never does)
const folded = ref<Record<string, boolean>>({});
</script>
<template>
  <div v-for="(sources, category) in availableSources" :key="category" class="category">
    <!-- data-category: same highlight colour as the matching result cards -->
    <div class="category-row" :data-category="category">
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
          :label="$t(`corpus.${source.name}`, source.name)"
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

.category-name {
  font-weight: bold;
}

.count {
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
}

.fold {
  all: unset;
  display: flex;
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  border-radius: 0.25rem;
  &:hover {
    background-color: rgb(0 0 0 / 8%);
  }
  &:focus-visible {
    outline: 2px solid var(--primary);
  }
}

.category-sources {
  padding-left: 2.25rem;
}
</style>

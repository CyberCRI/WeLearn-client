<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { useBookmarksStore } from '@/stores/bookmarks';
import { useSourcesStore } from '@/stores/sources';
import SourcesListComponent from '@/components/SourcesListComponent.vue';
import DeleteButton from '@/components/DeleteButton.vue';
import ChevronDown from '@/components/icons/ChevronDown.vue';
import ChevronUp from '@/components/icons/ChevronUp.vue';
import type { Document } from '@/types';

const bookmarksStore = useBookmarksStore();
const sourcesStore = useSourcesStore();

onMounted(() => {
  bookmarksStore.getBookmarks();
});

const bookmarksByCategory = computed(() => {
  const grouped: Record<string, Document[]> = {};

  for (const doc of bookmarksStore.sourcesBookmarked) {
    const category = sourcesStore.sourceCategoryMap[doc.payload.document_corpus] ?? 'null';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(doc);
  }

  return Object.fromEntries(Object.entries(grouped).sort(([, a], [, b]) => b.length - a.length));
});

const closedCategories = ref<Set<string>>(new Set());

watch(
  bookmarksByCategory,
  () => {
    closedCategories.value = new Set();
  },
  { immediate: true }
);

const toggle = (category: string) => {
  const next = new Set(closedCategories.value);
  next.has(category) ? next.delete(category) : next.add(category);
  closedCategories.value = next;
};

const isOpen = (category: string) => !closedCategories.value.has(category);
</script>

<template>
  <div class="bookmarks" v-if="bookmarksStore.sourcesBookmarked.length">
    <div class="bookmarks-header">
      <span class="bookmarks-count">
        {{ bookmarksStore.bookmarkedLength }}
        {{ bookmarksStore.bookmarkedLength === 1 ? $t('bookmarkSingular') : $t('bookmarks') }}
      </span>
      <DeleteButton :action="bookmarksStore.resetBookmarks" :delText="$t('clearBookmarks')" />
    </div>

    <div class="category-section" v-for="(docs, category) in bookmarksByCategory" :key="category">
      <button class="category-header" @click="toggle(String(category))">
        <span class="category-name">{{ $t(`categories.${category}`) }}</span>
        <span class="category-badge">{{ docs.length }}</span>
        <ChevronUp v-if="isOpen(String(category))" class="chevron" />
        <ChevronDown v-else class="chevron" />
      </button>

      <div v-if="isOpen(String(category))" class="category-content">
        <SourcesListComponent
          hideRefIndicator
          hideSteps
          :sourcesList="docs"
          :shouldDisplayScore="false"
          :isFetchingSources="false"
          :isSourcesError="false"
          :noResults="false"
        />
      </div>
    </div>
  </div>

  <div v-else class="empty" data-testid="noBookmarks">
    <h1 class="title is-2 is-size-5-mobile">{{ $t('noBookmarks') }}</h1>
  </div>
</template>

<style scoped>
.bookmarks {
  display: flex;
  flex-direction: column;
  margin: 1.5rem auto;
  width: 80%;
  gap: 0.5rem;
}

.bookmarks-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5rem 0.75rem;
  border-bottom: 1px solid var(--neutral-20);
  margin-bottom: 0.5rem;
}

.bookmarks-count {
  font-size: 0.875rem;
  color: var(--neutral-60, #666);
}

.category-section {
  border: 1px solid var(--neutral-20);
  border-radius: 6px;
  overflow: hidden;
}

.category-header {
  all: unset;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1rem;
  cursor: pointer;
  background: var(--neutral-0);
  box-sizing: border-box;
  transition: background 0.15s;
}

.category-header:hover {
  background: var(--neutral-10);
}

.category-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--neutral-80);
  flex: 1;
}

.category-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--neutral-0);
  background: var(--primary);
  border-radius: 10px;
  padding: 0.1rem 0.55rem;
  min-width: 1.4rem;
  text-align: center;
}

.chevron {
  width: 0.75rem;
  height: 0.75rem;
  color: var(--neutral-60, #666);
  flex-shrink: 0;
}

.category-content {
  border-top: 1px solid var(--neutral-20);
  padding: 0.25rem 0;
}

.empty {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

@media screen and (max-width: 768px) {
  .bookmarks {
    width: 100%;
  }
}
</style>

<script setup lang="ts">
import { useBookmarksStore } from '@/stores/bookmarks';
import SourcesListComponent from '@/components/SourcesListComponent.vue';
import DeleteButton from '@/components/DeleteButton.vue';

const store = useBookmarksStore();
</script>

<template>
  <div class="bookmarks" v-if="store.sourcesBookmarked.length">
    <div class="clear">
      <DeleteButton
        v-if="store.bookmarkedLength"
        :action="store.resetBookmarks"
        :delText="$t('clearBookmarks')"
      />
    </div>

    <SourcesListComponent
      hideRefIndicator
      :sourcesList="store.sourcesBookmarked"
      :shouldDisplayScore="false"
      :isFetchingSources="false"
      :isSourcesError="false"
      :fetchingAnswer="false"
      :noResults="false"
    />
  </div>
  <div v-else class="empty">
    <h1 class="title is-1">{{ $t('noBookmarks') }}</h1>
  </div>
</template>

<style scoped>
.bookmarks {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 3rem 0 1rem;
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.clear {
  display: flex;
  align-self: flex-end;
  width: 7em;
  padding-top: 1rem;
  color: var(--tertiary);
  cursor: pointer;
}
</style>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useBookmarksStore } from '@/stores/bookmarks';
import SourcesListComponent from '@/components/SourcesListComponent.vue';
import DeleteButton from '@/components/DeleteButton.vue';

const store = useBookmarksStore();
onMounted(() => {
  store.getBookmarks();
});
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
  <div v-else class="empty" data-testid="noBookmarks">
    <h1 class="title is-2 is-size-5-mobile">{{ $t('noBookmarks') }}</h1>
  </div>
</template>

<style scoped>
.bookmarks {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem auto;
  width: 80%;
}

.empty {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: auto;
}

.clear {
  display: flex;
  align-self: flex-end;
  padding-right: 1rem;
  padding-top: 1rem;
  color: var(--tertiary);
  cursor: pointer;
}

@media screen and (max-width: 768px) {
  .bookmarks {
    width: 100%;
  }
}
</style>

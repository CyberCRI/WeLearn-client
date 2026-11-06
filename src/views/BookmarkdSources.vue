<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useBookmarksStore } from '@/stores/bookmarks';
import SourcesListComponent from '@/components/SourcesListComponent.vue';
import DeleteButton from '@/components/DeleteButton.vue';
import ModalComponent from '@/components/ModalComponent.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';

const store = useBookmarksStore();
const confirmClear = ref(false);

const clearBookmarks = () => {
  store.resetBookmarks();
  confirmClear.value = false;
};
// don't show the empty state while the bookmarks are still loading
const isLoading = ref(true);
onMounted(async () => {
  await store.getBookmarks();
  isLoading.value = false;
});
</script>

<template>
  <div class="bookmarks" v-if="store.sourcesBookmarked.length">
    <div class="clear">
      <DeleteButton
        v-if="store.bookmarkedLength"
        :action="() => (confirmClear = true)"
        :delText="$t('clearBookmarks')"
      />
    </div>
    <!-- v-if: ModalComponent only reads isOpen on mount -->
    <ModalComponent
      v-if="confirmClear"
      isOpen
      size="small"
      :title="$t('confirmClearBookmarks')"
      :message="$t('cannotBeUndone')"
      :onClose="() => (confirmClear = false)"
    >
      <template #actions>
        <button class="button" @click="confirmClear = false">{{ $t('cancel') }}</button>
        <button class="button is-danger is-light" @click="clearBookmarks">
          {{ $t('clearBookmarks') }}
        </button>
      </template>
    </ModalComponent>

    <SourcesListComponent
      hideRefIndicator
      cardType="simple"
      hideNumber
      :sourcesList="store.sourcesBookmarked"
      :shouldDisplayScore="false"
      :isFetchingSources="false"
      :isSourcesError="false"
      :fetchingAnswer="false"
      :noResults="false"
    />
  </div>
  <div v-else-if="isLoading" class="empty">
    <LoadingComponent />
  </div>
  <div v-else class="empty" data-testid="noBookmarks">
    <h1 class="title is-4 is-size-5-mobile">{{ $t('noBookmarks') }}</h1>
    <p class="hint">{{ $t('noBookmarksHint') }}</p>
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
  margin: 4rem auto 0;
  max-width: 28rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
}

.hint {
  color: var(--neutral-70);
}

.clear {
  display: flex;
  align-self: flex-end;
  padding-right: 1rem;
  padding-top: 1rem;
  color: var(--tertiary);
  cursor: pointer;
}

@media (max-width: 768px) {
  .bookmarks {
    width: 100%;
  }
}
</style>

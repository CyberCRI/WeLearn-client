<script setup lang="ts">
import ToasterComponent from '@/components/ToasterComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';
import { useBookmarksStore } from '@/stores/bookmarks';

const bookmarks = useBookmarksStore();
</script>

<template>
  <!-- in App.vue: a bookmark can be toggled from the chat, the search, the syllabus or the bookmarks page -->
  <div
    v-if="bookmarks.hasBookmarkError"
    class="bookmark-error"
    role="alert"
    data-testid="bookmarkError"
  >
    <ToasterComponent
      level="error"
      headingTag="h2"
      :title="$t('bookmarkError.title')"
      :description="$t('bookmarkError.description')"
    >
      <ButtonComponent
        class="is-small close"
        :aria-label="$t('close')"
        data-testid="closeBookmarkError"
        @click="bookmarks.clearBookmarkError"
      >
        <CloseIcon />
      </ButtonComponent>
    </ToasterComponent>
  </div>
</template>

<style scoped>
.bookmark-error {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 40;
  width: min(32rem, calc(100% - 2rem));
}

.bookmark-error :deep(.toaster) {
  position: relative;
  padding-right: 3rem;
}

.close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>

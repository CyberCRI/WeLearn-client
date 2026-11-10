<template>
  <div class="bookmark">
    <!-- flex: a plain block would reserve a full text line and push the icon up -->
    <div
      class="toggle"
      @click.stop="toggleBookmark()"
      :class="isBookmarked && 'bookmarked'"
      data-testid="toggleBookmark"
    >
      <Bookmark class="icon is-small" :filled="isBookmarked" />
    </div>

    <TooltipComponent
      class="tltip"
      :tooltipText="isBookmarked ? $t('cardArticle.removeBookmark') : $t('cardArticle.addBookmark')"
    />
  </div>
</template>
<script setup lang="ts">
import Bookmark from './icons/BookmarkIcon.vue';
import TooltipComponent from './TooltipComponent.vue';

defineProps<{
  toggleBookmark: () => void;
  isBookmarked: boolean;
}>();
</script>

<style scoped>
.tltip {
  display: none;
}

:is(.bookmark):has(.tltip) {
  &:hover {
    .tltip {
      display: block;
    }
  }
}
.toggle {
  display: flex;
}
.icon {
  color: var(--neutral-80);
}

.bookmarked {
  animation: pop-in 0.5s;
}
@keyframes pop-in {
  0% {
    opacity: 0;
    transform: scale(0.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

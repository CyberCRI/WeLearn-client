<script setup lang="ts">
import BookmarkComponent from '@/components/BookmarkComponent.vue';
import { useBookmarksStore } from '@/stores/bookmarks';
import { sourceLink, type SupportingResource } from '@/utils/connections';
import { idToLabel } from '@/utils/strings';

// the WeLearn resources behind a suggestion, kept light: the title (opening the original at the
// quoted passage), where it comes from and what it brings; the passage it was chosen for one click
// away, shortened when long (the whole passage on hover). the checks behind them are unchanged
defineProps<{ resources: SupportingResource[] }>();
const bookmarks = useBookmarksStore();

const MAX_QUOTE = 220;
const shortQuote = (quote: string) => {
  if (quote.length <= MAX_QUOTE) return quote;
  const cut = quote.slice(0, MAX_QUOTE);
  return `${cut.slice(0, cut.lastIndexOf(' ') > 0 ? cut.lastIndexOf(' ') : MAX_QUOTE)}…`;
};
</script>

<template>
  <ul class="resource-list">
    <li
      v-for="resource in resources"
      :key="resource.document.payload.document_id"
      data-testid="resource"
    >
      <div class="resource-head">
        <a
          :href="sourceLink(resource.document, resource.evidence)"
          target="_blank"
          rel="noopener"
          class="resource-title"
          data-testid="resource-title"
          >{{ resource.document.payload.document_title }}</a
        >
        <BookmarkComponent
          :isBookmarked="bookmarks.isBookmarked(resource.document.payload.document_id)"
          :toggleBookmark="() => bookmarks.toggleBookmark(resource.document)"
        />
      </div>
      <p class="source" data-testid="resource-source">
        {{
          resource.document.payload.document_details?.journal ||
          resource.document.payload.document_details?.publisher ||
          $t(
            `corpus.${resource.document.payload.document_corpus}`,
            idToLabel(resource.document.payload.document_corpus)
          )
        }}
      </p>
      <p class="usefulness" data-testid="usefulness">{{ resource.usefulness }}</p>
      <!-- the passage it was chosen for: on request, not read by default -->
      <details class="passage">
        <summary>{{ $t('tutor.additions.passage') }}</summary>
        <q class="excerpt" :title="resource.evidence" data-testid="excerpt">{{
          shortQuote(resource.evidence)
        }}</q>
      </details>
    </li>
  </ul>
</template>

<style scoped>
.resource-list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin-top: 0.5rem;
}

.resource-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.resource-title {
  font-weight: 600;
}

.source {
  font-size: 0.8rem;
  font-style: italic;
  color: var(--neutral-70);
}

.usefulness {
  margin-top: 0.25rem;
  font-size: 0.9rem;
  color: var(--neutral-80);
}

.passage {
  margin-top: 0.15rem;
  font-size: 0.8rem;
  color: var(--neutral-70);
  summary {
    cursor: pointer;
  }
}

.excerpt {
  display: block;
  margin-top: 0.2rem;
  padding-left: 0.6rem;
  border-left: 3px solid var(--neutral-20);
  font-size: 0.85rem;
  font-style: italic;
  color: var(--neutral-70);
}
</style>

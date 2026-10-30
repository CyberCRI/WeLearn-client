<script setup lang="ts">
import CardSimpleComponent from '@/components/CardSimpleComponent.vue';
import { useBookmarksStore } from '@/stores/bookmarks';
import { sourceLink, type SupportingResource } from '@/utils/connections';

// WeLearn resources backing a suggestion (a sustainability connection, an activity): each one's
// card, with what it brings in one sentence and, for an activity, the kind of material it is
defineProps<{ resources: (SupportingResource & { material?: string })[] }>();
const bookmarks = useBookmarksStore();
</script>
<template>
  <ul class="resource-list" data-testid="resources">
    <li v-for="resource in resources" :key="resource.document.payload.document_id">
      <CardSimpleComponent
        :title="resource.document.payload.document_title"
        :corpus="resource.document.payload.document_corpus"
        :url="sourceLink(resource.document, resource.evidence)"
        :details="resource.document.payload.document_details"
        :sdg="resource.document.payload.document_sdg"
        :toggleBookmark="() => bookmarks.toggleBookmark(resource.document)"
        :isBookmarked="bookmarks.isBookmarked(resource.document.payload.document_id)"
      />
      <p class="usefulness" data-testid="usefulness">
        <span v-if="resource.material" class="material" data-testid="material">
          {{ $t(`journey.teach.activity.materials.${resource.material}`) }}
        </span>
        {{ resource.usefulness }}
      </p>
      <blockquote v-if="resource.evidence" class="excerpt" data-testid="excerpt">
        « {{ resource.evidence }} »
      </blockquote>
    </li>
  </ul>
</template>

<style scoped>
.resource-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.usefulness {
  margin-top: 0.25rem;
  padding-left: 0.75rem;
  border-left: 3px solid var(--neutral-20);
  font-size: 0.9rem;
  color: var(--neutral-80);
}

.excerpt {
  margin-top: 0.25rem;
  padding-left: 0.75rem;
  font-size: 0.85rem;
  font-style: italic;
  color: var(--neutral-70);
}

.material {
  margin-right: 0.35rem;
  padding: 0 0.4rem;
  border-radius: 4px;
  background: var(--neutral-10);
  font-size: 0.8rem;
  font-weight: 600;
}
</style>

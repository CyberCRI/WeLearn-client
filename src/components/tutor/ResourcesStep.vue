<script setup lang="ts">
// forked from SecondStep.vue, which stays as-is for the hidden /tutor_test page
import { type Document } from '@/types';
import CardSimpleComponent from '@/components/CardSimpleComponent.vue';
import Card from '@/components/CardComponent.vue';
import ModalWrapper from '@/components/ModalWrapper.vue';
import { useBookmarksStore } from '@/stores/bookmarks';
import { sourceKey } from '@/stores/tutor';
import { useSourcesStore } from '@/stores/sources';

const props = defineProps<{
  sources?: Document[];
  searchError?: boolean;
  appendSource: (source: Document) => void;
  selectedSources: Document[];
  action: () => Promise<void>;
}>();

const bookmarks = useBookmarksStore();

// by id, like the store's appendSource: the selection may hold other copies of the same documents
const isSelected = (source: Document) =>
  props.selectedSources.some((s) => sourceKey(s) === sourceKey(source));
const sourcesStore = useSourcesStore();
</script>
<template>
  <div class="wrapper">
    <h1 data-testId="documents-list-title" class="title is-4 is-size-5-mobile">
      {{ $t('tutor.resourcesStep.title') }}
    </h1>

    <template v-if="sources && sources.length">
      <p class="subtitle is-6 mt-2">{{ $t('tutor.resourcesStep.description') }}</p>
      <div class="sources">
        <div
          class="source"
          role="checkbox"
          tabindex="0"
          v-for="source in sources"
          :key="sourceKey(source)"
          :aria-checked="isSelected(source)"
          :class="{ selected: isSelected(source) }"
          @click="appendSource(source)"
          @keydown.enter.space.prevent="appendSource(source)"
        >
          <!-- native checkbox for the visual only, the row handles clicks and keyboard -->
          <input
            type="checkbox"
            class="check"
            tabindex="-1"
            aria-hidden="true"
            :checked="isSelected(source)"
          />
          <CardSimpleComponent
            :category="sourcesStore.sourceCategoryMap[source.payload.document_corpus]"
            :title="source.payload.document_title"
            :corpus="source.payload.document_corpus"
            :subCorpus="source.payload.document_sub_corpus"
            :url="source.payload.document_url"
            :details="source.payload.document_details"
            :sdg="source.payload.document_sdg"
            :toggleBookmark="() => bookmarks.toggleBookmark(source)"
            :isBookmarked="bookmarks.isBookmarked(source.payload.document_id)"
          >
            <template #modal="scope">
              <ModalWrapper
                :key="`modal-${source.id}`"
                :isOpen="scope.isOpen"
                :onClose="scope.onClose"
                @click.stop
                @keydown.stop
              >
                <Card
                  :key="`modal-card-${source.id}`"
                  :category="sourcesStore.sourceCategoryMap[source.payload.document_corpus]"
                  :title="source.payload.document_title"
                  :description="source.payload.document_desc"
                  :url="source.payload.document_url"
                  :sdg="source.payload.document_sdg"
                  :details="source.payload.document_details"
                  :corpus="source.payload.document_corpus"
                  :subCorpus="source.payload.document_sub_corpus"
                  :score="source.score"
                  :toggleBookmark="() => bookmarks.toggleBookmark(source)"
                  :isBookmarked="bookmarks.isBookmarked(source.payload.document_id)"
                  :slice="source.payload.slice_content"
                  :externalId="source.payload.document_external_id"
                  hasFullDescription
                />
              </ModalWrapper>
            </template>
          </CardSimpleComponent>
        </div>
      </div>
    </template>

    <div v-else class="empty has-text-centered">
      <p class="title is-5">{{ $t('tutor.resourcesStep.noSources') }}</p>
      <p v-if="searchError" class="has-text-danger">{{ $t('tutor.resourcesStep.searchError') }}</p>
      <p class="mt-2">{{ $t('tutor.resourcesStep.noSourcesDescription') }}</p>
      <img class="image" src="@/assets/no-sources.svg" alt="" />
    </div>

    <div class="step-footer">
      <div v-if="sources && sources.length" class="is-size-7">
        <p class="has-text-weight-bold">
          {{ $t('tutor.resourcesStep.selected', selectedSources.length) }}
        </p>
        <p v-if="!selectedSources.length" class="has-text-grey">
          {{ $t('tutor.resourcesStep.noneHint') }}
        </p>
      </div>
      <button data-testid="tutor-generate-button" class="button is-primary" @click="action">
        {{ $t('tutor.resourcesStep.action') }} →
      </button>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.sources {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--neutral-20);
  border-bottom: 1px solid var(--neutral-20);
}
/* one list, rows split by dividers */
.source {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: var(--neutral-10);
  }
  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: -2px;
  }
}
.source + .source {
  border-top: 1px solid var(--neutral-20);
}
.source.selected {
  background-color: var(--primary-lighter);
}
.check {
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.125rem;
  margin: 0;
  accent-color: var(--primary-dark);
  pointer-events: none;
}
/* the row already has its own padding, hover and dividers */
.source :deep(.source-card) {
  padding: 0;
  &:hover,
  &:focus-within {
    background-color: transparent;
  }
}
.step-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  & > button {
    margin-left: auto;
  }
}
.image {
  margin: 1rem auto;
  width: 100%;
  height: 200px;
}
</style>

<script setup lang="ts">
import { type Document } from '@/types';
import CardSimpleComponent from '@/components/CardSimpleComponent.vue';
import Card from '@/components/CardComponent.vue';
import ModalWrapper from '@/components/ModalWrapper.vue';
defineProps<{
  sources?: Document[];
  disabled?: boolean;
  visible?: boolean;
  appendSource: (source: Document) => void;
  selectedSources: Document[];
}>();
</script>
<template>
  <div class="wrapper" :class="{ disabled: disabled, visible: visible }">
    <div class="sources-wrapper" v-if="sources && sources.length">
      <h1 data-testId="secondStepTitle" class="title is-4">
        3 - {{ $t('tutor.secondStep.title') }}
      </h1>
      <p class="subtitle is-6">{{ $t('tutor.secondStep.description') }}</p>
      <div class="sources">
        <div
          class="source"
          @click="appendSource(source)"
          v-for="source in sources"
          :key="source.id"
          :class="{ selected: selectedSources.includes(source) }"
        >
          <CardSimpleComponent
            :title="source.payload.document_title"
            :corpus="source.payload.document_corpus"
            :url="source.payload.document_url"
            :details="source.payload.document_details"
            :sdg="source.payload.document_sdg"
          >
            <template #modal="scope">
              <ModalWrapper
                :key="`modal-${source.id}`"
                :isOpen="scope.isOpen"
                :onClose="scope.onClose"
              >
                <Card
                  :key="`modal-card-${source.id}`"
                  :title="source.payload.document_title"
                  :description="source.payload.document_desc"
                  :url="source.payload.document_url"
                  :sdg="source.payload.document_sdg"
                  :details="source.payload.document_details"
                  :corpus="source.payload.document_corpus"
                  :score="source.score"
                  :toggleBookmark="() => {}"
                  :isBookmarked="false"
                  :slice="source.payload.slice_content"
                  hasFullDescription
                />
              </ModalWrapper>
            </template>
          </CardSimpleComponent>
        </div>
      </div>
    </div>
    <div v-else class="has-text-centered mt-6">
      <p class="title is-4">{{ $t('tutor.secondStep.noSources') }}</p>
      <p class="subtitle is-6 mt-6">{{ $t('tutor.secondStep.noSourcesDescription') }}</p>
      <img class="image" src="@/assets/no-sources.svg" alt="No sources found" />
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;

  flex-grow: 0;
  flex-basis: 0;
  height: 80%;
  transition: all 0.5s;
  margin-left: 2rem;
  overflow: hidden;
  padding: 5% 0;
}
.wrapper.visible {
  flex-grow: 3;
}
.wrapper.disabled {
  opacity: 0.5;
  flex-grow: 1;
  margin-left: 0;
  margin-top: 1rem;
  transition: flex-grow 0s;
}
.source {
  display: flex;
  cursor: pointer;
}
.sources-wrapper {
  overflow-y: hidden;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.sources {
  overflow-y: auto;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  padding-right: 1rem;
  padding-bottom: 1.5rem;
}
.sources > * {
  width: 100%;
}
.source.selected {
  background-color: var(--neutral-10);
}

.image {
  margin: 2rem auto;
  width: 100%;
  height: 250px;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import type { Document } from '@/types';
import i18n from '@/localisation/i18n';
import Card from '@/components/CardComponent.vue';
import SimpleCard from '@/components/CardSimpleComponent.vue';
import ToasterComponentVue from '@/components/ToasterComponent.vue';
import { useSourcesStore } from '@/stores/sources';
import ModalWrapper from '@/components/ModalWrapper.vue';

const store = useSourcesStore();

const props = defineProps<{
  hideSteps?: boolean;
  sourcesList: Document[] | null;
  isSourcesError: boolean;
  isFetchingSources: boolean;
  fetchingAnswer?: boolean;
  hideRefIndicator?: boolean;
  noResults?: boolean;
  errorCode?: string;
  shouldDisplayScore?: boolean;
  cardType?: 'simple' | 'default';
  hideNumber?: boolean;
}>();

const translatedTotal = ref(
  new Intl.NumberFormat(i18n.global.locale.value).format(store.totalDocs)
);

const Cards = {
  default: Card,
  simple: SimpleCard
};

const ChosenCard = Cards[props.cardType || 'default'];
</script>
<template>
  <div class="sources-list">
    <!-- fetching -->
    <div v-if="!hideSteps && !sourcesList?.length">
      <h2 v-if="noResults">{{ $t('noResults') }}</h2>
      <h2 v-if="isFetchingSources">
        {{ $t('sourcesList.fetching', { docs_nb: translatedTotal }) }}
      </h2>
      <h2 v-else-if="fetchingAnswer">{{ $t('sourcesList.formulatingAnswer') }}</h2>
      <h2 v-else>...</h2>
    </div>
    <!-- results -->

    <div v-if="sourcesList?.length">
      <a id="sourcesAnchor"></a>

      <ChosenCard
        :shouldDisplayScore="shouldDisplayScore"
        :hideRefIndicator="hideRefIndicator"
        v-for="(doc, index) in sourcesList"
        :key="doc.id"
        :number="!hideNumber ? index + 1 : undefined"
        :title="doc.payload.document_title"
        :description="doc.payload.document_desc"
        :url="doc.payload.document_url"
        :sdg="doc.payload.document_sdg"
        :details="doc.payload.document_details"
        :corpus="doc.payload.document_corpus"
        :score="doc.score"
        :toggleBookmark="() => store.toggleBookmark(doc)"
        :isBookmarked="store.isBookmarked(doc.payload.document_id)"
        :slice="doc.payload.slice_content"
      >
        <template #modal="scope">
          <ModalWrapper :key="`modal-${doc.id}`" :isOpen="scope.isOpen" :onClose="scope.onClose">
            <Card
              :key="`modal-card-${doc.id}`"
              :shouldDisplayScore="shouldDisplayScore"
              :hideRefIndicator="hideRefIndicator"
              :title="doc.payload.document_title"
              :description="doc.payload.document_desc"
              :url="doc.payload.document_url"
              :sdg="doc.payload.document_sdg"
              :details="doc.payload.document_details"
              :corpus="doc.payload.document_corpus"
              :score="doc.score"
              :toggleBookmark="() => store.toggleBookmark(doc)"
              :isBookmarked="store.isBookmarked(doc.payload.document_id)"
              :slice="doc.payload.slice_content"
              hasFullDescription
            />
          </ModalWrapper>
        </template>
        <template #onboard> </template>
      </ChosenCard>
    </div>
    <!-- error  -->
    <ToasterComponentVue
      v-if="isSourcesError"
      level="error"
      :title="$t(`error.${errorCode}.title`)"
      :description="$t(`error.${errorCode}.description`)"
    />
  </div>
</template>

<style scoped>
.sources-list {
  position: relative;
}
</style>

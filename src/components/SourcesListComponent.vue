<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Document } from '@/types';
import Card from '@/components/CardComponent.vue';
import SimpleCard from '@/components/CardSimpleComponent.vue';
import ToasterComponentVue from '@/components/ToasterComponent.vue';
import { useSourcesStore } from '@/stores/sources';
import { useMetricsStore } from '@/stores/metrics';
import { useBookmarksStore } from '@/stores/bookmarks';
import ModalWrapper from '@/components/ModalWrapper.vue';
import i18n from '@/localisation/i18n';
import { exportBibliography } from '@/utils/fetch';

const sourcesStore = useSourcesStore();
const metricsStore = useMetricsStore();
const store = useBookmarksStore();

const props = defineProps<{
  hideSteps?: boolean;
  sourcesList: Document[] | [];
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

const Cards = {
  default: Card,
  simple: SimpleCard
};

const ChosenCard = Cards[props.cardType || 'default'];

const isExportingBibliography = ref(false);

const documentIds = computed(() => {
  const ids = props.sourcesList
    .map((doc) => doc.payload.document_id)
    .filter((id): id is string => Boolean(id));

  return [...new Set(ids)];
});


const downloadBlob = (blob: Blob, fileName: string) => {
  const objectUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(objectUrl);
};

const handleBibliographyExport = async () => {
  if (!documentIds.value.length || isExportingBibliography.value) return;

  isExportingBibliography.value = true;

  try {
    const response = await exportBibliography(documentIds.value);
    const fileName = "welearn_bilbiography_export.ris";
    const fileBlob =
      response.data instanceof Blob
        ? response.data
        : new Blob([response.data], { type: response.headers['content-type'] });

    downloadBlob(fileBlob, fileName);
  } catch (error) {
    console.error('Unable to export bibliography:', error);
  } finally {
    isExportingBibliography.value = false;
  }
};
</script>
<template>
  <div class="sources-list">
    <!-- fetching -->
    <div v-if="!hideSteps && !sourcesList?.length">
      <h2 v-if="noResults">{{ $t('noResults') }}</h2>
      <h2 v-if="isFetchingSources">
        {{
          $t('sourcesList.fetching', {
            docs_nb: new Intl.NumberFormat(i18n.global.locale.value).format(
              sourcesStore.totalInQdrant
            )
          })
        }}
      </h2>
      <h2 v-else-if="fetchingAnswer">{{ $t('sourcesList.formulatingAnswer') }}</h2>
    </div>
    <!-- results -->

    <div v-if="sourcesList?.length">
      <a id="sourcesAnchor"></a>

      <div class="sources-list__actions">
        <button
          class="button is-small is-primary"
          :disabled="isExportingBibliography || !documentIds.length"
          @click="handleBibliographyExport"
        >
          {{
            isExportingBibliography
              ? $t('sourcesList.exportingBibliography')
              : $t('sourcesList.exportBibliography')
          }}
        </button>
      </div>

      <ChosenCard
        :category="sourcesStore.sourceCategoryMap[doc.payload.document_corpus]"
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
        :id="doc.payload.document_id"
        :docMetrics="metricsStore.recordClickedDocumentFromchat"
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
  height: auto;
  overflow-y: scroll;
  padding: 0.5rem 0.5rem;
}

.sources-list__actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.75rem;
}
</style>

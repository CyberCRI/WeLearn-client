<script setup lang="ts">
import Pill from './PillComponent.vue';
import TooltipComponent from './TooltipComponent.vue';
import OpenUrlIcon from './icons/OpenUrlIcon.vue';
import LineIcon from './icons/LineIcon.vue';
import SeeDetails from './icons/SeeDetailsIcon.vue';
import { computed, ref } from 'vue';
import BookmarkComponent from './BookmarkComponent.vue';
import type { DocumentDetails } from '@/types';
import { idToLabel } from '@/utils/strings';

const props = defineProps<{
  category?: string;
  number?: number;
  title: string;
  corpus: string;
  subCorpus?: string | null;
  url: string;
  id?: string;
  sdg: number[];
  details: DocumentDetails;
  hideRefIndicator?: boolean;
  shouldDisplayScore?: boolean;
  score?: number;
  toggleBookmark?: () => void;
  isBookmarked?: boolean;
  docMetrics?: (docId: string) => Promise<void>;
}>();

const hasCategory = computed(() => !!props.category && props.category !== 'null');

const isModalActive = ref(false);
// escape is handled by ModalWrapper
const handleModalClose = () => {
  isModalActive.value = false;
};
const handleModalOpen = () => {
  isModalActive.value = true;
};
</script>

<template>
  <!-- a list row: number, then title / source / category, then SDGs and actions -->
  <div class="source-card" data-testid="result-row">
    <span v-if="number" class="number">{{ number }}</span>
    <div class="body">
      <p class="doc-title">{{ title }}</p>
      <p v-if="corpus" class="doc-source">
        <template v-if="subCorpus || details.journal || details.publisher">
          {{
            subCorpus
              ? $t(`corpus.${subCorpus}`, idToLabel(subCorpus))
              : details.journal || details.publisher
          }}
          <span class="via">via</span>
        </template>
        {{ $t(`corpus.${corpus}`, idToLabel(corpus)) }}
      </p>
      <p v-if="hasCategory" class="category">
        <LineIcon :name="category ?? ''" />
        {{ $t(`categories.${category}`) }}
      </p>
      <div class="row-footer">
        <div v-if="(sdg || []).length" class="sdgs">
          <span class="sdgs-label">{{ $t('sdgsAcronym') }}</span>
          <Pill v-for="item in sdg" :key="item" :content="item.toString()" />
        </div>

        <div class="card-actions" data-testid="card-actions" @click.stop>
          <button
            class="icon-wrapper"
            :aria-label="$t('cardArticle.seeDetails')"
            @click.stop="handleModalOpen"
          >
            <SeeDetails class="icon is-small" />
            <TooltipComponent class="tltip" :tooltipText="$t('cardArticle.seeDetails')" />
          </button>

          <BookmarkComponent
            v-if="toggleBookmark"
            class="icon-wrapper"
            :isBookmarked="!!isBookmarked"
            :toggleBookmark="toggleBookmark"
          />
          <a
            class="icon-wrapper"
            target="_blank"
            :href="url"
            :aria-label="$t('cardArticle.openArticle')"
            @click.stop
            @click="docMetrics && id && docMetrics(id)"
          >
            <OpenUrlIcon class="icon is-small" />
            <TooltipComponent class="tltip" :tooltipText="$t('cardArticle.openArticle')" />
          </a>
        </div>
      </div>
    </div>
    <!-- only while open: a hidden copy of every result's full card doubled the page (and its texts) -->
    <slot
      v-if="isModalActive"
      :isOpen="isModalActive"
      :onClose="handleModalClose"
      name="modal"
    ></slot>
  </div>
</template>

<style scoped>
.source-card {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.15s;
  &:hover {
    background-color: var(--neutral-10);
  }
}
/* rows of a list are split by a hairline, so each result reads as its own block */
.source-card + .source-card {
  border-top: 1px solid var(--neutral-15);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

/* sits level with the title's first line */
.number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.375rem;
  height: 1.375rem;
  margin-top: 0.0625rem;
  border-radius: 0.375rem;
  background-color: var(--neutral-10);
  color: var(--neutral-70);
  font-size: 0.75rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.source-card:hover .number {
  background-color: var(--neutral-0);
}

.body {
  flex: 1;
  min-width: 0;
}
.doc-title {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--neutral-90);
}
.doc-source {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: var(--neutral-80);
}
.via {
  color: var(--neutral-70);
}
.category {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.125rem;
  font-size: 0.75rem;
  color: var(--neutral-70);
}
.category svg {
  width: 0.875rem;
  height: 0.875rem;
}

.row-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.sdgs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
}
.sdgs-label {
  margin-right: 0.125rem;
  font-size: 0.75rem;
  color: var(--neutral-70);
}
.sdgs .pill {
  width: 1.25rem;
  height: 1.25rem;
  font-size: 0.7rem;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 0;
  margin-left: auto;
}
/* a real hit area around each icon, not just the 19px glyph */
.icon-wrapper {
  all: unset;
  position: relative;
  display: flex;
  padding: 0.1875rem;
  border-radius: 0.375rem;
  color: var(--neutral-70);
  cursor: pointer;
  &:hover {
    background-color: var(--neutral-15);
    color: var(--neutral-100);
  }
  &:focus-visible {
    outline: 2px solid var(--primary-dark);
  }
  &:hover .tltip {
    display: block;
  }
}
/* mouse and trackpad: actions appear on hover or keyboard focus (their space is kept, so nothing moves);
   touch screens have no hover and always show them */
@media (hover: hover) and (pointer: fine) {
  .card-actions {
    opacity: 0;
    transition: opacity 0.15s;
  }
  .source-card:hover .card-actions,
  .source-card:focus-within .card-actions {
    opacity: 1;
  }
}
</style>

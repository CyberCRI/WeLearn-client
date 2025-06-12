<script setup lang="ts">
import Pill from './PillComponent.vue';
import TooltipComponent from './TooltipComponent.vue';
import OpenUrlIcon from './icons/OpenUrlIcon.vue';
import SeeDetails from './icons/SeeDetailsIcon.vue';
import { ref } from 'vue';
import BookmarkComponent from './BookmarkComponent.vue';
import type { DocumentDetails } from '@/types';

defineProps<{
  number?: number;
  title: string;
  corpus: string;
  url: string;
  sdg: number[];
  details: DocumentDetails;
  hideRefIndicator?: boolean;
  shouldDisplayScore?: boolean;
  score?: number;
  toggleBookmark?: () => void;
  isBookmarked?: boolean;
}>();

const isModalActive = ref(false);
const handleModalClose = () => {
  removeEventListener('keydown', () => {});
  isModalActive.value = false;
};
const handleModalOpen = () => {
  isModalActive.value = true;
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      handleModalClose();
    }
  });
};
</script>

<template>
  <div class="block is-flex is-fullwidth pt-1 py-1 px-1">
    <div class="mr-2 is-size-7 has-text-weight-semibold has-background-light-grey px-1">
      {{ number }}
    </div>
    <div class="is-flex-grow-1">
      <div class="is-flex is-flex-direction-row">
        <p class="is-size-6 has-text-weight-normal is-inline">{{ title }}</p>
      </div>
      <div class="is-flex">
        <div class="is-flex is-flex-direction-column">
          <p v-if="corpus" class="corpus has-text-weight-normal is-italic is-capitalized">
            <span v-if="details.journal || details.publisher"
              >{{ details.journal || details.publisher }} via
            </span>
            {{ $t(`corpus.${corpus}`, corpus) }}
          </p>
          <div class="is-flex is-align-items-center">
            <div class="is-6 mr-2">
              {{ $t('SDGs') }}
            </div>
            <Pill
              class="footer-element mx-1"
              v-for="item in sdg"
              :key="item"
              :content="item.toString()"
              hasGrayScale
            />
          </div>
        </div>

        <div class="card-actions" data-testid="card-actions" @click.stop>
          <div class="icon-wrapper">
            <SeeDetails class="icon is-small" @click.stop="handleModalOpen" />
            <TooltipComponent class="tltip" :tooltipText="$t('cardArticle.seeDetails')" isLeft />
          </div>

          <BookmarkComponent
            v-if="toggleBookmark"
            :isBookmarked="!!isBookmarked"
            :toggleBookmark="toggleBookmark"
          />
          <a class="icon-wrapper" target="_blank" :href="url" @click.stop>
            <OpenUrlIcon class="icon is-small" />
            <TooltipComponent class="tltip" :tooltipText="$t('cardArticle.openArticle')" isLeft />
          </a>
        </div>
      </div>
    </div>
    <slot :isOpen="isModalActive" :onClose="handleModalClose" name="modal"></slot>
  </div>
</template>

<style scoped>
.block.is-flex.is-fullwidth {
  --bulma-block-spacing: 0rem;
  width: 100%;
  &:hover {
    background-color: var(--neutral-10);
  }
}
.card-actions {
  margin-left: auto;
  margin-top: auto;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
}

.default-hidden {
  & > * {
    display: none;
  }
  animation: slideaway 500ms;
  display: none;
}

@keyframes slideaway {
  from {
    display: block;
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.card {
  /* display default-hidden when hover content */
  &:hover {
    .default-hidden {
      & > * {
        display: block;
      }
      display: block;
    }
  }
}

.card-content {
  --bulma-card-content-padding: 0.5rem;
  padding: var(--bulma-card-content-padding);
}
.content {
  border-left: none;
  padding-left: 0;
  margin-left: 0;
}
a {
  all: unset;
  cursor: pointer;
}
.clock-icon {
  height: 1.2rem;
  margin-right: 0.5rem;
}

.corpus {
  text-transform: capitalize;
}
.icon-wrapper {
  color: var(--neutral-80);
}

:is(.icon-wrapper):has(.tltip) {
  &:hover {
    .tltip {
      display: block;
    }
  }
}
</style>

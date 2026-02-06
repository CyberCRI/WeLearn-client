<script setup lang="ts">
import Pill from './PillComponent.vue';
import ClockIcon from './icons/ClockIcon.vue';
import { computed, ref } from 'vue';
import { secondsToMinAndHours } from '@/utils/time';
import type { DocumentDetails } from '@/types';

import BookmarkComponent from './BookmarkComponent.vue';

const isMoreAuthorsHidden = ref(true);

const props = defineProps<{
  number?: number;
  title: string;
  corpus: string;
  description: string;
  url: string;
  sdg: number[];
  details: DocumentDetails;
  hideRefIndicator?: boolean;
  shouldDisplayScore?: boolean;
  score?: number;
  toggleBookmark: () => void;
  isBookmarked: boolean;
  hasFullDescription?: boolean;
  slice?: string;
  id?: string;
  docMetrics?: (docId?: string | undefined) => Promise<void>;
}>();

const toggleShowMoreAuthors = () => {
  isMoreAuthorsHidden.value = !isMoreAuthorsHidden.value;
};

const displayedDescription = computed(() => {
  if (props.hasFullDescription) {
    return props.description;
  }
  return props.description.length > 500
    ? `${props.description.substring(0, 500).trim()}...`
    : props.description;
});

const corpusDetails = computed(() => props.details.journal || props.details.publisher);
</script>

<template>
  <div class="card">
    <header class="card-header">
      <div v-if="number && !hideRefIndicator" class="card-header-icon">
        <p class="doc-number">{{ number }}</p>
      </div>
      <p class="card-header-title">
        <a target="_blank" :href="url" @click.stop @click="docMetrics && docMetrics(id)">
          {{ title }}
        </a>
      </p>
      <div class="card-header-icon bookmark">
        <slot name="onboard"></slot>
        <BookmarkComponent :isBookmarked="isBookmarked" :toggleBookmark="toggleBookmark" />
      </div>
    </header>
    <div class="card-content">
      <div class="content">
        <p v-if="shouldDisplayScore">{{ score }}</p>
        <p v-if="corpus" class="corpus">
          <span v-if="corpusDetails">
            <strong class="is-capitalized">{{ corpusDetails }} </strong>
            <i> via </i>
          </span>

          <span :class="corpusDetails ? 'is-italic' : 'has-text-weight-semibold'">
            {{ $t(`corpus.${corpus}`, corpus) }}</span
          >
        </p>
        <p v-if="details?.authors" class="authors">
          <span :key="author.name" v-for="(author, index) in details.authors">
            <i v-if="index <= 9">{{
              index < details.authors.length - 1 && index < 9 ? `${author.name}, ` : author.name
            }}</i>
            <i class="more-authors" v-if="index > 9 && !isMoreAuthorsHidden"
              >, {{ index < details.authors.length - 1 ? `${author.name}, ` : author.name }}</i
            >
          </span>
          <span
            v-if="details?.authors && details?.authors.length > 10"
            @click.prevent="toggleShowMoreAuthors"
          >
            <span v-if="isMoreAuthorsHidden">...</span>
            <p class="is-underlined has-text-link">
              {{ isMoreAuthorsHidden ? $t('showMoreAuthors') : $t('hideAuthors') }}
            </p>
          </span>
        </p>

        <p class="reading-time" v-if="details?.duration">
          <ClockIcon class="clock-icon" /> {{ secondsToMinAndHours(details?.duration) }}
        </p>
        <div class="content">
          {{ displayedDescription }}
        </div>
        <details v-if="slice" class="mt-2 is-clickable" @click.stop>
          <summary>{{ $t('extract') }}</summary>
          <blockquote class="is-italic">{{ slice }}</blockquote>
        </details>
      </div>
    </div>

    <footer class="card-footer" v-if="(sdg || []).length">
      <div class="subtitle is-6 footer-element">{{ $t('sdgsAcronym') }}</div>
      <Pill class="footer-element" v-for="item in sdg" :key="item" :content="item.toString()" />
    </footer>
  </div>
</template>

<style scoped>
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

.card-footer {
  margin-left: 20px;
  min-height: 2.75rem;
}

.footer-element {
  margin-left: 0.5rem;
  margin-top: 0.5rem;
}

.reading-time {
  font-size: 1.15em;
  display: flex;
  margin-bottom: 3rem;
}

@media screen and (max-width: 768px) {
  .card-footer {
    margin-left: 10px;
  }

  .content {
    font-size: 0.875em;
  }

  .card-header-title {
    font-size: 0.9em;
  }

  .reading-time {
    font-size: 0.9em;
    margin-bottom: 1rem;
  }
}
</style>

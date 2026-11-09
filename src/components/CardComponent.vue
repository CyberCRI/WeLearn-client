<script setup lang="ts">
import Pill from './PillComponent.vue';
import ClockIcon from './icons/ClockIcon.vue';
import LineIcon from './icons/LineIcon.vue';
import { computed, ref } from 'vue';
import { secondsToMinAndHours } from '@/utils/time';
import type { DocumentDetails } from '@/types';

import BookmarkComponent from './BookmarkComponent.vue';
import { addTheConversationTrackerScript } from '@/utils/metrics.js';
import { idToLabel } from '@/utils/strings';

const isMoreAuthorsHidden = ref(true);

const props = defineProps<{
  category?: string;
  number?: number;
  title: string;
  corpus: string;
  subCorpus?: string | null;
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
  slice?: string | null;
  id?: string;
  externalId?: string | null;
  docMetrics?: (docId: string) => Promise<void>;
}>();

const toggleShowMoreAuthors = () => {
  isMoreAuthorsHidden.value = !isMoreAuthorsHidden.value;
};

const trackConversationExcerpt = (event: Event) => {
  const excerpt = event.currentTarget as HTMLDetailsElement;

  if (!excerpt.open || props.corpus !== 'conversation' || !props.externalId) {
    return;
  }

  addTheConversationTrackerScript(props.externalId);
};

const displayedDescription = computed(() => {
  if (props.hasFullDescription) {
    return props.description;
  }
  return props.description.length > 500
    ? `${props.description.substring(0, 500).trim()}...`
    : props.description;
});

// the sub corpus names the actual source, so it takes precedence over journal/publisher
const hasCategory = computed(() => !!props.category && props.category !== 'null');

const corpusDetails = computed(
  () => props.subCorpus || props.details.journal || props.details.publisher
);
</script>

<template>
  <div class="card">
    <header class="card-header">
      <div v-if="number && !hideRefIndicator" class="card-header-icon">
        <p class="doc-number">{{ number }}</p>
      </div>
      <p class="card-header-title">
        <a target="_blank" :href="url" @click.stop @click="docMetrics && id && docMetrics(id)">
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
            <strong class="is-capitalized"
              >{{ subCorpus ? $t(`corpus.${subCorpus}`, idToLabel(subCorpus)) : corpusDetails }}
            </strong>
            <i> via </i>
          </span>

          <span :class="corpusDetails ? 'is-italic' : 'has-text-weight-semibold'">
            {{ $t(`corpus.${corpus}`, idToLabel(corpus)) }}</span
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
            <p class="more-authors-toggle">
              {{ isMoreAuthorsHidden ? $t('showMoreAuthors') : $t('hideAuthors') }}
            </p>
          </span>
        </p>

        <!-- one quiet line: the category in words with its icon (no colour to decode), then reading time -->
        <p v-if="hasCategory || details?.duration" class="meta">
          <span v-if="hasCategory" class="meta-item">
            <LineIcon :name="category ?? ''" />
            {{ $t(`categories.${category}`) }}
          </span>
          <span v-if="hasCategory && details?.duration" aria-hidden="true">·</span>
          <span v-if="details?.duration" class="meta-item">
            <ClockIcon class="clock-icon" /> {{ secondsToMinAndHours(details?.duration) }}
          </span>
        </p>
        <div class="content description">
          {{ displayedDescription }}
        </div>
        <details
          v-if="slice"
          class="mt-2 is-clickable"
          @click.stop
          @toggle="trackConversationExcerpt"
        >
          <summary>{{ $t('extract') }}</summary>
          <blockquote class="is-italic">{{ slice }}</blockquote>
        </details>
      </div>
    </div>

    <footer class="card-footer" v-if="(sdg || []).length">
      <span class="sdgs-label">{{ $t('sdgsAcronym') }}</span>
      <Pill class="footer-element" v-for="item in sdg" :key="item" :content="item.toString()" />
    </footer>
  </div>
</template>

<style scoped>
/* a framed card in three parts: tinted title band, white body, tinted footer (no floating shadow),
   so results stand apart from each other and read top to bottom */
.card {
  border: 1px solid var(--neutral-15);
  border-radius: 0.75rem;
  box-shadow: none;
  overflow: hidden;
}
.card-header {
  border-bottom: 1px solid var(--neutral-15);
  border-radius: 0;
  background-color: var(--neutral-10);
  box-shadow: none;
}
.card-header-title {
  padding: 0.875rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--neutral-100);
}
.card-content {
  padding: 1rem 1.25rem;
}
/* tighter than Bulma's 1em between the source, authors and meta lines */
.content p:not(:last-child) {
  margin-bottom: 0.375rem;
}
.description {
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--neutral-80);
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
.card-footer {
  align-items: center;
  gap: 0.375rem;
  min-height: 2.5rem;
  padding: 0.5rem 1.25rem;
  border-top-color: var(--neutral-15);
  border-radius: 0;
  background-color: var(--neutral-10);
}

.footer-element {
  margin: 0;
}

.corpus {
  font-size: 0.9rem;
}
.authors {
  font-size: 0.85rem;
  color: var(--neutral-70);
}
.more-authors-toggle {
  font-size: 0.8rem;
  color: var(--primary-dark);
  text-decoration: underline;
  cursor: pointer;
}
.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0 0.75rem;
  font-size: 0.8rem;
  color: var(--neutral-70);
}
.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}
.meta-item svg {
  width: 0.9rem;
  height: 0.9rem;
}
/* the excerpt toggle reads as a secondary control, not body text */
details > summary {
  font-size: 0.85rem;
  color: var(--neutral-80);
}
.sdgs-label {
  margin-right: 0.125rem;
  font-size: 0.8rem;
  color: var(--neutral-70);
}

@media (max-width: 768px) {
  .content {
    font-size: 0.875em;
  }

  .card-header-title {
    font-size: 0.9em;
  }
}
</style>

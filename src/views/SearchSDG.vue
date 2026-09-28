<script setup lang="ts">
import Button from '@/components/ButtonComponent.vue';
import TextArea from '@/components/TextAreaComponent.vue';
import { useSearchStore } from '@/stores/search';
import SourcesListComponent from '@/components/SourcesListComponent.vue';
import SearchIcon from '@/components/icons/SearchIcon.vue';
import SearchWrapper from '@/components/SearchWrapper.vue';
import DeleteButton from '@/components/DeleteButton.vue';
import Pill from '@/components/PillComponent.vue';
import FiltersComponent from '@/components/FiltersComponent.vue';
import ColumnTemplate from '@/components/ColumnTemplate.vue';

import ChevronDownIcon from '@/components/icons/ChevronDown.vue';
import { nextTick, ref } from 'vue';

const store = useSearchStore();

// The search box collapses into a one-line bar while the user scrolls down through the results,
// and comes back when they click it or scroll back to the top.
// Only the results area scrolls, so collapsing never moves the scroll position (no flicker loop).
const wrapper = ref<HTMLElement | null>(null);
const isCompact = ref(false);
let lastScrollTop = 0;

const onResultsScroll = (event: Event) => {
  const top = (event.target as HTMLElement).scrollTop;
  if (top === 0) isCompact.value = false;
  else if (top > 24 && top > lastScrollTop) isCompact.value = true;
  lastScrollTop = top;
};

const expandSearch = async () => {
  isCompact.value = false;
  await nextTick();
  wrapper.value?.querySelector('textarea')?.focus();
};
</script>

<template>
  <ColumnTemplate class="search-page">
    <template #left-panel>
      <div class="wrapper" ref="wrapper">
        <Transition name="fade">
          <button
            v-if="isCompact"
            class="compact-bar"
            :aria-label="$t('search')"
            @click="expandSearch"
          >
            <SearchIcon size="1.25rem" />
            <span class="compact-query">{{ store.searchInput }}</span>
            <span class="compact-chevron"><ChevronDownIcon /></span>
          </button>
        </Transition>
        <SearchWrapper v-show="!isCompact" class="search-box">
          <template #textArea>
            <div class="delete-button-wrapper" v-if="store.searchInput">
              <DeleteButton :action="store.$reset" :delText="$t('clearSearch')" />
            </div>
            <TextArea v-model="store.searchInput" />
          </template>
          <template #sdgsList>
            <div class="sdgs-list" v-if="store.sdgsQuery.length">
              <p class="sdg-list-title has-text-grey is-italic mr-2">
                {{ $t('search_sdgs_in_query') }}
              </p>
              <Pill
                class="footer-element mr-1 ml-1"
                v-for="item in store.sdgsQuery"
                :key="item"
                :content="item.toString()"
              />
            </div>
          </template>
          <template #filters>
            <p
              data-testid="lengthErrorFeedback"
              v-if="store.searchInput && store.isSearchDisabled"
              class="text-length-feedback"
            >
              {{ $t('textLengthFeedback') }}
            </p>
            <div class="ml-auto is-relative search-button">
              <Button
                class="search-button"
                :aria-label="$t('search')"
                @click="store.fetchSources()"
                isOutline
                :disabled="store.isSearchDisabled"
              >
                <SearchIcon size="1.5rem" style="{'rotate': 180;}" />
              </Button>
            </div>
          </template>
        </SearchWrapper>

        <div class="results-scroll" @scroll="onResultsScroll">
          <SourcesListComponent
            class="results"
            v-if="
              store.searchResults ||
              store.isFetchingSources ||
              store.hasSourcesError ||
              store.displayNoResult
            "
            hideRefIndicator
            :sourcesList="store.searchResults || []"
            :isSourcesError="store.hasSourcesError"
            :isFetchingSources="store.isFetchingSources"
            :shouldDisplayScore="store.shouldDisplayScore"
            :errorCode="store.errorCode"
            :noResults="store.displayNoResult"
          />
        </div>
      </div>
    </template>
    <template #right-panel>
      <FiltersComponent />
    </template>
  </ColumnTemplate>
</template>

<style scoped>
.search-box {
  flex-shrink: 0;
}

.compact-bar {
  all: unset;
  box-sizing: border-box;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--neutral-50);
  border-radius: 0.5rem;
  background-color: var(--neutral-0);
  cursor: pointer;
  &:hover {
    background-color: var(--neutral-10);
  }
}

.compact-chevron {
  display: flex;
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
}

.compact-query {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.fade-enter-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from {
  opacity: 0;
}

/* Only the results scroll, below the search box / compact bar */
.results-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.results {
  overflow: visible;
}

.wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 1rem 3rem 0rem 3rem;
}

.delete-button-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  z-index: 1;
  & > * {
    border: none;
  }
}

.text-length-feedback {
  padding-left: 1rem;
  padding-top: 1rem;
  color: var(--error-100);
}

.search-button {
  height: 100%;
}

.sdgs-list {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0.5rem 0;
}

.sdg-list-title {
  font-size: 14px;
}

/* Stacked layout (filters below): the search column fills the screen, filters are reached by scrolling the page */
@media (max-width: 991px) {
  .search-page :deep(.left) {
    height: 100%;
    flex-shrink: 0;
  }
}

@media (max-width: 768px) {
  .text-length-feedback {
    font-size: 0.7em;
    padding-left: 0.5rem;
    padding-top: 0.25rem;
  }
  .wrapper {
    padding: 0.25rem;
  }
  .sdg-list-title {
    font-size: 0.875em;
  }
}
</style>

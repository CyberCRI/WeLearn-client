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

const store = useSearchStore();
</script>

<template>
  <ColumnTemplate>
    <template #left-panel>
      <div class="wrapper p-6">
        <SearchWrapper>
          <template #textArea>
            <div class="delete-button-wrapper" v-if="store.searchInput">
              <DeleteButton :action="store.$reset" :delText="$t('clearSearch')" />
            </div>
            <TextArea v-model="store.searchInput" />
            <div class="is-flex is-justify-content-flex-end py-1" v-if="store.sdgsQuery.length">
              <p class="is-subtitle has-text-grey is-italic mr-2">
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
        <p
          data-testid="lengthErrorFeedback"
          v-if="store.searchInput && store.isSearchDisabled"
          class="text-length-feedback"
        >
          {{ $t('textLengthFeedback') }}
        </p>

        <SourcesListComponent
          v-if="
            store.searchResults ||
            store.isFetchingSources ||
            store.hasSourcesError ||
            store.displayNoResult
          "
          hideRefIndicator
          :sourcesList="store.searchResults"
          :isSourcesError="store.hasSourcesError"
          :isFetchingSources="store.isFetchingSources"
          :shouldDisplayScore="store.shouldDisplayScore"
          :errorCode="store.errorCode"
          :noResults="store.displayNoResult"
        />
      </div>
    </template>
    <template #right-panel>
      <FiltersComponent />
    </template>
  </ColumnTemplate>
</template>

<style scoped>
.wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
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
  color: var(--error-100);
}

.search-button {
  height: 100%;
}
</style>

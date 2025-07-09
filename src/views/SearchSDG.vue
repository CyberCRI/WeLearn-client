<script setup lang="ts">
import Button from '@/components/ButtonComponent.vue';
import TextArea from '@/components/TextAreaComponent.vue';
import FullpageTemplate from '@/components/FullpageTemplate.vue';
import { useSearchStore } from '@/stores/search';
import { onBeforeMount } from 'vue';
import SourcesListComponent from '@/components/SourcesListComponent.vue';
import SearchIcon from '@/components/icons/SearchIcon.vue';
import SelectSubject from '@/components/dropdowns/SubjectSelector.vue';
import SearchWrapper from '@/components/SearchWrapper.vue';
import SelectSource from '@/components/dropdowns/SourcesSelector.vue';
import SDGSelector from '@/components/dropdowns/SDGSelector.vue';
import DeleteButton from '@/components/DeleteButton.vue';
import Pill from '@/components/PillComponent.vue';
import ErrorComponent from '@/components/ErrorComponent.vue';

const store = useSearchStore();

onBeforeMount(() => {
  store.getCorpus();
});
</script>

<template>
  <FullpageTemplate>
    <template #top>
      <ErrorComponent v-if="store.hasError" />
      <SearchWrapper>
        <template #textArea>
          <div class="delete-button-wrapper" v-if="store.searchInput">
            <DeleteButton :action="store.$reset" :delText="$t('clearSearch')" />
          </div>
          <TextArea v-model="store.searchInput" />
          <div class="is-flex is-justify-content-flex-end py-1" v-if="store.sdgsQuery.length">
            <p class="is-subtitle has-text-grey is-italic mr-2">{{ $t('search_sdgs_in_query') }}</p>
            <Pill
              class="footer-element mr-1 ml-1"
              v-for="item in store.sdgsQuery"
              :key="item"
              :content="item.toString()"
            />
          </div>
        </template>
        <template #filters>
          <SelectSource />
          <SDGSelector />
          <SelectSubject
            v-if="store.shouldDisplaySubjects"
            :clearSubject="store.clearSubject"
            :storedSubject="store.storedSubject"
            :selectSubject="store.selectSubject"
          />

          <div class="is-relative search-button">
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
      <p v-if="store.searchInput && store.isSearchDisabled" class="text-length-feedback">
        {{ $t('textLengthFeedback') }}
      </p>
    </template>
    <template #main>
      <SourcesListComponent
        v-if="
          store.sourcesList ||
          store.isFetchingSources ||
          store.hasSourcesError ||
          store.displayNoResult
        "
        hideRefIndicator
        :sourcesList="store.sourcesList"
        :isSourcesError="store.hasSourcesError"
        :isFetchingSources="store.isFetchingSources"
        :shouldDisplayScore="store.shouldDisplayScore"
        :errorCode="store.errorCode"
        :noResults="store.displayNoResult"
      />
    </template>
  </FullpageTemplate>
</template>

<style scoped>
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

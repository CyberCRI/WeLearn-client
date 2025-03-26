<script setup lang="ts">
import { ref } from 'vue';
import { type Document } from '@/types';
import CardSimpleComponent from '@/components/CardSimpleComponent.vue';
import data from './mockedSearchResult.json';
defineProps<{
  disabled?: boolean;
  visible?: boolean;
}>();

const sources = ref<Document[]>(data);
</script>
<template>
  <div class="wrapper" :class="{ disabled: disabled, visible: visible }">
    <h1 class="title is-4">{{ $t('tutor.secondStep.title') }}</h1>
    <p class="subtitle is-6">{{ $t('tutor.secondStep.description') }}</p>
    <div class="sources">
      <div class="source" v-for="source in sources" :key="source.id">
        <CardSimpleComponent
          :title="source.payload.document_title"
          :corpus="source.payload.document_corpus"
          :url="source.payload.document_url"
          :details="source.payload.document_details"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;

  overflow-y: auto;
  flex-grow: 0;
  flex-basis: 0;
  height: 100%;
  transition: all 0.5s;
  margin-left: 2rem;
  overflow: hidden;
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
}
.sources {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.sources > * {
  width: 100%;
}
</style>

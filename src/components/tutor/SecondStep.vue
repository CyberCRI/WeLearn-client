<script setup lang="ts">
import { ref } from 'vue';
import { type Document } from '@/types';
import CardSimpleComponent from '@/components/CardSimpleComponent.vue';
defineProps<{
  disabled?: boolean;
  visible?: boolean;
}>();

const sources = ref<Document[]>([
  {
    id: 1,
    title: 'Document 1',
    description: 'This is the first document',
    selected: false,
    corpus: 'pubmed',
    url: 'https://pubmed.ncbi.nlm.nih.gov/123456789/',
    details: {
      publisher: 'Elsevier',
      authors: ['John Doe', 'Jane Doe']
    }
  },
  {
    id: 2,
    title: 'Document 2',
    description: 'This is the second document',
    selected: false,
    corpus: 'pubmed',
    url: 'https://pubmed.ncbi.nlm.nih.gov/123456789/',
    details: {
      publisher: 'Elsevier',
      authors: ['John Doe', 'Jane Doe']
    }
  },
  {
    id: 3,
    title: 'Document 3',
    description: 'This is the third document',
    selected: false,
    corpus: 'pubmed',
    url: 'https://pubmed.ncbi.nlm.nih.gov/123456789/',
    details: {
      publisher: 'Elsevier',
      authors: ['John Doe', 'Jane Doe']
    }
  },
  {
    id: 4,
    title: 'Document 4',
    description: 'This is the third document',
    selected: false,
    corpus: 'pubmed',
    url: 'https://pubmed.ncbi.nlm.nih.gov/123456789/',
    details: {
      publisher: 'Elsevier',
      authors: ['John Doe', 'Jane Doe']
    }
  },
  {
    id: 3,
    title: 'Document 3',
    description: 'This is the third document',
    selected: false,
    corpus: 'pubmed',
    url: 'https://pubmed.ncbi.nlm.nih.gov/123456789/',
    details: {
      publisher: 'Elsevier',
      authors: ['John Doe', 'Jane Doe']
    }
  },
  {
    id: 4,
    title: 'Document 4',
    description: 'This is the third document',
    selected: false,
    corpus: 'pubmed',
    url: 'https://pubmed.ncbi.nlm.nih.gov/123456789/',
    details: {
      publisher: 'Elsevier',
      authors: ['John Doe', 'Jane Doe']
    }
  }
]);
</script>
<template>
  <div class="wrapper" :class="{ disabled: disabled, visible: visible }">
    <h1 class="title is-4">{{ $t('tutor.secondStep.title') }}</h1>
    <p class="subtitle is-6">{{ $t('tutor.secondStep.description') }}</p>
    <div class="sources">
      <div class="source" v-for="source in sources" :key="source.id">
        <input type="checkbox" v-model="source.selected" />
        <CardSimpleComponent
          :title="source.title"
          :corpus="source.corpus"
          :url="source.url"
          :details="source.details"
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
  transition: all 2s;
  margin-left: 2rem;
  overflow: hidden;
}
.wrapper.visible {
  flex-grow: 3;
}
.wrapper.disabled {
  pointer-events: none;
  opacity: 0.5;
  flex-grow: 1;
  margin-left: 0;
  margin-top: 1rem;
}
.source {
  display: flex;
}
.sources {
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  max-height: 80%;
  width: 100%;
}
.sources > * {
  width: 100%;
}
</style>

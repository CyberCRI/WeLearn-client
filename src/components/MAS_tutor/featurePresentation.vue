<template>
  <div class="feature-presentation">
    <h1 class="title is-3 has-text-centered mb-4">
      {{ $t('tutor_mas_title') }}
    </h1>
    <p class="subtitle is-5 has-text-centered">
      {{ $t('tutor_mas_subtitle') }}
    </p>

    <p class="content is-size-6 is-medium has-text-centered">
      {{ $t('tutor_mas_description') }}
    </p>
    <div class="action">
      <button class="button" @click="store.getUserFlow('fromSyllabus')">
        I have an exisiting syllabus
      </button>
      <button class="button is-primary ml-2" @click="store.getUserFlow('fromScratch')">
        I want to start from scratch
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMAsTutorStore } from '@/stores/mas_tutor';

const store = useMAsTutorStore();
</script>

<style lang="css" scoped>
.feature-presentation {
  width: 50%;
  margin: auto;
  padding: 5rem 0rem;
  height: fit-content;
}

.action {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>

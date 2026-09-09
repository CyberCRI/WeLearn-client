<script setup lang="ts">
import { useMAsTutorStore } from '@/stores/mas_tutor';
import { marked } from 'marked';

const store = useMAsTutorStore();
</script>

<template>
  <h1>User will see and validate their syllabus data here</h1>
  <div v-for="(value, key) in store.summaryData" :key="key">
    <div v-if="!!key && !!value">
      <span class="has-text-weight-bold">{{ key }}</span>
      <p class="md" v-html="marked.parse(value.toString())" />
    </div>
  </div>
  <button class="button" @click="store.previousStepOnFlow()">previous</button>
  <button class="button" @click="store.nextStepOnFlow()">next</button>
</template>

<style lang="css">
p.md {
  color: var(--neutral-80);
}
p.md h3 {
  font-weight: 700;
}

p.md h4 {
  font-weight: 600;
}

p.md h2 {
  font-weight: 800;
}

p.md ul li ul {
  margin-left: 0.5rem;
  list-style-type: disc;
  list-style-position: inside;
}
</style>

<script setup lang="ts">
import { useMAsTutorStore } from '@/stores/mas_tutor';

const store = useMAsTutorStore();
</script>

<template>
  <h1>User will add their syllabur here</h1>
  <button class="button" @click="store.previousStepOnFlow()">previous</button>
  <button class="button" @click="store.nextStepOnFlow()">next</button>
</template>

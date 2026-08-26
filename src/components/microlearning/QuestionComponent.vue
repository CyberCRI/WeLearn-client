<template>
  <div class="questionAndScale">
    <p class="question">{{ question }}</p>
    <LikertScale />
  </div>
</template>

<script setup lang="ts">
import LikertScale from '@/components/microlearning/LikertScale.vue';
defineProps<{
  question: string;
}>();
</script>

<style lang="css" scoped>
.questionAndScale {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

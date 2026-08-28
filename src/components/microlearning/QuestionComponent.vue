<template>
  <div class="questionAndScale">
    <p class="question">{{ question }}</p>
    <YesMaybeNotScale v-if="type === 'yesMaybeNot'" />
    <input
      class="input"
      tyoe="textarea"
      v-else-if="type === 'openDialogue'"
      :placeholder="$t('typeHere')"
    />
    <LikertScale v-else />
  </div>
</template>

<script setup lang="ts">
import LikertScale from '@/components/microlearning/LikertScale.vue';
import YesMaybeNotScale from '@/components/microlearning/YesMaybeNotScale.vue';

defineProps<{
  question: string;
  type?: 'likert' | 'yesMaybeNot' | 'openDialogue';
}>();
</script>

<style lang="css" scoped>
.questionAndScale {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 30%;
}

.question {
  align-self: flex-start;
  color: var(--neutral-80);
}
</style>

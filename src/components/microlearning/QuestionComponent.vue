<template>
  <div class="questionAndScale">
    <p class="question">{{ question }}</p>
    <YesMaybeNotScale v-if="type === 'yesMaybeNot'" v-model="model" :disabled="disabled" />
    <textarea
      class="textarea"
      rows="2"
      v-else-if="type === 'openDialogue'"
      v-model="model"
      :disabled="disabled"
      :placeholder="$t('typeHere')"
    />
    <LikertScale v-else v-model="model" :disabled="disabled" />
  </div>
</template>

<script setup lang="ts">
import LikertScale from '@/components/microlearning/LikertScale.vue';
import YesMaybeNotScale from '@/components/microlearning/YesMaybeNotScale.vue';

defineProps<{
  question: string;
  type?: 'likert' | 'yesMaybeNot' | 'openDialogue';
  disabled?: boolean;
}>();

// Likert answers are numbers, the other types are strings
const model = defineModel<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
</script>

<style lang="css" scoped>
.questionAndScale {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 560px;
}

.question {
  align-self: flex-start;
  color: var(--neutral-80);
}
</style>

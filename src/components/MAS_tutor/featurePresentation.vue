<template>
  <div :id="`target-${id_number}`" class="feature-presentation">
    <h1 class="title is-3 has-text-centered mb-4">Welcome to the syllabus helper</h1>
    <p class="subtitle is-4 has-text-centered">
      This tool will assist you in creating a comprehensive syllabus for your course.
    </p>

    <p class="content is-medium has-text-centered">
      Please provide the necessary information about your course, and the syllabus helper will
      generate a detailed syllabus tailored to your needs. Whether you're teaching a lecture,
      seminar, or workshop, our tool is designed to help you create an engaging and informative
      syllabus that meets your specific requirements.
    </p>
    <div class="is-flex is-justify-content-end mt-4">
      <a
        data-testid="tutor-next-button"
        class="button is-primary"
        href="#"
        @click="scrollToAnchor(`target-${id_number + 1}`)"
      >
        <ChevronDown />
        {{ $t(`${actionText || 'start'}`) }}
      </a>
    </div>
  </div>
</template>

<style lang="css" scoped>
.feature-presentation {
  max-width: 100%;
  margin: 0 auto;
  padding: 10rem 0rem;
  height: 100%;
}
</style>

<script setup lang="ts">
import ChevronDown from '@/components/icons/ChevronDown.vue';
import { scrollToAnchor } from '@/utils/navigation';

defineProps<{
  id_number: number;
  actionText?: string;
}>();
</script>

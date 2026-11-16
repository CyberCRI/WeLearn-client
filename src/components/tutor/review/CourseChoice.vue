<script setup lang="ts">
import ButtonComponent from '@/components/ButtonComponent.vue';

// the document holds several courses: the teacher picks theirs, which WeLearn reads again, alone
defineProps<{ courses: string[] }>();
const emit = defineEmits<{ choose: [title: string] }>();
</script>

<template>
  <section class="course-choice" data-testid="course-choice">
    <p class="has-text-weight-semibold">{{ $t('tutor.check.severalCourses') }}</p>
    <p class="muted">{{ $t('tutor.check.severalCoursesHint') }}</p>
    <ul>
      <li v-for="title in courses" :key="title">
        <ButtonComponent
          is-discreet
          class="is-small"
          data-testid="choose-course"
          @click="emit('choose', title)"
        >
          {{ title }}
        </ButtonComponent>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.course-choice {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  background: var(--lpi-yellow-lighter);
}

.muted {
  font-size: 0.85rem;
  color: var(--neutral-70);
}

ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

li :deep(.button) {
  white-space: normal;
  height: auto;
  text-align: left;
}
</style>

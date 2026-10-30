<script setup lang="ts">
import { ref } from 'vue';
import type { CoursePath } from '@/types';

// "do you already have a course?": two options, then one discreet line with "change".
// changing asks first when something was already added for the course
const props = defineProps<{
  path: CoursePath | null;
  hasStarted: boolean;
}>();

const emit = defineEmits<{
  choose: [path: CoursePath];
  reset: [];
}>();

const isConfirmingChange = ref(false);

const handleChange = () => {
  if (props.hasStarted) isConfirmingChange.value = true;
  else emit('reset');
};

const handleDiscard = () => {
  isConfirmingChange.value = false;
  emit('reset');
};
</script>

<template>
  <div v-if="path" class="chosen-path" data-testid="chosen-path">
    <p v-if="!isConfirmingChange" class="chosen-line">
      {{ path === 'existing' ? $t('tutor.start.working') : $t('tutor.start.workingNew') }}
      <button
        type="button"
        class="button is-small is-text"
        data-testid="change-path"
        @click="handleChange"
      >
        {{ $t('tutor.start.change') }}
      </button>
    </p>
    <div v-else class="change-warning" role="alert" data-testid="change-warning">
      <p>{{ $t('tutor.start.changeWarning') }}</p>
      <div class="change-actions">
        <button
          type="button"
          class="button is-small"
          data-testid="discard-change"
          @click="handleDiscard"
        >
          {{ $t('tutor.start.discard') }}
        </button>
        <button
          type="button"
          class="button is-small is-text"
          data-testid="keep-working"
          @click="isConfirmingChange = false"
        >
          {{ $t('tutor.start.keepWorking') }}
        </button>
      </div>
    </div>
  </div>

  <div v-else class="question" role="group" aria-labelledby="course-question">
    <h1 id="course-question" class="title is-4 is-size-5-mobile">
      {{ $t('tutor.start.question') }}
    </h1>
    <div class="options">
      <button
        type="button"
        class="option"
        data-testid="option-existing"
        @click="emit('choose', 'existing')"
      >
        {{ $t('tutor.start.yes') }}
      </button>
      <button
        type="button"
        class="option"
        data-testid="option-scratch"
        @click="emit('choose', 'scratch')"
      >
        {{ $t('tutor.start.no') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.question {
  padding: 1.5rem 0;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.option {
  padding: 0.55rem 1.1rem;
  border: 1px solid var(--neutral-20);
  border-radius: 999px;
  background: var(--neutral-0);
  font: inherit;
  color: var(--neutral-90);
  cursor: pointer;
  transition: border-color 0.15s;
  &:hover {
    border-color: var(--primary-dark);
  }
  &:focus-visible {
    outline: 2px solid var(--primary-dark);
    outline-offset: 2px;
  }
}

.chosen-path {
  padding-top: 1rem;
}

.chosen-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.change-warning {
  max-width: 40rem;
  padding: 0.75rem 1rem;
  border-left: 4px solid var(--lpi-yellow);
  border-radius: 4px;
  background: var(--lpi-yellow-lighter);
}

.change-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

@media (prefers-reduced-motion: reduce) {
  .option {
    transition: none;
  }
}
</style>

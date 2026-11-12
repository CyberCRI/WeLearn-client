<script setup lang="ts">
import { ref } from 'vue';
import type { CoursePath } from '@/types';

// "how would you like to start?": two options. once chosen, a back link (adapt) or a line with
// "change" (create); going back asks first only when a file or details would be lost
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
    <template v-if="!isConfirmingChange">
      <button
        v-if="path === 'existing'"
        type="button"
        class="back-link"
        data-testid="change-path"
        @click="handleChange"
      >
        ← {{ $t('tutor.start.back') }}
      </button>
      <p v-else class="chosen-line">
        {{ $t('tutor.start.workingNew') }}
        <button
          type="button"
          class="button is-small is-text"
          data-testid="change-path"
          @click="handleChange"
        >
          {{ $t('tutor.start.change') }}
        </button>
      </p>
    </template>
    <div v-else class="change-warning" role="alert" data-testid="change-warning">
      <p>
        {{ path === 'existing' ? $t('tutor.start.backWarning') : $t('tutor.start.changeWarning') }}
      </p>
      <div class="change-actions">
        <button
          type="button"
          class="button is-small"
          data-testid="discard-change"
          @click="handleDiscard"
        >
          {{ path === 'existing' ? $t('tutor.start.discardBack') : $t('tutor.start.discard') }}
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
    <p
      v-if="path === 'scratch' && !isConfirmingChange"
      class="is-size-7 has-text-grey"
      data-testid="scratch-status"
    >
      {{ $t('tutor.start.newInProgress') }}
    </p>
  </div>

  <div v-else class="question" role="group" aria-labelledby="course-question">
    <h1 id="course-question" class="title is-4 is-size-5-mobile">
      {{ $t('tutor.start.question') }}
    </h1>
    <p class="subtitle is-6 intro">{{ $t('tutor.start.intro') }}</p>
    <div class="options">
      <button
        type="button"
        class="option"
        data-testid="option-existing"
        @click="emit('choose', 'existing')"
      >
        <span class="option-text">
          <span class="option-title">
            {{ $t('tutor.start.yes') }}
          </span>
          <span class="option-hint">{{ $t('tutor.start.yesHint') }}</span>
        </span>
        <span class="option-arrow" aria-hidden="true">→</span>
      </button>
      <button
        type="button"
        class="option"
        data-testid="option-scratch"
        @click="emit('choose', 'scratch')"
      >
        <span class="option-text">
          <span class="option-title">
            {{ $t('tutor.start.no') }}
            <span class="option-status" data-testid="option-status">{{
              $t('tutor.start.inDevelopment')
            }}</span>
          </span>
          <span class="option-hint">{{ $t('tutor.start.noHint') }}</span>
        </span>
        <span class="option-arrow" aria-hidden="true">→</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* same column and alignment as the "your course" screen that follows */
.question {
  padding: 2.5rem 0 1.5rem;
}

.intro {
  margin-top: 0.5rem;
  color: var(--neutral-70);
}

.options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 2rem;
}

/* the whole panel is the button */
.option {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--neutral-20);
  border-radius: 0.5rem;
  background: var(--neutral-0);
  font: inherit;
  text-align: left;
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

.option-text {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.option-title {
  font-weight: 600;
  font-size: 1.05rem;
}

.option-hint {
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.option-status {
  margin-left: 0.5rem;
  font-weight: normal;
  font-size: 0.75rem;
  color: var(--neutral-70);
}

.option-arrow {
  color: var(--primary-dark);
  transition: transform 0.15s;
}

.option:hover .option-arrow {
  transform: translateX(2px);
}

@media (max-width: 768px) {
  .options {
    grid-template-columns: 1fr;
  }
  .option-status {
    display: block;
    margin-left: 0;
  }
}

.chosen-path {
  padding-top: 1rem;
}

/* a plain text link, like the back links elsewhere in WeLearn */
.back-link {
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  font-size: 0.9rem;
  color: var(--primary-dark);
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  &:focus-visible {
    outline: 2px solid var(--primary-dark);
    outline-offset: 2px;
  }
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
  .option,
  .option-arrow {
    transition: none;
  }
}
</style>

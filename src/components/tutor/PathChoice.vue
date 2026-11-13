<script setup lang="ts">
import { ref } from 'vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import ModalComponent from '@/components/ModalComponent.vue';
import type { CoursePath } from '@/types';

// "do you already have a course?": two options, then one discreet line with "change".
// changing asks first when something was already added for the course, with the same
// confirmation as "start over" in the syllabus step
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
    <span>
      {{ path === 'existing' ? $t('tutor.start.working') : $t('tutor.start.workingNew') }}
    </span>
    <ButtonComponent class="is-small is-text" data-testid="change-path" @click="handleChange">
      {{ $t('tutor.start.change') }}
    </ButtonComponent>

    <!-- v-if: ModalComponent only reads isOpen on mount -->
    <ModalComponent
      v-if="isConfirmingChange"
      isOpen
      size="small"
      :title="$t('tutor.start.changeTitle')"
      :message="$t('tutor.start.changeWarning')"
      :onClose="() => (isConfirmingChange = false)"
    >
      <template #actions>
        <ButtonComponent data-testid="keep-working" @click="isConfirmingChange = false">
          {{ $t('tutor.start.keepWorking') }}
        </ButtonComponent>
        <ButtonComponent
          class="is-danger is-light"
          data-testid="discard-change"
          @click="handleDiscard"
        >
          {{ $t('tutor.start.discard') }}
        </ButtonComponent>
      </template>
    </ModalComponent>
  </div>

  <div v-else class="question" role="group" aria-labelledby="course-question">
    <h1 id="course-question" class="title is-4 is-size-5-mobile">
      {{ $t('tutor.start.question') }}
    </h1>
    <div class="buttons">
      <ButtonComponent data-testid="option-existing" @click="emit('choose', 'existing')">
        {{ $t('tutor.start.yes') }}
      </ButtonComponent>
      <ButtonComponent data-testid="option-scratch" @click="emit('choose', 'scratch')">
        {{ $t('tutor.start.no') }}
      </ButtonComponent>
    </div>
  </div>
</template>

<style scoped>
.question {
  padding: 1.5rem 0;
}

/* same look as the recap line of a finished step */
.chosen-path {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-top: 1rem;
  color: var(--neutral-70);
}
</style>

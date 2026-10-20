<script setup lang="ts">
import { ref } from 'vue';
import AiLabel from '@/components/AiLabel.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import { useAskWeLearn } from '@/composables/useAskWeLearn';
import { FAST_LANE_CHIPS } from '@/components/teacher/teacherSpaces';
import i18n from '@/localisation/i18n';

// "What are you teaching?": one sentence from the teacher, then the chat suggests resources,
// a real case and an activity idea (mock: opens the existing chat with the question ready)
const { askWeLearn } = useAskWeLearn();
const subject = ref('');
const hasEmptyError = ref(false);

const handleChip = (chip: string) => {
  subject.value = i18n.global.t(`journey.teach.fastLane.chips.${chip}`);
  hasEmptyError.value = false;
};

const handleFindIdeas = () => {
  const text = subject.value.trim();
  if (!text) {
    hasEmptyError.value = true;
    return;
  }
  askWeLearn(i18n.global.t('journey.teach.fastLane.question', { subject: text }));
};
</script>
<template>
  <section class="fast-lane" data-testid="fast-lane">
    <AiLabel :text="$t('journey.teach.ask.title')" />
    <h1 class="title is-3 is-size-4-mobile mt-3">{{ $t('journey.teach.fastLane.title') }}</h1>
    <p class="subtitle is-6 mt-2 subtitle-text">{{ $t('journey.teach.fastLane.subtitle') }}</p>

    <form class="fast-lane-form" @submit.prevent="handleFindIdeas">
      <label class="is-sr-only" for="fast-lane-subject">
        {{ $t('journey.teach.fastLane.inputLabel') }}
      </label>
      <input
        id="fast-lane-subject"
        v-model="subject"
        class="input"
        type="text"
        data-testid="fast-lane-input"
        :placeholder="$t('journey.teach.fastLane.placeholder')"
        :aria-invalid="hasEmptyError"
        aria-describedby="fast-lane-error"
        @input="hasEmptyError = false"
      />
      <ButtonComponent color="primary" type="submit" data-testid="fast-lane-button">
        {{ $t('journey.teach.fastLane.button') }}
      </ButtonComponent>
    </form>
    <p
      v-if="hasEmptyError"
      id="fast-lane-error"
      class="help is-danger"
      role="alert"
      data-testid="fast-lane-error"
    >
      {{ $t('journey.teach.fastLane.empty') }}
    </p>

    <div class="chips">
      <span class="chips-label">{{ $t('journey.teach.fastLane.examples') }}</span>
      <button
        v-for="chip in FAST_LANE_CHIPS"
        :key="chip"
        type="button"
        class="button is-small is-rounded"
        :data-testid="`chip-${chip}`"
        @click="handleChip(chip)"
      >
        {{ $t(`journey.teach.fastLane.chips.${chip}`) }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.fast-lane {
  padding: 1.5rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
  background: var(--neutral-10);
}

.subtitle-text {
  max-width: 48rem;
}

.fast-lane-form {
  display: flex;
  gap: 0.75rem;
  max-width: 48rem;
  margin-top: 1.25rem;
}

.fast-lane-form .input {
  flex: 1;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.chips-label {
  font-size: 0.85rem;
  color: var(--neutral-70);
}

@media (max-width: 600px) {
  .fast-lane {
    padding: 1rem;
  }

  .fast-lane-form {
    flex-direction: column;
  }
}
</style>

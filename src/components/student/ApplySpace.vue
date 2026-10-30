<script setup lang="ts">
import { computed, ref } from 'vue';
import TutorConversation from '@/components/student/TutorConversation.vue';
import { useSpaceTutor } from '@/components/student/useSpaceTutor';
import type { TutorMode } from '@/utils/learnerTutor';

// APPLY: the learner's own work (an assignment, a project, a professional or community question):
// the tutor helps clarify the goal, see what is missing, weigh options and improve their draft,
// without writing it for them
const { store, send, help, request } = useSpaceTutor('apply');
const texts = 'student.apply';

const goal = ref(store.thread.purpose || store.thread.topic);
const draft = ref('');
const isBusy = computed(() => store.status.apply === 'thinking');

const GUIDES: TutorMode[] = ['clarify', 'evidence', 'options'];

const handleGuide = (mode: TutorMode, label: string) => {
  if (!store.thread.topic) store.setTopic(goal.value);
  request(mode, goal.value.trim(), label);
};
const handleFeedback = (label: string) =>
  request('feedback', `${goal.value.trim()}\n\n${draft.value.trim()}`, label);
</script>
<template>
  <div class="space-activity" data-testid="apply-space">
    <p class="ownership">{{ $t(`${texts}.ownership`) }}</p>
    <label class="label mt-3" for="apply-goal">{{ $t(`${texts}.goalLabel`) }}</label>
    <textarea
      id="apply-goal"
      v-model="goal"
      class="textarea"
      rows="2"
      :placeholder="$t(`${texts}.goalPlaceholder`)"
      data-testid="apply-goal"
    />
    <div class="row mt-2">
      <button
        v-for="mode in GUIDES"
        :key="mode"
        type="button"
        class="button is-small"
        :disabled="!goal.trim() || isBusy"
        :data-testid="`apply-${mode}`"
        @click="handleGuide(mode, $t(`${texts}.${mode}`))"
      >
        {{ $t(`${texts}.${mode}`) }}
      </button>
    </div>

    <label class="label mt-4" for="apply-draft">{{ $t(`${texts}.draftLabel`) }}</label>
    <textarea
      id="apply-draft"
      v-model="draft"
      class="textarea"
      rows="4"
      :placeholder="$t(`${texts}.draftPlaceholder`)"
      data-testid="apply-draft"
    />
    <button
      type="button"
      class="button is-small is-primary mt-2"
      :disabled="!draft.trim() || isBusy"
      data-testid="apply-feedback"
      @click="handleFeedback($t(`${texts}.feedback`))"
    >
      {{ $t(`${texts}.feedback`) }}
    </button>

    <TutorConversation place="apply" with-help class="mt-4" @send="send" @help="help" />
  </div>
</template>

<style scoped>
.ownership {
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>

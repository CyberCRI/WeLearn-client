<script setup lang="ts">
import { computed, ref } from 'vue';
import i18n from '@/localisation/i18n';
import TutorConversation from '@/components/student/TutorConversation.vue';
import { useSpaceTutor } from '@/components/student/useSpaceTutor';
import type { TutorMode } from '@/utils/learnerTutor';

// UNDERSTAND: a concept explained with WeLearn documents behind it, then another explanation, an
// example, more depth or its connections, and the learner's own explanation checked
const { store, send, help, request } = useSpaceTutor('understand');
const { t } = i18n.global;
const texts = 'student.understand';

const concept = ref(store.thread.topic);
const explanation = ref('');
const isSaved = ref(false);
const hasStarted = computed(() => store.turnsOf('understand').length > 0);
const isBusy = computed(() => store.status.understand === 'thinking');

const MORE: TutorMode[] = ['another', 'example', 'deeper', 'connections'];

const handleExplain = async () => {
  if (!concept.value.trim()) return;
  if (!store.thread.topic) store.setTopic(concept.value);
  await store.findReferences(concept.value);
  await request('explain', concept.value.trim(), t(`${texts}.explain`));
};

const handleCheck = () => {
  request('check', explanation.value.trim(), t(`${texts}.check`));
  isSaved.value = false;
};
const handleSave = () => {
  store.addNote('understand', explanation.value);
  isSaved.value = true;
};
</script>
<template>
  <div class="space-activity" data-testid="understand-space">
    <form class="concept-row" @submit.prevent="handleExplain">
      <label class="label" for="concept">{{ $t(`${texts}.conceptLabel`) }}</label>
      <div class="row">
        <input
          id="concept"
          v-model="concept"
          class="input"
          type="text"
          :placeholder="$t(`${texts}.conceptPlaceholder`)"
          data-testid="concept"
        />
        <button
          type="submit"
          class="button is-primary"
          :disabled="!concept.trim() || isBusy"
          data-testid="explain"
        >
          {{ $t(`${texts}.explain`) }}
        </button>
      </div>
    </form>

    <div v-if="hasStarted" class="more">
      <button
        v-for="mode in MORE"
        :key="mode"
        type="button"
        class="button is-small"
        :disabled="isBusy"
        :data-testid="`understand-${mode}`"
        @click="request(mode, concept.trim(), $t(`${texts}.${mode}`))"
      >
        {{ $t(`${texts}.${mode}`) }}
      </button>
    </div>

    <TutorConversation place="understand" with-help class="mt-4" @send="send" @help="help" />

    <section v-if="hasStarted" class="check" data-testid="understand-check">
      <label class="label" for="own-explanation">{{ $t(`${texts}.checkTitle`) }}</label>
      <textarea
        id="own-explanation"
        v-model="explanation"
        class="textarea"
        rows="3"
        :placeholder="$t(`${texts}.checkPlaceholder`)"
        data-testid="own-explanation"
      />
      <div class="row mt-2">
        <button
          type="button"
          class="button is-small is-primary"
          :disabled="!explanation.trim() || isBusy"
          data-testid="check"
          @click="handleCheck"
        >
          {{ $t(`${texts}.check`) }}
        </button>
        <button
          type="button"
          class="button is-small is-text"
          :disabled="!explanation.trim()"
          @click="handleSave"
        >
          {{ isSaved ? $t('student.tutor.saved') : $t('student.tutor.saveNote') }}
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.row .input {
  flex: 1;
  min-width: 14rem;
}

.more {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.check {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--neutral-20);
}
</style>

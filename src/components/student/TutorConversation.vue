<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useLearnerStore, type Place } from '@/stores/learner';
import { citedIn } from '@/utils/learnerTutor';
import { sourceLink } from '@/utils/connections';

// the one WeLearn tutor, as a conversation: the turns of this place, the learner's input, and
// (in the spaces) a hint or a direct explanation on request. the parent decides what a message
// asks for (it sends it to the store)
const props = defineProps<{ place: Place; withHelp?: boolean; placeholder?: string }>();
const emit = defineEmits<{ send: [text: string]; help: [mode: 'hint' | 'direct'] }>();

const store = useLearnerStore();
const draft = ref('');
const turns = computed(() => store.turnsOf(props.place));
const status = computed(() => store.status[props.place] || 'idle');
const isBusy = computed(() => ['thinking', 'searching'].includes(status.value));

// the WeLearn documents a tutor answer cites, to open them
const documents = computed(() => {
  const all = [...(store.spaceDocuments[props.place] || []), ...store.thread.resources];
  return all.filter(
    (doc, index) =>
      all.findIndex((other) => other.payload.document_id === doc.payload.document_id) === index
  );
});
const citations = (text: string) => citedIn(text, documents.value);

const list = ref<HTMLElement | null>(null);
watch(
  () => turns.value.length,
  async () => {
    await nextTick();
    list.value?.lastElementChild?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
  }
);

const handleSend = () => {
  if (!draft.value.trim() || isBusy.value) return;
  emit('send', draft.value.trim());
  draft.value = '';
};
</script>
<template>
  <section class="tutor" :data-testid="`tutor-${place}`">
    <ol ref="list" class="turns" aria-live="polite">
      <li
        v-for="(turn, index) in turns"
        :key="index"
        class="turn"
        :class="turn.role === 'learner' ? 'is-learner' : 'is-tutor'"
        :data-testid="`turn-${turn.role}`"
      >
        <p class="turn-text">{{ turn.text }}</p>
        <p v-if="turn.role === 'tutor' && citations(turn.text).length" class="cited">
          {{ $t('student.tutor.usedDocs') }} :
          <template v-for="(doc, i) in citations(turn.text)" :key="doc.payload.document_id">
            <a :href="sourceLink(doc)" target="_blank" rel="noopener">{{
              doc.payload.document_title
            }}</a
            ><span v-if="i < citations(turn.text).length - 1"> · </span>
          </template>
        </p>
      </li>
    </ol>
    <!-- what belongs inside the conversation after the turns (the starting choices) -->
    <slot name="after-turns" />

    <!-- only what is really happening: a search for sources, or the answer being written -->
    <p v-if="isBusy" class="status" data-testid="tutor-thinking">
      <span class="loader" aria-hidden="true" />
      {{ status === 'searching' ? $t('student.tutor.searching') : $t('student.tutor.thinking') }}
    </p>
    <p
      v-else-if="status === 'unavailable' || status === 'error'"
      class="status is-problem"
      role="alert"
      :data-testid="`tutor-${status}`"
    >
      {{ $t(`student.tutor.${status}`) }}
    </p>

    <form class="input-row" @submit.prevent="handleSend">
      <textarea
        v-model="draft"
        class="textarea"
        rows="2"
        :placeholder="placeholder || $t('student.tutor.placeholder')"
        :aria-label="placeholder || $t('student.tutor.placeholder')"
        data-testid="tutor-input"
        @keydown.enter.exact.prevent="handleSend"
      />
      <div class="input-actions">
        <button
          type="submit"
          class="button is-primary is-small"
          :disabled="!draft.trim() || isBusy"
          data-testid="tutor-send"
        >
          {{ $t('student.tutor.send') }}
        </button>
        <template v-if="withHelp && turns.length">
          <button
            type="button"
            class="button is-small is-text"
            :disabled="isBusy"
            data-testid="tutor-hint"
            @click="emit('help', 'hint')"
          >
            {{ $t('student.tutor.hint') }}
          </button>
          <button
            type="button"
            class="button is-small is-text"
            :disabled="isBusy"
            data-testid="tutor-direct"
            @click="emit('help', 'direct')"
          >
            {{ $t('student.tutor.direct') }}
          </button>
        </template>
      </div>
    </form>
  </section>
</template>

<style scoped>
.turns {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  list-style: none;
}

.turn {
  max-width: 90%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  line-height: 1.5;
}

.turn-text {
  white-space: pre-wrap;
}

.is-tutor {
  align-self: flex-start;
  background: var(--neutral-10);
}

.is-learner {
  align-self: flex-end;
  background: var(--primary-lighter);
}

.cited {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.status.is-problem {
  color: var(--neutral-90);
}

.input-row {
  margin-top: 1rem;
}

.input-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.loader {
  width: 0.9rem;
  height: 0.9rem;
  border: 2px solid var(--neutral-20);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

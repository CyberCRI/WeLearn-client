<script setup lang="ts">
import { computed, ref } from 'vue';
import i18n from '@/localisation/i18n';
import TutorConversation from '@/components/student/TutorConversation.vue';
import { useSpaceTutor } from '@/components/student/useSpaceTutor';
import { sourceLink } from '@/utils/connections';

// INVESTIGATE: a question, WeLearn's real search with its relevance checks, what each source
// really says (its quote checked against the passage, or else the abstract), then the tutor
// helps the learner interpret, compare and reach their own conclusion
const { store, send, help, request } = useSpaceTutor('investigate');
const { t } = i18n.global;
const texts = 'student.investigate';

const question = ref(store.thread.purpose || store.thread.topic);
const conclusion = ref('');
const isSaved = ref(false);
const status = computed(() => store.status.investigate || 'idle');
const isBusy = computed(() => ['searching', 'thinking'].includes(status.value));
const evidence = computed(() => store.evidence);

const handleConclusion = () => {
  request('conclusion', conclusion.value.trim(), t(`${texts}.conclusion`));
  isSaved.value = false;
};
const handleSave = () => {
  store.addNote('investigate', conclusion.value);
  isSaved.value = true;
};
// the sources compared are the ones the learner kept, or else all those found
const handleCompare = () =>
  request(
    'compare',
    (store.thread.resources.length
      ? store.thread.resources
      : evidence.value?.items.map((item) => item.document) || []
    )
      .map((doc) => `« ${doc.payload.document_title} »`)
      .join(', '),
    t(`${texts}.compare`)
  );
</script>
<template>
  <div class="space-activity" data-testid="investigate-space">
    <form @submit.prevent="store.investigate(question)">
      <label class="label" for="question">{{ $t(`${texts}.questionLabel`) }}</label>
      <div class="row">
        <input
          id="question"
          v-model="question"
          class="input"
          type="text"
          :placeholder="$t(`${texts}.placeholder`)"
          data-testid="investigate-question"
        />
        <button
          type="submit"
          class="button is-primary"
          :disabled="!question.trim() || isBusy"
          data-testid="find-evidence"
        >
          {{ $t(`${texts}.find`) }}
        </button>
      </div>
    </form>

    <p v-if="isBusy && !store.turnsOf('investigate').length" class="status" aria-live="polite">
      {{ $t(`${texts}.${status === 'searching' ? 'searching' : 'reading'}`) }}
    </p>
    <p
      v-else-if="(status === 'unavailable' || status === 'error') && !evidence"
      class="status"
      role="alert"
    >
      {{ $t(`student.tutor.${status}`) }}
    </p>

    <template v-if="evidence">
      <p v-if="!evidence.items.length" class="status" data-testid="no-evidence">
        {{ $t(`${texts}.none`) }}
      </p>
      <template v-else>
        <p class="scope">{{ $t(`${texts}.scope`) }}</p>
        <ul class="sources" data-testid="evidence">
          <li
            v-for="item in evidence.items"
            :key="item.document.payload.document_id"
            class="source"
            data-testid="evidence-item"
          >
            <p class="source-head">
              <a :href="sourceLink(item.document, item.quote)" target="_blank" rel="noopener">{{
                item.document.payload.document_title
              }}</a>
              <span class="tag is-light">{{ $t(`${texts}.positions.${item.position}`) }}</span>
              <span class="tag is-white">{{ $t(`${texts}.kinds.${item.kind}`) }}</span>
            </p>
            <p>{{ item.says }}</p>
            <blockquote class="quote">
              <span class="quote-from" :data-testid="`quote-${item.quoteFrom}`">
                {{ $t(`${texts}.${item.quoteFrom}`) }} :
              </span>
              « {{ item.quote }} »
            </blockquote>
            <p v-if="item.limits" class="limits">
              <strong>{{ $t(`${texts}.limits`) }} :</strong> {{ item.limits }}
            </p>
            <button
              type="button"
              class="button is-small is-text"
              :data-testid="`keep-${item.document.payload.document_id}`"
              @click="store.toggleResource(item.document)"
            >
              {{ store.isKept(item.document) ? `✓ ${$t(`${texts}.kept`)}` : $t(`${texts}.keep`) }}
            </button>
          </li>
        </ul>
        <p v-if="evidence.setAside.length" class="muted">
          {{ $t(`${texts}.setAside`, { count: evidence.setAside.length }) }}
        </p>

        <div class="row mt-4">
          <button
            type="button"
            class="button is-small"
            :disabled="isBusy"
            data-testid="interpret"
            @click="request('interpret', question.trim(), $t(`${texts}.interpret`))"
          >
            {{ $t(`${texts}.interpret`) }}
          </button>
          <button
            type="button"
            class="button is-small"
            :disabled="isBusy"
            data-testid="compare"
            @click="handleCompare"
          >
            {{ $t(`${texts}.compare`) }}
          </button>
        </div>
      </template>
    </template>

    <TutorConversation place="investigate" with-help class="mt-4" @send="send" @help="help" />

    <section v-if="evidence?.items.length" class="conclusion" data-testid="conclusion">
      <label class="label" for="conclusion">{{ $t(`${texts}.conclusionTitle`) }}</label>
      <textarea
        id="conclusion"
        v-model="conclusion"
        class="textarea"
        rows="3"
        :placeholder="$t(`${texts}.conclusionPlaceholder`)"
        data-testid="conclusion-text"
      />
      <div class="row mt-2">
        <button
          type="button"
          class="button is-small is-primary"
          :disabled="!conclusion.trim() || isBusy"
          data-testid="conclusion-feedback"
          @click="handleConclusion"
        >
          {{ $t(`${texts}.conclusion`) }}
        </button>
        <button
          type="button"
          class="button is-small is-text"
          :disabled="!conclusion.trim()"
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

.status,
.scope,
.muted {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.sources {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.75rem;
}

.source {
  padding: 1rem 1.25rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
}

.source-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.quote {
  margin-top: 0.5rem;
  padding-left: 0.75rem;
  border-left: 3px solid var(--neutral-20);
  font-size: 0.9rem;
  font-style: italic;
  color: var(--neutral-80);
}

.quote-from {
  font-style: normal;
  font-weight: 600;
}

.limits {
  margin-top: 0.4rem;
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.conclusion {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--neutral-20);
}
</style>

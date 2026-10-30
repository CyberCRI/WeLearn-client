<script setup lang="ts">
import { computed, ref } from 'vue';
import i18n from '@/localisation/i18n';
import TutorConversation from '@/components/student/TutorConversation.vue';
import { useSpaceTutor } from '@/components/student/useSpaceTutor';

// ENVISION: a future-oriented question, a few contrasted scenarios clearly marked as imagined
// (not forecasts), then the tutor helps compare them and examine assumptions, or the learner's own
const { store, send, help, request } = useSpaceTutor('envision');
const { t } = i18n.global;
const texts = 'student.envision';

const question = ref(store.thread.purpose || store.thread.topic);
const ownScenario = ref('');
const isSaved = ref(false);
const status = computed(() => store.status.envision || 'idle');
const isBusy = computed(() => status.value === 'thinking');

const LISTS = ['assumptions', 'drivers', 'uncertainties'] as const;
const LINES = ['environment', 'society', 'benefits', 'difficulties', 'plausibility'] as const;

const scenarioNames = computed(() =>
  store.scenarios.map((scenario) => `« ${scenario.name} »`).join(', ')
);
const handleOwn = () => {
  request('scenario', ownScenario.value.trim(), t(`${texts}.scenario`));
  isSaved.value = false;
};
const handleSave = () => {
  store.addNote('envision', ownScenario.value);
  isSaved.value = true;
};
</script>
<template>
  <div class="space-activity" data-testid="envision-space">
    <form @submit.prevent="store.envision(question)">
      <label class="label" for="future-question">{{ $t(`${texts}.questionLabel`) }}</label>
      <div class="row">
        <input
          id="future-question"
          v-model="question"
          class="input"
          type="text"
          :placeholder="$t(`${texts}.placeholder`)"
          data-testid="envision-question"
        />
        <button
          type="submit"
          class="button is-primary"
          :disabled="!question.trim() || isBusy"
          data-testid="develop-scenarios"
        >
          {{ $t(`${texts}.develop`) }}
        </button>
      </div>
    </form>

    <p v-if="isBusy && !store.scenarios.length" class="status" aria-live="polite">
      {{ $t(`${texts}.thinking`) }}
    </p>
    <p
      v-else-if="(status === 'unavailable' || status === 'error') && !store.scenarios.length"
      class="status"
      role="alert"
    >
      {{ $t(`student.tutor.${status}`) }}
    </p>

    <template v-if="store.scenarios.length">
      <p class="notification is-warning is-light not-forecast" data-testid="not-forecast">
        {{ $t(`${texts}.notForecast`) }}
      </p>
      <div class="scenarios" data-testid="scenarios">
        <article v-for="scenario in store.scenarios" :key="scenario.name" class="scenario">
          <h3 class="scenario-name">{{ scenario.name }}</h3>
          <p>{{ scenario.story }}</p>
          <dl>
            <template v-for="key in LISTS" :key="key">
              <dt>{{ $t(`${texts}.fields.${key}`) }}</dt>
              <dd>
                <ul class="list">
                  <li v-for="item in scenario[key]" :key="item">{{ item }}</li>
                </ul>
              </dd>
            </template>
            <template v-for="key in LINES" :key="key">
              <dt>{{ $t(`${texts}.fields.${key}`) }}</dt>
              <dd>{{ scenario[key] }}</dd>
            </template>
          </dl>
        </article>
      </div>
      <div class="row mt-4">
        <button
          type="button"
          class="button is-small"
          :disabled="isBusy"
          data-testid="compare-futures"
          @click="request('compare', scenarioNames, $t(`${texts}.compare`))"
        >
          {{ $t(`${texts}.compare`) }}
        </button>
        <button
          type="button"
          class="button is-small"
          :disabled="isBusy"
          @click="request('assumptions', scenarioNames, $t(`${texts}.assumptions`))"
        >
          {{ $t(`${texts}.assumptions`) }}
        </button>
      </div>
    </template>

    <TutorConversation place="envision" with-help class="mt-4" @send="send" @help="help" />

    <section class="own" data-testid="own-scenario">
      <label class="label" for="own-scenario">{{ $t(`${texts}.myScenarioTitle`) }}</label>
      <textarea
        id="own-scenario"
        v-model="ownScenario"
        class="textarea"
        rows="3"
        :placeholder="$t(`${texts}.myScenarioPlaceholder`)"
      />
      <div class="row mt-2">
        <button
          type="button"
          class="button is-small is-primary"
          :disabled="!ownScenario.trim() || isBusy"
          @click="handleOwn"
        >
          {{ $t(`${texts}.scenario`) }}
        </button>
        <button
          type="button"
          class="button is-small is-text"
          :disabled="!ownScenario.trim()"
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

.status {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.not-forecast {
  margin-top: 1rem;
}

.scenarios {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
}

.scenario {
  padding: 1rem 1.25rem;
  border: 1px solid var(--neutral-20);
  border-top: 4px solid var(--accent);
  border-radius: 8px;
  font-size: 0.9rem;
}

.scenario-name {
  font-size: 1rem;
  font-weight: 700;
}

.scenario dt {
  margin-top: 0.6rem;
  font-weight: 600;
}

.list {
  margin-left: 1.1rem;
  list-style: disc;
}

.own {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--neutral-20);
}
</style>

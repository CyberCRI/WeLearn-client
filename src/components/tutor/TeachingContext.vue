<script setup lang="ts">
import type { TeachingContext } from '@/types';
import {
  LEVELS,
  SESSION_LENGTHS,
  SESSION_MODES,
  SESSION_TYPES,
  formatHours
} from '@/utils/teachingContext';

// the teaching context the syllabus did not give, as quick choices; all optional, and a value
// the teacher did not give stays empty. values read from the syllabus are shown elsewhere
const props = defineProps<{
  context: TeachingContext;
  prefilled: (keyof TeachingContext)[];
  updateContext: <K extends keyof TeachingContext>(key: K, value: TeachingContext[K]) => void;
}>();

const valueOf = (e: Event) => (e.target as HTMLInputElement | HTMLSelectElement).value;

// whole positive numbers only; anything else means "not given"
const onCount = (key: 'sessions' | 'classSize', e: Event) => {
  const value = Number(valueOf(e));
  props.updateContext(key, Number.isInteger(value) && value > 0 ? value : null);
};

const isAsked = (key: keyof TeachingContext) => !props.prefilled.includes(key);
</script>

<template>
  <section class="context box" data-testid="teaching-context">
    <h2 class="title is-6 mb-1">
      {{ $t('tutor.course.contextTitle') }}
      <span class="optional">{{ $t('tutor.course.optional') }}</span>
    </h2>
    <p class="is-size-7 has-text-grey mb-4">{{ $t('tutor.course.contextHint') }}</p>

    <div class="context-grid">
      <div v-if="isAsked('title')" class="field full">
        <label class="label" for="context-title">{{ $t('tutor.course.fields.title') }}</label>
        <input
          id="context-title"
          class="input"
          type="text"
          :value="context.title"
          @input="updateContext('title', valueOf($event))"
        />
      </div>

      <div v-if="isAsked('discipline')" class="field">
        <label class="label" for="context-discipline">
          {{ $t('tutor.course.fields.discipline') }}
        </label>
        <input
          id="context-discipline"
          class="input"
          type="text"
          :placeholder="$t('tutor.course.disciplinePlaceholder')"
          :value="context.discipline"
          @input="updateContext('discipline', valueOf($event))"
        />
      </div>

      <div v-if="isAsked('level')" class="field">
        <label class="label" for="context-level">{{ $t('tutor.course.fields.level') }}</label>
        <div class="select is-fullwidth">
          <select
            id="context-level"
            :value="context.level"
            @change="updateContext('level', valueOf($event))"
          >
            <option value="">{{ $t('tutor.course.choose') }}</option>
            <option v-for="level in LEVELS" :key="level" :value="level">
              {{ $t(`tutor.course.levels.${level}`) }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="isAsked('sessions')" class="field">
        <label class="label" for="context-sessions">
          {{ $t('tutor.course.fields.sessions') }}
        </label>
        <input
          id="context-sessions"
          class="input"
          type="number"
          min="1"
          step="1"
          :value="context.sessions ?? ''"
          @input="onCount('sessions', $event)"
        />
      </div>

      <div v-if="isAsked('sessionLength')" class="field">
        <label class="label" for="context-length">
          {{ $t('tutor.course.fields.sessionLength') }}
        </label>
        <div class="select is-fullwidth">
          <select
            id="context-length"
            :value="context.sessionLength ?? ''"
            @change="updateContext('sessionLength', Number(valueOf($event)) || null)"
          >
            <option value="">{{ $t('tutor.course.choose') }}</option>
            <option v-for="hours in SESSION_LENGTHS" :key="hours" :value="hours">
              {{ formatHours(hours) }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="isAsked('sessionType')" class="field">
        <label class="label" for="context-type">
          {{ $t('tutor.course.fields.sessionType') }}
        </label>
        <div class="select is-fullwidth">
          <select
            id="context-type"
            :value="context.sessionType"
            @change="updateContext('sessionType', valueOf($event))"
          >
            <option value="">{{ $t('tutor.course.choose') }}</option>
            <option v-for="type in SESSION_TYPES" :key="type" :value="type">
              {{ $t(`tutor.course.sessionTypes.${type}`) }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="isAsked('sessionMode')" class="field">
        <label class="label" for="context-mode">{{ $t('tutor.course.fields.sessionMode') }}</label>
        <div class="select is-fullwidth">
          <select
            id="context-mode"
            :value="context.sessionMode"
            @change="
              updateContext('sessionMode', valueOf($event) as TeachingContext['sessionMode'])
            "
          >
            <option value="">{{ $t('tutor.course.choose') }}</option>
            <option v-for="mode in SESSION_MODES" :key="mode" :value="mode">
              {{ $t(`tutor.course.modes.${mode}`) }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="isAsked('classSize')" class="field">
        <label class="label" for="context-size">{{ $t('tutor.course.fields.classSize') }}</label>
        <input
          id="context-size"
          class="input"
          type="number"
          min="1"
          step="1"
          :value="context.classSize ?? ''"
          @input="onCount('classSize', $event)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.context {
  box-shadow: none;
  border: 1px solid var(--neutral-20);
}

.optional {
  margin-left: 0.25rem;
  font-weight: normal;
  font-size: 0.8rem;
  color: var(--neutral-70);
}

/* compact: three quick choices per row on wide screens */
.context-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0 1rem;
  .full {
    grid-column: 1 / -1;
  }
  .label {
    font-size: 0.875rem;
  }
}

@media (max-width: 1024px) {
  .context-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .context-grid {
    grid-template-columns: 1fr;
  }
}
</style>

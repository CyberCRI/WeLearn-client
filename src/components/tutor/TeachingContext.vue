<script setup lang="ts">
import type { TeachingContext } from '@/types';
import {
  LEVELS,
  SESSION_LENGTHS,
  SESSION_MODES,
  SESSION_TYPES,
  formatHours
} from '@/utils/teachingContext';

type Key = keyof TeachingContext;

// quick choices for parts of the teaching context; all optional, a value the teacher did not give
// stays empty. a value read from the syllabus is marked once, with the line it comes from on hover
const props = withDefaults(
  defineProps<{
    context: TeachingContext;
    prefilled: Key[];
    evidence?: Partial<Record<Key, string>>;
    // filled from the AI reading but not found word for word in the syllabus
    aiFilled?: Key[];
    updateContext: <K extends Key>(key: K, value: TeachingContext[K]) => void;
    keys?: Key[];
    // without a frame and heading, inside another section
    isPlain?: boolean;
  }>(),
  {
    evidence: () => ({}),
    aiFilled: () => [],
    keys: () => ['sessions', 'sessionLength', 'sessionType', 'sessionMode', 'classSize'],
    isPlain: false
  }
);

const CHOICES: Partial<Record<Key, { value: string | number; label: string }[]>> = {
  level: LEVELS.map((level) => ({ value: level, label: `tutor.course.levels.${level}` })),
  sessionLength: SESSION_LENGTHS.map((hours) => ({ value: hours, label: formatHours(hours) })),
  sessionType: SESSION_TYPES.map((type) => ({
    value: type,
    label: `tutor.course.sessionTypes.${type}`
  })),
  sessionMode: SESSION_MODES.map((mode) => ({ value: mode, label: `tutor.course.modes.${mode}` }))
};
const COUNTS: Key[] = ['sessions', 'classSize'];

const valueOf = (e: Event) => (e.target as HTMLInputElement | HTMLSelectElement).value;

// whole positive numbers only; anything else means "not given"
const onCount = (key: 'sessions' | 'classSize', e: Event) => {
  const value = Number(valueOf(e));
  props.updateContext(key, Number.isInteger(value) && value > 0 ? value : null);
};

const onChoice = (key: Key, e: Event) => {
  const value = valueOf(e);
  if (key === 'sessionLength') props.updateContext(key, Number(value) || null);
  else props.updateContext(key, value as never);
};

const isPrefilled = (key: Key) => props.prefilled.includes(key);
</script>

<template>
  <section :class="{ 'context box': !isPlain }" data-testid="teaching-context">
    <template v-if="!isPlain">
      <h2 class="title is-6 mb-1">
        {{ $t('tutor.course.contextTitle') }}
        <span class="optional">{{ $t('tutor.course.optional') }}</span>
      </h2>
      <p class="is-size-7 has-text-grey mb-4">{{ $t('tutor.course.contextHint') }}</p>
    </template>

    <div class="context-grid">
      <div v-for="key in keys" :key="key" class="field" :class="{ full: key === 'title' }">
        <label class="label" :for="`context-${key}`">{{ $t(`tutor.course.fields.${key}`) }}</label>
        <div v-if="CHOICES[key]" class="select is-fullwidth">
          <select
            :id="`context-${key}`"
            :value="context[key] ?? ''"
            :data-testid="`context-${key}`"
            @change="onChoice(key, $event)"
          >
            <option value="">{{ $t('tutor.course.choose') }}</option>
            <option v-for="choice in CHOICES[key]" :key="choice.value" :value="choice.value">
              {{ key === 'sessionLength' ? choice.label : $t(choice.label) }}
            </option>
          </select>
        </div>
        <input
          v-else-if="COUNTS.includes(key)"
          :id="`context-${key}`"
          class="input"
          type="number"
          min="1"
          step="1"
          :value="context[key] ?? ''"
          :data-testid="`context-${key}`"
          @input="onCount(key as 'sessions' | 'classSize', $event)"
        />
        <input
          v-else
          :id="`context-${key}`"
          class="input"
          type="text"
          :placeholder="key === 'discipline' ? $t('tutor.course.disciplinePlaceholder') : ''"
          :value="context[key]"
          :data-testid="`context-${key}`"
          @input="updateContext(key, valueOf($event) as never)"
        />
        <p
          v-if="isPrefilled(key)"
          class="help from-syllabus"
          :title="evidence[key]"
          data-testid="prefilled"
        >
          {{ $t('tutor.course.fromSyllabus') }}
        </p>
        <p v-else-if="aiFilled.includes(key)" class="help read-by-ai" data-testid="ai-filled">
          {{ $t('tutor.course.readByAi') }}
        </p>
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

.from-syllabus {
  color: var(--neutral-70);
  cursor: help;
}

.read-by-ai {
  color: var(--neutral-90);
  font-weight: 600;
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

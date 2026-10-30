<script setup lang="ts">
import { computed, ref } from 'vue';
import i18n from '@/localisation/i18n';
import {
  CONTRIBUTION_ADDRESS,
  contributionMailto,
  contributionText,
  emptyContribution,
  materialLinks,
  type PracticeContribution
} from '@/utils/teachingPractices';

// sharing a teaching practice, voluntarily: the teacher writes it, reads it back, then sends it
// from their own mail client to the WeLearn team (or copies it). WeLearn has no service to receive
// contributions yet, so nothing is stored or published from here; a practice joins the collection
// only after review and with the teacher's agreement. teaching materials are shared as links;
// files can only travel as attachments of that e-mail, since WeLearn cannot store them yet
const { t } = i18n.global;
const texts = 'journey.teach.practices.form';

const FIELDS: { key: keyof PracticeContribution; isLong?: boolean; isOptional?: boolean }[] = [
  { key: 'discipline' },
  { key: 'course' },
  { key: 'level' },
  { key: 'topic', isLong: true },
  { key: 'approach', isLong: true },
  { key: 'resources', isLong: true, isOptional: true },
  { key: 'lessons', isLong: true, isOptional: true }
];

const contribution = ref(emptyContribution());
const isPrepared = ref(false);
const materials = computed(() => materialLinks(contribution.value.materials));
const isComplete = computed(
  () =>
    FIELDS.every(({ key, isOptional }) => isOptional || contribution.value[key].trim()) &&
    !materials.value.invalid.length
);

const labels = computed(
  () =>
    Object.fromEntries(
      [...FIELDS.map(({ key }) => key), 'materials'].map((key) => [key, t(`${texts}.${key}`)])
    ) as Record<keyof PracticeContribution, string>
);
const text = computed(() => contributionText(contribution.value, labels.value));
const mailto = computed(() => contributionMailto(t(`${texts}.subject`), text.value));

// the e-mail is sent by the teacher, from their mail client: WeLearn never knows whether it left,
// so it never says it did
const isMailOpened = ref(false);
// some mail clients cut very long links: then copying is the safe way
const MAX_MAILTO_LENGTH = 1800;
const isLong = computed(() => mailto.value.length > MAX_MAILTO_LENGTH);

// what happens after sending, in order
const NEXT_STEPS = ['send', 'review', 'publish'] as const;

const isCopied = ref(false);
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(text.value);
    isCopied.value = true;
    setTimeout(() => (isCopied.value = false), 2000);
  } catch {
    isCopied.value = false;
  }
};
</script>
<template>
  <div class="teach-page">
    <div class="teach-content">
      <router-link class="back-link" :to="{ name: 'teach-practices' }">
        ← {{ $t('journey.teach.practices.back') }}
      </router-link>
      <h1 class="title is-3 is-size-4-mobile mt-5">{{ $t(`${texts}.title`) }}</h1>
      <p class="subtitle is-6 mt-2">{{ $t(`${texts}.intro`) }}</p>

      <form
        v-if="!isPrepared"
        class="form"
        data-testid="share-form"
        @submit.prevent="isPrepared = true"
      >
        <div v-for="field in FIELDS" :key="field.key" class="field">
          <label class="label" :for="`practice-${field.key}`">
            {{ $t(`${texts}.${field.key}`) }}
            <span v-if="field.isOptional" class="muted">({{ $t(`${texts}.optional`) }})</span>
          </label>
          <textarea
            v-if="field.isLong"
            :id="`practice-${field.key}`"
            v-model="contribution[field.key]"
            class="textarea"
            rows="3"
            :data-testid="`practice-${field.key}`"
          />
          <input
            v-else
            :id="`practice-${field.key}`"
            v-model="contribution[field.key]"
            class="input"
            type="text"
            :data-testid="`practice-${field.key}`"
          />
        </div>

        <!-- teaching materials: links only; files go with the e-mail (WeLearn cannot store them) -->
        <fieldset class="materials" data-testid="practice-materials-section">
          <legend class="label">
            {{ $t(`${texts}.materials`) }}
            <span class="muted">({{ $t(`${texts}.optional`) }})</span>
          </legend>
          <p class="help-text">{{ $t(`${texts}.materialsHelp`) }}</p>
          <textarea
            id="practice-materials"
            v-model="contribution.materials"
            class="textarea"
            rows="3"
            :placeholder="$t(`${texts}.materialsPlaceholder`)"
            :aria-label="$t(`${texts}.materials`)"
            data-testid="practice-materials"
          />
          <p v-if="materials.invalid.length" class="help is-danger" data-testid="materials-invalid">
            {{ $t(`${texts}.materialsInvalid`) }} {{ materials.invalid.join(' · ') }}
          </p>
          <p class="help-text" data-testid="materials-files">{{ $t(`${texts}.files`) }}</p>
        </fieldset>

        <button
          type="submit"
          class="button is-primary"
          :disabled="!isComplete"
          data-testid="prepare-contribution"
        >
          {{ $t(`${texts}.prepare`) }}
        </button>
      </form>

      <div v-else data-testid="contribution-ready">
        <h2 class="review-title">{{ $t(`${texts}.reviewTitle`) }}</h2>
        <pre class="preview" data-testid="contribution-text">{{ text }}</pre>
        <p class="help-text" data-testid="contribution-privacy">{{ $t(`${texts}.privacy`) }}</p>

        <!-- submission is not publication: the three steps, said before sending -->
        <div class="notification is-light" data-testid="contribution-note">
          <p>
            <strong>{{ $t(`${texts}.nextTitle`) }}</strong>
          </p>
          <ol class="next-steps">
            <li v-for="step in NEXT_STEPS" :key="step" :data-testid="`next-${step}`">
              {{ $t(`${texts}.next.${step}`, { address: CONTRIBUTION_ADDRESS }) }}
            </li>
          </ol>
        </div>

        <div class="actions">
          <a
            class="button is-primary"
            :href="mailto"
            data-testid="send-contribution"
            @click="isMailOpened = true"
          >
            {{ $t(`${texts}.send`) }}
          </a>
          <button type="button" class="button" data-testid="copy-contribution" @click="handleCopy">
            {{ isCopied ? $t(`${texts}.copied`) : $t(`${texts}.copy`) }}
          </button>
          <button type="button" class="button is-text" @click="isPrepared = false">
            {{ $t(`${texts}.edit`) }}
          </button>
        </div>
        <p v-if="isLong" class="help-text" data-testid="contribution-long">
          {{ $t(`${texts}.long`, { address: CONTRIBUTION_ADDRESS }) }}
        </p>
        <p v-if="isMailOpened" class="help-text" role="status" data-testid="mail-opened">
          {{ $t(`${texts}.mailOpened`, { address: CONTRIBUTION_ADDRESS }) }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.teach-page {
  height: 100%;
  overflow-y: auto;
}

.teach-content {
  max-width: 48rem;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.back-link {
  font-size: 0.9rem;
}

.form {
  margin-top: 1.5rem;
}

.muted {
  font-weight: 400;
  color: var(--neutral-70);
}

.materials {
  margin: 1.5rem 0;
}

.help-text {
  margin: 0.25rem 0 0.5rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.review-title {
  margin-top: 1.5rem;
  font-size: 1.1rem;
  font-weight: 700;
}

.next-steps {
  margin: 0.25rem 0 0 1.25rem;
  list-style: decimal;
}

.preview {
  padding: 1rem;
  border-radius: 8px;
  background: var(--neutral-10);
  white-space: pre-wrap;
  font-family: inherit;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>

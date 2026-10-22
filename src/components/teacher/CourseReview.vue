<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import AiLabel from '@/components/AiLabel.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import SpaceLabel from '@/components/SpaceLabel.vue';
import ReviewField from '@/components/teacher/ReviewField.vue';
import { useCourseDesignStore } from '@/stores/courseDesign';
import { COURSE_EXTRA_KEYS, COURSE_OVERVIEW_KEYS } from '@/types';
import i18n from '@/localisation/i18n';

// "let's check your course": a compact link to the original, the course overview, the description
// and objectives as read from the syllabus, optional details; every piece says where it comes
// from. nothing here is sent: edits stay in the store, in this tab
const store = useCourseDesignStore();

const texts = 'journey.teach.adapt.review';
const detectedType = computed(() => store.extraction?.detected_document_type);
const isSyllabus = computed(() => detectedType.value === 'syllabus');
const hasAnyExtra = computed(() => COURSE_EXTRA_KEYS.some((key) => store.extras[key].trim()));
const MULTILINE_EXTRAS = ['sessions', 'assessment'];

// objectives keep their place in the store (edit and restore use it); shown in two groups
const indexedObjectives = computed(() =>
  store.objectives.map((objective, index) => ({ objective, index }))
);
const courseObjectives = computed(() =>
  indexedObjectives.value.filter(({ objective }) => !objective.isProgramme)
);
const programmeObjectives = computed(() =>
  indexedObjectives.value.filter(({ objective }) => objective.isProgramme)
);

// a local link to the teacher's own file (it never leaves the device again)
const originalUrl = ref<string | null>(null);
watch(
  () => store.file,
  (file) => {
    if (originalUrl.value) URL.revokeObjectURL(originalUrl.value);
    originalUrl.value = file && store.source === 'upload' ? URL.createObjectURL(file) : null;
  },
  { immediate: true }
);
onBeforeUnmount(() => {
  if (originalUrl.value) URL.revokeObjectURL(originalUrl.value);
});

// only a real upload was read by the API; the example and pasted text never were
const isRead = computed(() => store.source === 'upload');
const originalName = computed(() =>
  store.isExample
    ? i18n.global.t('journey.teach.adapt.example.fileName')
    : store.isPasted
      ? i18n.global.t(`${texts}.pastedName`)
      : store.file?.name
);
const fileSize = computed(() =>
  isRead.value && store.file ? `${Math.max(1, Math.round(store.file.size / 1024))} KB` : ''
);
</script>
<template>
  <div class="course-review">
    <p v-if="store.isExample" class="example-banner" data-testid="example-banner">
      {{ $t(`${texts}.exampleBanner`) }}
    </p>
    <p v-else-if="store.isPasted" class="example-banner" data-testid="pasted-banner">
      {{ $t(`${texts}.pastedBanner`) }}
    </p>

    <h2 class="review-title">{{ $t(`${texts}.title`) }}</h2>
    <p class="review-intro">{{ $t(`${texts}.intro`) }}</p>

    <!-- the original, one compact line; the example and pasted text can be unfolded -->
    <div class="original" data-testid="original">
      <p class="file-line">
        <span class="original-name">{{ originalName }}</span>
        <span v-if="fileSize" class="file-size">{{ fileSize }}</span>
        <a v-if="originalUrl" :href="originalUrl" target="_blank" rel="noopener">
          {{ $t(`${texts}.openOriginal`) }}
        </a>
        <AiLabel v-if="isRead" class="ai-read" :text="$t('journey.teach.adapt.aiRead')" />
      </p>
      <details v-if="store.isExample || store.isPasted" class="original-details">
        <summary>{{ $t(`${texts}.showDocument`) }}</summary>
        <pre class="original-text">{{
          store.isExample ? $t('journey.teach.adapt.example.document') : store.pastedText
        }}</pre>
      </details>
      <!-- the type is only worth a line when it is not a syllabus -->
      <p v-if="isRead && detectedType && !isSyllabus" class="detected" data-testid="detected">
        {{ $t(`${texts}.detected.${detectedType}`) }}
        <span class="detected-hint">{{ $t(`${texts}.notSyllabusHint`) }}</span>
      </p>
    </div>

    <section class="course" data-testid="course">
      <!-- overview: the extraction does not return these yet, so they are only ever added -->
      <h3 class="section-title">{{ $t(`${texts}.overview`) }}</h3>
      <dl class="overview" data-testid="overview">
        <div v-for="key in COURSE_OVERVIEW_KEYS" :key="key" class="overview-line">
          <dt>{{ $t(`${texts}.overviewKeys.${key}`) }}</dt>
          <dd>
            <ReviewField
              :field="store.overview[key]"
              isPlain
              :isMultiline="key === 'topics'"
              :data-testid="`overview-${key}`"
              @save="(value) => store.setOverview(key, value)"
              @remove="store.setOverview(key, '')"
            />
          </dd>
        </div>
      </dl>

      <!-- as written in the syllabus: may mix programme and course information, so not renamed -->
      <h3 class="section-title">{{ $t(`${texts}.description`) }}</h3>
      <ReviewField
        :field="store.description"
        :isExample="store.isExample"
        isMultiline
        isCollapsible
        :missingText="store.isPasted ? $t(`${texts}.notFilled`) : $t(`${texts}.notFound`)"
        data-testid="description"
        @save="store.updateDescription"
        @restore="store.restoreDescription"
        @remove="store.updateDescription('')"
      />

      <h3 class="section-title">{{ $t(`${texts}.objectives`) }}</h3>
      <p v-if="!store.objectives.length" class="missing-line">
        {{ store.isPasted ? $t(`${texts}.noObjectivesYet`) : $t(`${texts}.noObjectives`) }}
      </p>
      <p v-else class="hint">{{ $t(`${texts}.programmeHint`) }}</p>
      <ol class="objectives">
        <li v-for="{ objective, index } in courseObjectives" :key="index" data-testid="objective">
          <ReviewField
            :field="objective"
            :isExample="store.isExample"
            @save="(value) => store.updateObjective(index, value)"
            @restore="store.restoreObjective(index)"
            @remove="store.removeObjective(index)"
          >
            <template #actions>
              <button
                type="button"
                class="button is-small is-text"
                data-testid="mark-programme"
                @click="store.toggleProgrammeObjective(index)"
              >
                {{ $t(`${texts}.markProgramme`) }}
              </button>
            </template>
          </ReviewField>
        </li>
      </ol>
      <ReviewField
        :field="null"
        :addLabel="$t(`${texts}.addObjective`)"
        class="add-objective"
        data-testid="add-objective"
        @save="store.addObjective"
      />

      <!-- marked by the teacher as degree-level: kept, unchanged, and can be moved back -->
      <div v-if="programmeObjectives.length" class="programme" data-testid="programme">
        <h4 class="programme-title">{{ $t(`${texts}.programmeTitle`) }}</h4>
        <ul class="programme-list">
          <li
            v-for="{ objective, index } in programmeObjectives"
            :key="index"
            data-testid="programme-objective"
          >
            <span>{{ objective.value }}</span>
            <button
              type="button"
              class="button is-small is-text"
              data-testid="unmark-programme"
              @click="store.toggleProgrammeObjective(index)"
            >
              {{ $t(`${texts}.unmarkProgramme`) }}
            </button>
          </li>
        </ul>
      </div>

      <!-- what the extraction does not read yet: only added by the teacher, only if useful -->
      <details class="more" :open="hasAnyExtra" data-testid="more">
        <summary>{{ $t(`${texts}.more`) }}</summary>
        <p class="panel-note">{{ $t(`${texts}.moreHint`) }}</p>
        <div class="extras">
          <div v-for="key in COURSE_EXTRA_KEYS" :key="key" class="field">
            <label class="label extra-label" :for="`extra-${key}`">
              {{ $t(`${texts}.extras.${key}`) }}
              <SpaceLabel
                v-if="store.extras[key].trim()"
                :text="$t(`${texts}.origin.added`)"
                tint="var(--tertiary-lighter)"
              />
            </label>
            <textarea
              v-if="MULTILINE_EXTRAS.includes(key)"
              :id="`extra-${key}`"
              class="textarea is-small"
              rows="2"
              :value="store.extras[key]"
              @input="store.setExtra(key, ($event.target as HTMLTextAreaElement).value)"
            />
            <input
              v-else
              :id="`extra-${key}`"
              class="input is-small"
              type="text"
              :value="store.extras[key]"
              @input="store.setExtra(key, ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </details>

      <p class="local-note" data-testid="local-note">{{ $t(`${texts}.localNote`) }}</p>

      <div class="review-actions">
        <button type="button" class="button is-text" @click="store.$reset()">
          {{ $t(`${texts}.startOver`) }}
        </button>
        <ButtonComponent
          v-if="!store.isConfirmed"
          color="primary"
          data-testid="confirm-button"
          @click="store.confirmCourse()"
        >
          {{ $t(`${texts}.confirm`) }}
        </ButtonComponent>
        <p v-else class="confirmed" role="status" data-testid="confirmed">
          {{ $t(`${texts}.confirmed`) }}
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.example-banner {
  margin-bottom: 1rem;
  padding: 0.6rem 1rem;
  border-left: 4px solid var(--lpi-yellow);
  border-radius: 4px;
  background: var(--lpi-yellow-lighter);
  font-weight: 600;
}

.course-review {
  max-width: 48rem;
}

.review-title {
  font-size: 1.35rem;
  font-weight: 700;
}

.review-intro {
  margin-top: 0.25rem;
  color: var(--neutral-80);
}

.original {
  margin-top: 1rem;
}

.file-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.75rem;
  font-size: 0.9rem;
}

.original-name {
  overflow: hidden;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size,
.panel-note {
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.ai-read {
  margin-left: auto;
}

.original-details summary {
  margin-top: 0.25rem;
  font-size: 0.85rem;
  cursor: pointer;
}

.original-text {
  max-height: 20rem;
  margin-top: 0.5rem;
  padding: 0.75rem;
  overflow: auto;
  border-radius: 4px;
  background: var(--neutral-10);
  font-family: inherit;
  font-size: 0.8rem;
  white-space: pre-wrap;
}

.detected {
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  background: var(--lpi-yellow-lighter);
  font-size: 0.9rem;
}

.detected-hint {
  display: block;
  color: var(--neutral-70);
}

.section-title {
  margin: 2rem 0 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--neutral-70);
}

/* overview: label on the left, value or "+ add" on the right, separated by thin lines */
.overview-line {
  display: grid;
  grid-template-columns: 11rem minmax(0, 1fr);
  gap: 1rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--neutral-20);
}

.overview-line dt {
  padding-top: 0.2rem;
  font-weight: 600;
}

.hint,
.missing-line {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.objectives {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
}

.add-objective {
  margin-top: 0.5rem;
}

.programme {
  margin-top: 1.25rem;
  padding-left: 1rem;
  border-left: 3px solid var(--neutral-20);
}

.programme-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--neutral-80);
}

.programme-list li {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.25rem 1rem;
  margin-top: 0.4rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.more {
  margin-top: 2rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
}

.more summary {
  font-weight: 600;
  cursor: pointer;
}

.extras {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem 1rem;
  margin-top: 0.75rem;
}

.extra-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.local-note {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.review-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.confirmed {
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  background: var(--primary-lighter);
  font-weight: 600;
}

@media (max-width: 600px) {
  .overview-line {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.25rem;
  }

  .extras {
    grid-template-columns: minmax(0, 1fr);
  }

  .ai-read {
    margin-left: 0;
  }
}
</style>

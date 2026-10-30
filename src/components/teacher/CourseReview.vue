<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import SpaceLabel from '@/components/SpaceLabel.vue';
import ReviewField from '@/components/teacher/ReviewField.vue';
import { COURSE_SCALE_TYPES, useCourseDesignStore } from '@/stores/courseDesign';
import { COURSE_EXTRA_KEYS, COURSE_OVERVIEW_KEYS, type MaterialType } from '@/types';
import { MATERIAL_TYPES } from '@/utils/courseReading';
import i18n from '@/localisation/i18n';

// "let's check your course": a compact link to the original, a short course card (what the
// syllabus states, then one line for what it does not), and the longer parts folded:
// objectives, sessions, description, optional details. every piece says where it comes from.
// nothing here is sent: edits stay in the store, in this tab
const store = useCourseDesignStore();

const texts = 'journey.teach.adapt.review';
const scratchTexts = 'journey.teach.scratch.review';

// a course from scratch: every line starts as WeLearn's proposal, said once on the card
const baseOrigin = computed(() => (store.isScratch ? 'suggested' : 'extracted'));
const SCRATCH_PARTS = [
  { key: 'activities', update: store.updateActivities, restore: store.restoreActivities },
  { key: 'assessment', update: store.updateAssessment, restore: store.restoreAssessment }
] as const;
const briefRecap = computed(() =>
  [store.brief.idea, store.brief.disciplineLevel, store.brief.format, store.brief.goals]
    .map((value) => value.trim())
    .filter(Boolean)
    .join('\n')
);
const detectedType = computed(() => store.extraction?.detected_document_type);
const isSyllabus = computed(() => detectedType.value === 'syllabus');
const hasAnyExtra = computed(() => COURSE_EXTRA_KEYS.some((key) => store.extras[key].trim()));
const MULTILINE_EXTRAS = ['assessment'];

// a whole course asks for its discipline, level and objectives; a single lesson or a fragment
// does not: only what applies is offered when missing (the basic reading counts as a course)
const isCourseScale = computed(
  () => !store.materialType || COURSE_SCALE_TYPES.includes(store.materialType)
);
const foundOverviewKeys = computed(() => COURSE_OVERVIEW_KEYS.filter((key) => store.overview[key]));
const missingOverviewKeys = computed(() =>
  COURSE_OVERVIEW_KEYS.filter(
    (key) => !store.overview[key] && (isCourseScale.value || key === 'title')
  )
);
const isObjectivesShown = computed(() => store.objectives.length > 0 || isCourseScale.value);

// what the material is: shown as text; the list to correct it only opens on request
const isTypeOpen = ref(false);
const handleTypeChange = (type: MaterialType) => {
  store.setMaterialType(type);
  isTypeOpen.value = false;
};

// objectives read as a plain list; their editors (correct, restore, programme-level) on request
const isObjectivesEditing = ref(false);
// "not found" only when WeLearn really looked for it (the full reading); otherwise "not filled in"
const missingLabel = computed(() =>
  store.readingMode === 'full' ? `${texts}.notFoundOverview` : `${texts}.notFilledOverview`
);
const lines = (value: string) => value.split('\n').filter(Boolean);
const sessionCount = computed(() => (store.sessions ? lines(store.sessions.value).length : 0));
// a full reading that found nothing at all is said plainly
const isEmptyReading = computed(
  () =>
    store.readingMode === 'full' &&
    !foundOverviewKeys.value.length &&
    !store.topics &&
    !store.objectives.length &&
    !store.description
);

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

    <h2 class="review-title">
      {{ store.isScratch ? $t(`${scratchTexts}.title`) : $t(`${texts}.title`) }}
    </h2>
    <p class="review-intro">
      {{ store.isScratch ? $t(`${scratchTexts}.intro`) : $t(`${texts}.intro`) }}
    </p>

    <!-- a proposal: the teacher's brief, one click away, instead of a document -->
    <details v-if="store.isScratch" class="original-details brief" data-testid="brief-recap">
      <summary>{{ $t(`${scratchTexts}.yourBrief`) }}</summary>
      <p class="original-text">{{ briefRecap }}</p>
    </details>

    <!-- the original, one compact line; the example and pasted text can be unfolded -->
    <div v-if="!store.isScratch" class="original" data-testid="original">
      <p class="file-line">
        <span class="original-name">{{ originalName }}</span>
        <span v-if="fileSize" class="file-size">{{ fileSize }}</span>
        <a v-if="originalUrl" :href="originalUrl" target="_blank" rel="noopener">
          {{ $t(`${texts}.openOriginal`) }}
        </a>
        <span v-if="isRead" class="analysed" data-testid="ai-label">
          {{ $t('journey.teach.adapt.aiRead') }}
        </span>
      </p>
      <details v-if="store.isExample || store.isPasted" class="original-details">
        <summary>{{ $t(`${texts}.showDocument`) }}</summary>
        <pre class="original-text">{{
          store.isExample ? $t('journey.teach.adapt.example.document') : store.pastedText
        }}</pre>
      </details>
      <!-- what the material is: the AI's interpretation, which the teacher can change -->
      <div v-if="store.materialType" class="material-line" data-testid="material-type">
        <label for="material-type">{{ $t(`${texts}.materialLabel`) }}</label>
        <div v-if="isTypeOpen" class="select is-small">
          <select
            id="material-type"
            :value="store.materialType"
            @change="handleTypeChange(($event.target as HTMLSelectElement).value as MaterialType)"
          >
            <option v-for="type in MATERIAL_TYPES" :key="type" :value="type">
              {{ $t(`${texts}.materialTypes.${type}`) }}
            </option>
          </select>
        </div>
        <template v-else>
          <span>{{ $t(`${texts}.materialTypes.${store.materialType}`) }}</span>
          <span v-if="store.isMaterialTypeChanged" class="muted">
            ({{ $t(`${texts}.origin.edited`) }})
          </span>
          <button
            type="button"
            class="button is-small is-text"
            data-testid="change-material"
            @click="isTypeOpen = true"
          >
            {{ $t(`${texts}.correct`) }}
          </button>
        </template>
      </div>
      <p v-if="store.focusCourse" class="reading-note" data-testid="focus-course">
        {{ $t(`${texts}.focusCourse`, { title: store.focusCourse }) }}
      </p>
      <!-- the type is only worth a line when it is not a syllabus -->
      <p v-if="isRead && detectedType && !isSyllabus" class="detected" data-testid="detected">
        {{ $t(`${texts}.detected.${detectedType}`) }}
        <span class="detected-hint">{{ $t(`${texts}.notSyllabusHint`) }}</span>
      </p>
    </div>

    <!-- honest notes on the reading itself -->
    <p v-if="isEmptyReading" class="detected" data-testid="empty-reading">
      {{ $t(`${texts}.emptyReading`) }}
      <span class="detected-hint">{{ $t(`${texts}.notSyllabusHint`) }}</span>
    </p>

    <section class="course" data-testid="course">
      <!-- the course card: what the syllabus states, editable; one line for what it does not -->
      <div class="course-card" data-testid="overview">
        <p v-if="foundOverviewKeys.length || store.topics" class="card-note">
          {{
            store.isScratch
              ? $t(`${texts}.origin.suggested`)
              : store.isExample
                ? $t(`${texts}.origin.extractedExample`)
                : $t(`${texts}.fromDocument`)
          }}
        </p>
        <dl>
          <div v-for="key in foundOverviewKeys" :key="key" class="overview-line">
            <dt>{{ $t(`${texts}.overviewKeys.${key}`) }}</dt>
            <dd>
              <ReviewField
                :field="store.overview[key]"
                :isExample="store.isExample"
                isPlain
                :hiddenOrigin="baseOrigin"
                :data-testid="`overview-${key}`"
                @save="(value) => store.updateOverview(key, value)"
                @restore="store.restoreOverview(key)"
                @remove="store.updateOverview(key, '')"
              />
            </dd>
          </div>
          <div v-if="store.topics" class="overview-line">
            <dt>{{ $t(`${texts}.overviewKeys.topics`) }}</dt>
            <dd>
              <ReviewField
                :field="store.topics"
                isPlain
                isMultiline
                :hiddenOrigin="baseOrigin"
                data-testid="overview-topics"
                @save="store.updateTopics"
                @restore="store.restoreTopics"
                @remove="store.updateTopics('')"
              >
                <template #text="{ value }">
                  <div class="tags topics" data-testid="topics">
                    <span v-for="topic in lines(value)" :key="topic" class="tag">{{ topic }}</span>
                  </div>
                </template>
              </ReviewField>
            </dd>
          </div>
        </dl>
        <div
          v-if="missingOverviewKeys.length || !store.topics"
          class="missing-overview"
          data-testid="overview-missing"
        >
          <span class="missing-text">{{ $t(missingLabel) }}</span>
          <ReviewField
            v-for="key in missingOverviewKeys"
            :key="key"
            :field="null"
            isPlain
            :addLabel="$t(`${texts}.overviewKeys.${key}`)"
            :data-testid="`overview-${key}`"
            @save="(value) => store.updateOverview(key, value)"
          />
          <ReviewField
            v-if="!store.topics"
            :field="null"
            isPlain
            isMultiline
            :addLabel="$t(`${texts}.overviewKeys.topics`)"
            data-testid="overview-topics"
            @save="store.updateTopics"
          />
        </div>
      </div>

      <!-- the longer parts, folded so the page stays short -->
      <details v-if="isObjectivesShown" class="part" data-testid="objectives-part">
        <summary>
          {{ $t(`${texts}.objectives`) }}
          <span class="count">{{ store.objectives.length }}</span>
        </summary>
        <p v-if="!store.objectives.length" class="missing-line">
          {{ store.isPasted ? $t(`${texts}.noObjectivesYet`) : $t(`${texts}.noObjectives`) }}
        </p>
        <template v-if="!isObjectivesEditing">
          <ol v-if="courseObjectives.length" class="plain-list" data-testid="objective-list">
            <li v-for="{ objective, index } in courseObjectives" :key="index">
              {{ objective.value }}
              <span
                v-if="objective.origin === 'edited' || objective.origin === 'added'"
                class="muted"
              >
                ({{ $t(`${texts}.origin.${objective.origin}`) }})
              </span>
            </li>
          </ol>
          <div v-if="programmeObjectives.length" class="programme-plain" data-testid="programme">
            <p class="programme-title">{{ $t(`${texts}.programmeTitle`) }}</p>
            <ul class="plain-list">
              <li v-for="{ objective, index } in programmeObjectives" :key="index">
                {{ objective.value }}
              </li>
            </ul>
          </div>
          <button
            type="button"
            class="button is-small is-text edit-list"
            data-testid="edit-objectives"
            @click="isObjectivesEditing = true"
          >
            {{
              store.objectives.length ? $t(`${texts}.editObjectives`) : $t(`${texts}.addObjective`)
            }}
          </button>
        </template>
        <template v-else>
          <p v-if="store.objectives.length" class="hint">{{ $t(`${texts}.programmeHint`) }}</p>
          <ol class="objectives">
            <li
              v-for="{ objective, index } in courseObjectives"
              :key="index"
              data-testid="objective"
            >
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

          <!-- degree-level objectives (listed so in the syllabus, or moved by the teacher): kept,
           unchanged, and can be moved back -->
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
          <button
            type="button"
            class="button is-small edit-list"
            data-testid="done-objectives"
            @click="isObjectivesEditing = false"
          >
            {{ $t(`${texts}.done`) }}
          </button>
        </template>
      </details>

      <details
        v-if="store.sessions && store.materialType !== 'lesson'"
        class="part"
        data-testid="sessions-part"
      >
        <summary>
          {{ $t(`${texts}.sessions`) }}
          <span class="count">{{ sessionCount }}</span>
        </summary>
        <ReviewField
          :field="store.sessions"
          isPlain
          isMultiline
          :hiddenOrigin="baseOrigin"
          data-testid="sessions"
          @save="store.updateSessions"
          @restore="store.restoreSessions"
          @remove="store.updateSessions('')"
        >
          <template #text="{ value }">
            <ol class="sessions" data-testid="session-list">
              <li v-for="(session, index) in lines(value)" :key="index">{{ session }}</li>
            </ol>
          </template>
        </ReviewField>
      </details>

      <!-- as written in the syllabus: may mix programme and course information, so not renamed -->
      <details class="part" data-testid="description-part">
        <summary>
          {{ store.isScratch ? $t(`${scratchTexts}.purpose`) : $t(`${texts}.description`) }}
        </summary>
        <ReviewField
          :field="store.description"
          :isExample="store.isExample"
          isPlain
          isMultiline
          isCollapsible
          :hiddenOrigin="baseOrigin"
          :missingText="store.isPasted ? $t(`${texts}.notFilled`) : $t(`${texts}.notFound`)"
          data-testid="description"
          @save="store.updateDescription"
          @restore="store.restoreDescription"
          @remove="store.updateDescription('')"
        />
      </details>

      <!-- a proposal also suggests activities, assessment and sustainability opportunities -->
      <template v-if="store.isScratch">
        <details
          v-for="part in SCRATCH_PARTS"
          v-show="store[part.key]"
          :key="part.key"
          class="part"
          :data-testid="`${part.key}-part`"
        >
          <summary>
            {{ $t(`${scratchTexts}.${part.key}`) }}
            <span class="count">{{
              store[part.key] ? lines(store[part.key]!.value).length : 0
            }}</span>
          </summary>
          <ReviewField
            :field="store[part.key]"
            isPlain
            isMultiline
            hiddenOrigin="suggested"
            :data-testid="part.key"
            @save="part.update"
            @restore="part.restore"
            @remove="part.update('')"
          >
            <template #text="{ value }">
              <ul class="plain-list bullets">
                <li v-for="(item, index) in lines(value)" :key="index">{{ item }}</li>
              </ul>
            </template>
          </ReviewField>
        </details>

        <details
          v-if="store.opportunities.length"
          class="part"
          open
          data-testid="opportunities-part"
        >
          <summary>
            {{ $t(`${scratchTexts}.opportunities`) }}
            <span class="count">{{ store.keptIdeas.length }}</span>
          </summary>
          <p class="hint">{{ $t(`${scratchTexts}.opportunitiesHint`) }}</p>
          <ul class="opportunities">
            <li
              v-for="({ idea, isKept }, index) in store.opportunities"
              :key="index"
              :class="{ 'is-removed': !isKept }"
              data-testid="opportunity"
            >
              <div class="opportunity-text">
                <p class="opportunity-title">{{ idea.title }}</p>
                <p v-if="idea.anchor" class="muted">{{ idea.anchor }}</p>
                <p>{{ idea.why }}</p>
              </div>
              <button
                type="button"
                class="button is-small is-text"
                data-testid="toggle-opportunity"
                @click="store.toggleOpportunity(index)"
              >
                {{ isKept ? $t(`${scratchTexts}.remove`) : $t(`${scratchTexts}.keep`) }}
              </button>
            </li>
          </ul>
        </details>
      </template>

      <!-- what the reading does not return: only added by the teacher, only if useful -->
      <details v-else class="part" :open="hasAnyExtra" data-testid="more">
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

      <details
        v-if="store.droppedCount || store.isTextCut"
        class="about-reading"
        data-testid="about-reading"
      >
        <summary>{{ $t(`${texts}.aboutReading`) }}</summary>
        <p v-if="store.droppedCount" data-testid="dropped">
          {{ $t(`${texts}.dropped`, { count: store.droppedCount }) }}
        </p>
        <p v-if="store.isTextCut" data-testid="text-cut">{{ $t(`${texts}.textCut`) }}</p>
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

/* the course card: label on the left, value on the right, separated by thin lines */
.course-card {
  margin-top: 1.5rem;
  padding: 0.5rem 1.25rem 1rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
}

.overview-line {
  display: grid;
  grid-template-columns: 9rem minmax(0, 1fr);
  gap: 1rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--neutral-20);
}

.overview-line dt {
  padding-top: 0.2rem;
  font-weight: 600;
}

.topics {
  margin-top: 0.5rem;
}

/* what the syllabus does not state: one line of "+ add" buttons; the one being added takes
   the full width */
.missing-overview {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.5rem;
  padding-top: 0.75rem;
}

.missing-overview .review-field:not(.is-missing) {
  flex-basis: 100%;
}

.missing-text,
.reading-note {
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.reading-note {
  margin-top: 0.75rem;
}

.sessions {
  margin-top: 0.5rem;
  list-style: none;
}

.sessions li + li {
  margin-top: 0.2rem;
}

.analysed,
.card-note,
.muted {
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.analysed {
  margin-left: auto;
}

.card-note {
  padding-top: 0.5rem;
}

.plain-list {
  padding-left: 1.25rem;
  list-style: decimal;
}

.plain-list li + li {
  margin-top: 0.35rem;
}

.bullets {
  list-style: disc;
}

.brief {
  margin-top: 0.75rem;
}

.opportunities li {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.6rem 0;
  border-top: 1px solid var(--neutral-20);
}

.opportunities li.is-removed .opportunity-text {
  color: var(--neutral-70);
  text-decoration: line-through;
}

.opportunity-title {
  font-weight: 600;
}

ul.plain-list {
  list-style: disc;
}

.programme-plain {
  margin-top: 1rem;
}

.edit-list {
  margin-top: 0.75rem;
}

.about-reading {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.about-reading summary {
  cursor: pointer;
}

.material-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  font-size: 0.9rem;
}

.material-line label {
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

/* folded parts: one line each until opened */
.part {
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
}

.part[open] summary {
  margin-bottom: 0.75rem;
}

.part summary {
  font-weight: 600;
  cursor: pointer;
}

.count {
  margin-left: 0.25rem;
  padding: 0 0.5rem;
  border-radius: 1rem;
  background: var(--neutral-10);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--neutral-70);
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
}
</style>

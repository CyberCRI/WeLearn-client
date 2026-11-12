<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import AiNote from '@/components/tutor/AiNote.vue';
import EditButton from '@/components/tutor/EditButton.vue';
import ReviewField from '@/components/tutor/ReviewField.vue';
import TeachingContext from '@/components/tutor/TeachingContext.vue';
import { useTutorStore } from '@/stores/tutor';
import { looksLikeMoreThanDescription, normalise } from '@/utils/courseCheck';
import { capitalise } from '@/utils/strings';
import type { CourseField, ObjectiveGroup } from '@/types';

// screen 1.2 "check your course": has WeLearn understood the course? restored from the course
// review of the "design your course" prototype (esra/pedagogy-experiments): a link to the
// original, a short course card (title, discipline, level, overview, main topics), the course's
// learning objectives as a plain numbered list, competencies folded. each section has one Edit;
// editors open on request. objectives of the whole degree and the teaching context read from the
// syllabus stay in the store, out of this review. only a real doubt is marked for the teacher
defineProps<{ action: () => void }>();

const store = useTutorStore();

const OVERVIEW_KEYS = ['title', 'discipline', 'level'] as const;
type OverviewKey = (typeof OVERVIEW_KEYS)[number];
const GROUPS: ObjectiveGroup[] = ['objective', 'competency', 'programme'];

// a syllabus or a course plan are what this screen expects; a lesson or an article are not
const isSyllabus = computed(
  () => !store.detectedType || ['syllabus', 'course_plan'].includes(store.detectedType)
);
const isChecked = computed(() => store.documentText !== null);

// course information: what the syllabus states, editable one line at a time; one line for the rest
const foundKeys = computed(() => OVERVIEW_KEYS.filter((key) => store.teachingContext[key]));
const missingKeys = computed(() => OVERVIEW_KEYS.filter((key) => !store.teachingContext[key]));
const editingKey = ref<OverviewKey | null>(null);
const shownValue = (key: OverviewKey) => {
  const value = store.teachingContext[key];
  return key === 'level' && value ? `tutor.course.levels.${value}` : null;
};
// shown with a capital, stored as the syllabus wrote it
const displayValue = (key: OverviewKey) => {
  const value = String(store.teachingContext[key] || '');
  return key === 'discipline' ? capitalise(value) : value;
};

// the course outline (sessions, weeks or chapters) as the syllabus lays it out, one click away and
// correctable. not shown when it only repeats the main topics
const isOutlineShown = computed(() => {
  const plan = store.coursePlan;
  if (!plan.length) return false;
  const topics = store.courseTopics.map(({ value }) => normalise(value));
  const repeated = plan.filter((line) => topics.some((topic) => normalise(line).includes(topic)));
  return plan.length > store.courseTopics.length || repeated.length < plan.length;
});
const outlineDraft = ref<string | null>(null);
const saveOutline = () => {
  store.setCoursePlan((outlineDraft.value || '').split('\n'));
  outlineDraft.value = null;
};

// a long list of objectives shows its first ones; all of them, as written, one click away
const SHORT_LIST = 5;
const isAllObjectivesShown = ref(false);

// the overview: WeLearn's short summary; without one, the syllabus's own description when it is a
// clear one. a description that holds more (programme information) stays in the store, unshown
const isClearDescription = computed(
  () =>
    !!store.courseDescription &&
    (store.courseDescription.origin !== 'extracted' ||
      !looksLikeMoreThanDescription(store.courseDescription.value))
);
const overviewKind = computed(() =>
  store.courseSummary ? 'summary' : isClearDescription.value ? 'description' : null
);

// main topics: titles first; their subtopics one click away (all of them, as read). one editor
// for the whole list, saved or cancelled at once
const hasSubtopics = computed(() => store.courseTopics.some((topic) => topic.subtopics?.length));
const isSubtopicsShown = ref(false);
type TopicDraft = { from: number | null; title: string; subtopics: string };
const topicDrafts = ref<TopicDraft[] | null>(null);
const startTopics = () => {
  topicDrafts.value = store.courseTopics.map((topic, index) => ({
    from: index,
    title: topic.value,
    subtopics: (topic.subtopics || []).join(', ')
  }));
  if (!topicDrafts.value.length) addTopicDraft();
};
const addTopicDraft = () => topicDrafts.value?.push({ from: null, title: '', subtopics: '' });
const saveTopics = () => {
  store.saveTopics(
    (topicDrafts.value || []).map(({ from, title, subtopics }) => ({
      from,
      title,
      subtopics: subtopics.split(',')
    }))
  );
  topicDrafts.value = null;
};

// objectives in their groups; the index is the item's place in the store
const itemsOf = (group: ObjectiveGroup) =>
  store.courseObjectives
    .map((field, index) => ({ field, index }))
    .filter(({ field }) => (field.group || 'objective') === group);
const courseItems = computed(() => itemsOf('objective'));
const shownCourseItems = computed(() =>
  isAllObjectivesShown.value ? courseItems.value : courseItems.value.slice(0, SHORT_LIST)
);
const competencyItems = computed(() => itemsOf('competency'));
const programmeItems = computed(() => itemsOf('programme'));
const unsortedItems = computed(() => itemsOf('unsorted'));
const isObjectivesEditing = ref(false);
const valueOf = (e: Event) => (e.target as HTMLSelectElement).value as ObjectiveGroup;
// a word only where it helps: what the teacher changed, or a real doubt (not found in the syllabus)
const noteOf = (field: CourseField) =>
  field.origin === 'edited' || field.origin === 'added'
    ? `tutor.check.origin.${field.origin}`
    : field.verification === 'unverified'
      ? 'tutor.check.pleaseCheck'
      : null;

// enough to work on: the course's objectives or competencies, its topics, or its overview. a
// syllabus without explicit objectives is still a course
const canConfirm = computed(
  () =>
    store.courseOnlyObjectives.length + store.courseCompetencies.length > 0 ||
    store.courseTopics.length > 0 ||
    !!overviewKind.value
);

// a local link to the teacher's own file (it never leaves the device again)
const originalUrl = ref<string | null>(null);
watch(
  () => store.syllabusFile,
  (file) => {
    if (originalUrl.value) URL.revokeObjectURL(originalUrl.value);
    originalUrl.value = file && URL.createObjectURL ? URL.createObjectURL(file) : null;
  },
  { immediate: true }
);
onBeforeUnmount(() => {
  if (originalUrl.value) URL.revokeObjectURL(originalUrl.value);
});
const fileSize = computed(() =>
  store.syllabusFile ? `${Math.max(1, Math.round(store.syllabusFile.size / 1024))} KB` : ''
);
</script>

<template>
  <div class="course-review">
    <h1 class="review-title">{{ $t('tutor.check.title') }}</h1>
    <p class="review-intro">{{ $t('tutor.check.description') }}</p>

    <!-- the original, one compact line -->
    <p v-if="store.syllabusFileName" class="file-line" data-testid="original">
      <span class="original-name">{{ store.syllabusFileName }}</span>
      <span class="muted">{{ fileSize }}</span>
      <a v-if="originalUrl" :href="originalUrl" target="_blank" rel="noopener">
        {{ $t('tutor.check.openOriginal') }}
      </a>
    </p>

    <!-- notes on the reading itself, only when they apply -->
    <p v-if="!isChecked" class="detected" data-testid="ai-label">
      {{ $t('tutor.check.uncheckedNote') }}
    </p>
    <p v-if="store.isReadingPartial" class="note" role="status" data-testid="reading-partial">
      {{ $t('tutor.check.readingPartial') }}
    </p>
    <p v-if="!isSyllabus" class="detected" role="status" data-testid="not-syllabus">
      {{
        $t('tutor.check.notSyllabus', {
          type: $t(`tutor.check.types.${store.detectedType}`, String(store.detectedType))
        })
      }}
    </p>

    <section class="course" data-testid="course">
      <div class="course-card" data-testid="overview">
        <dl>
          <div v-for="key in foundKeys" :key="key" class="overview-line">
            <dt>{{ $t(`tutor.course.fields.${key}`) }}</dt>
            <dd :data-testid="`overview-${key}`">
              <template v-if="editingKey === key">
                <TeachingContext
                  isPlain
                  :keys="[key]"
                  :context="store.teachingContext"
                  :prefilled="store.prefilled"
                  :updateContext="store.updateContext"
                />
                <button
                  type="button"
                  class="button is-small mt-1"
                  data-testid="done-overview"
                  @click="editingKey = null"
                >
                  {{ $t('tutor.check.done') }}
                </button>
              </template>
              <template v-else>
                <EditButton
                  class="line-action"
                  :label="$t('tutor.check.editField', { field: $t(`tutor.course.fields.${key}`) })"
                  data-testid="edit-overview"
                  @click="editingKey = key"
                />
                <span data-testid="overview-value">{{
                  shownValue(key) ? $t(shownValue(key)!) : displayValue(key)
                }}</span>
                <AiNote
                  v-if="store.aiFilled.includes(key)"
                  :label="$t('tutor.check.tag.check')"
                  :detail="$t('tutor.course.readByAi')"
                  data-testid="ai-filled"
                />
              </template>
            </dd>
          </div>

          <div v-if="overviewKind" class="overview-line">
            <dt>{{ $t('tutor.check.overviewLabel') }}</dt>
            <dd data-testid="description-part">
              <template v-if="overviewKind === 'summary'">
                <ReviewField
                  :field="store.courseSummary"
                  isCollapsible
                  :editLabel="
                    $t('tutor.check.editField', { field: $t('tutor.check.overviewLabel') })
                  "
                  data-testid="summary"
                  @save="store.setSummary"
                  @restore="store.restoreSummary"
                />
              </template>
              <ReviewField
                v-else
                :field="store.courseDescription"
                isCollapsible
                :editLabel="$t('tutor.check.editField', { field: $t('tutor.check.overviewLabel') })"
                data-testid="description"
                @save="store.setDescription"
                @restore="store.restoreDescription"
              />
            </dd>
          </div>

          <div class="overview-line">
            <dt>{{ $t('tutor.check.topicsLabel') }}</dt>
            <dd data-testid="topics">
              <!-- one editor for the whole list: titles and subtopics corrected in place -->
              <form v-if="topicDrafts" class="topic-editor" @submit.prevent="saveTopics">
                <div
                  v-for="(draft, index) in topicDrafts"
                  :key="index"
                  class="topic-row"
                  data-testid="topic-draft"
                >
                  <div class="topic-fields">
                    <input
                      v-model="draft.title"
                      class="input is-small"
                      type="text"
                      :placeholder="$t('tutor.check.topicTitle')"
                      :aria-label="$t('tutor.check.topicTitle')"
                      data-testid="topic-title"
                    />
                    <input
                      v-model="draft.subtopics"
                      class="input is-small"
                      type="text"
                      :placeholder="$t('tutor.check.subtopics')"
                      :aria-label="$t('tutor.check.subtopics')"
                      data-testid="topic-subtopics"
                    />
                  </div>
                  <button
                    type="button"
                    class="delete"
                    :aria-label="$t('tutor.check.removeTopic', { topic: draft.title })"
                    data-testid="remove-topic"
                    @click="topicDrafts.splice(index, 1)"
                  />
                </div>
                <button
                  type="button"
                  class="button is-small is-text"
                  data-testid="add-topic"
                  @click="addTopicDraft"
                >
                  + {{ $t('tutor.check.addTopic') }}
                </button>
                <div class="editor-actions">
                  <button
                    type="submit"
                    class="button is-small is-primary"
                    data-testid="save-topics"
                  >
                    {{ $t('tutor.check.saveChanges') }}
                  </button>
                  <button
                    type="button"
                    class="button is-small is-text"
                    data-testid="cancel-topics"
                    @click="topicDrafts = null"
                  >
                    {{ $t('tutor.check.cancel') }}
                  </button>
                </div>
              </form>
              <template v-else-if="!store.courseTopics.length">
                <p class="muted" data-testid="no-topics">{{ $t('tutor.check.noTopicsFound') }}</p>
                <button
                  type="button"
                  class="button is-small is-text add-link"
                  data-testid="add-topics"
                  @click="startTopics"
                >
                  + {{ $t('tutor.check.addTopics') }}
                </button>
              </template>
              <template v-else>
                <EditButton
                  class="line-action"
                  :label="$t('tutor.check.editField', { field: $t('tutor.check.topicsLabel') })"
                  data-testid="edit-topics"
                  @click="startTopics"
                />
                <ul class="topic-list">
                  <li v-for="topic in store.courseTopics" :key="topic.value" data-testid="topic">
                    <span class="topic-title">{{ topic.value }}</span>
                    <AiNote
                      v-if="topic.origin === 'extracted' && topic.verification === 'unverified'"
                      :label="$t('tutor.check.tag.check')"
                      :detail="$t('tutor.check.pleaseCheck')"
                      data-testid="topic-note"
                    />
                    <!-- its subtopics on a line of their own, on request -->
                    <p
                      v-if="isSubtopicsShown && topic.subtopics?.length"
                      class="subtopics"
                      data-testid="subtopics"
                    >
                      {{ topic.subtopics.join(', ') }}
                    </p>
                  </li>
                </ul>
                <button
                  v-if="hasSubtopics"
                  type="button"
                  class="button is-small is-text show-all"
                  data-testid="toggle-subtopics"
                  @click="isSubtopicsShown = !isSubtopicsShown"
                >
                  {{
                    isSubtopicsShown
                      ? $t('tutor.check.hideSubtopics')
                      : $t('tutor.check.showSubtopics')
                  }}
                </button>
              </template>
            </dd>
          </div>
        </dl>

        <!-- the course outline as written: sessions, weeks or chapters -->
        <details
          v-if="isOutlineShown || outlineDraft !== null"
          class="outline"
          data-testid="course-plan"
        >
          <summary>{{ $t('tutor.check.outlineTitle', { n: store.coursePlan.length }) }}</summary>
          <form v-if="outlineDraft !== null" @submit.prevent="saveOutline">
            <p class="muted mb-1">{{ $t('tutor.check.outlineHint') }}</p>
            <textarea
              v-model="outlineDraft"
              class="textarea is-small"
              rows="8"
              data-testid="outline-editor"
            />
            <div class="editor-actions">
              <button type="submit" class="button is-small is-primary" data-testid="save-outline">
                {{ $t('tutor.check.saveChanges') }}
              </button>
              <button
                type="button"
                class="button is-small is-text"
                data-testid="cancel-outline"
                @click="outlineDraft = null"
              >
                {{ $t('tutor.check.cancel') }}
              </button>
            </div>
          </form>
          <template v-else>
            <ol class="sessions">
              <li v-for="(line, index) in store.coursePlan" :key="index">{{ line }}</li>
            </ol>
            <EditButton
              :label="$t('tutor.check.editField', { field: $t('tutor.check.outlineName') })"
              data-testid="edit-outline"
              @click="outlineDraft = store.coursePlan.join('\n')"
            />
          </template>
        </details>

        <!-- what WeLearn did not identify: one line of "+ add" buttons -->
        <div
          v-if="missingKeys.length || !overviewKind"
          class="missing-overview"
          data-testid="overview-missing"
        >
          <span class="muted">{{ $t('tutor.check.notFoundOverview') }}</span>
          <template v-for="key in missingKeys" :key="key">
            <TeachingContext
              v-if="editingKey === key"
              class="adding"
              isPlain
              :keys="[key]"
              :context="store.teachingContext"
              :prefilled="store.prefilled"
              :updateContext="store.updateContext"
            />
            <button
              v-else
              type="button"
              class="button is-small is-text"
              :data-testid="`add-overview-${key}`"
              @click="editingKey = key"
            >
              + {{ $t(`tutor.course.fields.${key}`) }}
            </button>
          </template>
          <ReviewField
            v-if="!overviewKind"
            :field="null"
            :addLabel="'+ ' + $t('tutor.check.overviewLabel')"
            data-testid="add-overview-description"
            @save="store.setDescription"
          />
        </div>
      </div>

      <!-- the course's own learning objectives; competencies folded; degree-level kept aside -->
      <section class="part" data-testid="objectives">
        <div class="part-head">
          <h2 class="part-title">{{ $t('tutor.check.objectivesTitle') }}</h2>
          <!-- a pencil to correct the list; adding the first objective stays a worded action -->
          <EditButton
            v-if="!isObjectivesEditing && courseItems.length"
            :label="$t('tutor.check.editField', { field: $t('tutor.check.objectivesTitle') })"
            data-testid="edit-objectives"
            @click="isObjectivesEditing = true"
          />
          <button
            v-else-if="!isObjectivesEditing"
            type="button"
            class="button is-small is-text"
            data-testid="edit-objectives"
            @click="isObjectivesEditing = true"
          >
            {{ $t('tutor.check.addObjective') }}
          </button>
        </div>

        <template v-if="!isObjectivesEditing">
          <ol v-if="courseItems.length" class="plain-list" data-testid="list-objective">
            <li
              v-for="{ field, index } in shownCourseItems"
              :key="index"
              data-testid="objective-item"
            >
              {{ field.value }}
              <span v-if="noteOf(field)" class="muted" data-testid="item-note">
                ({{ $t(noteOf(field)!) }})
              </span>
            </li>
          </ol>
          <button
            v-if="courseItems.length > SHORT_LIST"
            type="button"
            class="button is-small is-text show-all"
            data-testid="show-all-objectives"
            @click="isAllObjectivesShown = !isAllObjectivesShown"
          >
            {{
              isAllObjectivesShown
                ? $t('tutor.check.showFewer')
                : $t('tutor.check.showAll', { n: courseItems.length })
            }}
          </button>
          <p v-if="!courseItems.length" class="muted" data-testid="no-objectives">
            {{ $t('tutor.check.noObjectives') }}
          </p>

          <details v-if="competencyItems.length" class="sub-part" data-testid="list-competency">
            <summary>
              {{ $t('tutor.check.groups.competency') }} ({{ competencyItems.length }})
            </summary>
            <ul class="plain-list">
              <li
                v-for="{ field, index } in competencyItems"
                :key="index"
                data-testid="objective-item"
              >
                {{ field.value }}
                <span v-if="noteOf(field)" class="muted">({{ $t(noteOf(field)!) }})</span>
              </li>
            </ul>
          </details>
        </template>

        <template v-else>
          <div
            v-for="{ group, items } in [
              { group: 'objective' as const, items: courseItems },
              { group: 'competency' as const, items: competencyItems }
            ]"
            :key="group"
            class="group"
            :data-testid="`group-${group}`"
          >
            <p class="group-title">{{ $t(`tutor.check.groups.${group}`) }}</p>
            <ol class="objectives">
              <li v-for="{ field, index } in items" :key="index" data-testid="objective">
                <ReviewField
                  :field="field"
                  canRemove
                  :editLabel="$t('tutor.check.editObjective')"
                  @save="(value: string) => store.setObjective(index, value)"
                  @restore="store.restoreObjective(index)"
                  @remove="store.removeObjective(index)"
                >
                  <template #actions>
                    <div class="select is-small move">
                      <select
                        :value="field.group || 'objective'"
                        :aria-label="$t('tutor.check.moveTo')"
                        data-testid="move-objective"
                        @change="store.setGroup(index, valueOf($event))"
                      >
                        <option v-for="target in GROUPS" :key="target" :value="target">
                          {{ $t(`tutor.check.groups.${target}`) }}
                        </option>
                      </select>
                    </div>
                  </template>
                </ReviewField>
              </li>
            </ol>
            <ReviewField
              :key="store.courseObjectives.length"
              :field="null"
              :addLabel="
                '+ ' +
                (group === 'objective'
                  ? $t('tutor.check.addObjective')
                  : $t('tutor.check.addCompetency'))
              "
              :data-testid="`add-${group}`"
              @save="(value: string) => store.addObjective(value, group)"
            />
          </div>

          <!-- read from the syllabus but about the whole degree: kept, never used for this course
               unless the teacher moves one back -->
          <details v-if="programmeItems.length" class="sub-part" data-testid="group-programme">
            <summary>{{ $t('tutor.check.programmeAside', { n: programmeItems.length }) }}</summary>
            <p class="muted mb-2">{{ $t('tutor.check.programmeAsideHint') }}</p>
            <ul class="aside-list">
              <li v-for="{ field, index } in programmeItems" :key="index">
                <span>{{ field.value }}</span>
                <button
                  type="button"
                  class="button is-small is-text"
                  data-testid="move-to-course"
                  @click="store.setGroup(index, 'objective')"
                >
                  {{ $t('tutor.check.moveToCourse') }}
                </button>
              </li>
            </ul>
          </details>

          <button
            type="button"
            class="button is-small edit-list"
            data-testid="done-objectives"
            @click="isObjectivesEditing = false"
          >
            {{ $t('tutor.check.done') }}
          </button>
        </template>

        <!-- objectives neither WeLearn nor the syllabus's headings place: never taken as the
             course's until the teacher says so -->
        <details v-if="unsortedItems.length" class="sub-part" data-testid="group-unsorted">
          <summary>{{ $t('tutor.check.unsortedTitle', { n: unsortedItems.length }) }}</summary>
          <p class="muted mb-2">{{ $t('tutor.check.unsortedHint') }}</p>
          <ul class="aside-list">
            <li v-for="{ field, index } in unsortedItems" :key="index" data-testid="unsorted-item">
              <span>{{ field.value }}</span>
              <span class="sort-actions">
                <button
                  type="button"
                  class="button is-small is-text"
                  data-testid="sort-to-course"
                  @click="store.setGroup(index, 'objective')"
                >
                  {{ $t('tutor.check.sortToCourse') }}
                </button>
                <button
                  type="button"
                  class="button is-small is-text"
                  data-testid="sort-aside"
                  @click="store.setGroup(index, 'programme')"
                >
                  {{ $t('tutor.check.sortAside') }}
                </button>
              </span>
            </li>
          </ul>
        </details>
      </section>

      <p class="local-note" data-testid="local-note">{{ $t('tutor.check.localNote') }}</p>

      <div class="review-actions">
        <span v-if="!canConfirm" class="muted" data-testid="need-objective">
          {{ $t('tutor.check.needObjective') }}
        </span>
        <button
          data-testid="confirm-course"
          class="button is-primary"
          :disabled="!canConfirm"
          @click="action()"
        >
          {{ $t('tutor.check.action') }} →
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.course-review {
  width: 100%;
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

.file-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.75rem;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.original-name {
  overflow: hidden;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.muted {
  font-size: 0.85rem;
  color: var(--neutral-70);
}

/* a calm note: something to check, not an error */
.note {
  margin-top: 0.75rem;
  padding: 0.25rem 0 0.25rem 0.75rem;
  border-left: 3px solid var(--neutral-20);
  font-size: 0.9rem;
  color: var(--neutral-80);
}

.outline {
  padding-top: 0.75rem;
  summary {
    font-weight: 600;
    cursor: pointer;
  }
}

.sessions {
  margin: 0.5rem 0 0 1.25rem;
  list-style: decimal;
  font-size: 0.9rem;
}

.add-link,
.show-all {
  padding-left: 0;
}

.detected {
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  background: var(--lpi-yellow-lighter);
  font-size: 0.9rem;
}

/* the course: label on the left, value on the right, separated by thin lines, no box */
.course-card {
  margin-top: 1.25rem;
  padding-bottom: 0.75rem;
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

/* the edit link sits quietly beside the value, not on a line of its own */
.line-action {
  float: right;
  margin-left: 0.5rem;
}

/* each topic in bold, its subtopics underneath in a smaller, muted line, a little space between */
.topic-list li + li {
  margin-top: 0.6rem;
}

.topic-title {
  font-weight: 600;
}

.subtopics {
  margin-top: 0.15rem;
  font-size: 0.9rem;
  line-height: 1.45;
  color: var(--neutral-70);
}

.topic-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--neutral-10);
}

.topic-fields {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.25rem;
}

.topic-fields .input + .input {
  color: var(--neutral-70);
}

.topic-row .delete {
  margin-top: 0.4rem;
}

.editor-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

/* what WeLearn did not find: one line of "+ add" buttons; the one being added takes the full
   width */
.missing-overview {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.5rem;
  padding-top: 0.75rem;
}

.missing-overview .adding {
  flex-basis: 100%;
}

.part {
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--neutral-20);
}

.part-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.part-title {
  font-size: 1rem;
  font-weight: 600;
}

details summary {
  cursor: pointer;
}

.sub-part {
  margin-top: 1rem;
  summary {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--neutral-80);
  }
}

.plain-list {
  padding-left: 1.25rem;
  list-style: decimal;
}

ul.plain-list {
  margin-top: 0.5rem;
  list-style: disc;
}

.plain-list li + li {
  margin-top: 0.35rem;
}

.group + .group {
  margin-top: 1.25rem;
}

.group-title {
  margin-bottom: 0.35rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--neutral-80);
}

.edit-list {
  margin-top: 0.75rem;
}

.objectives {
  margin: 0 0 0.5rem 1.25rem;
  li + li {
    margin-top: 0.75rem;
  }
}

.move select {
  font-size: 0.75rem;
}

.sort-actions {
  display: flex;
  gap: 0.25rem;
}

.aside-list li {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.25rem 1rem;
  margin-top: 0.4rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
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
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

@media (max-width: 600px) {
  .overview-line {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.25rem;
  }
}
</style>

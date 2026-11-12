<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import i18n from '@/localisation/i18n';
import AddedChange from '@/components/tutor/AddedChange.vue';
import CompleteDocument from '@/components/tutor/CompleteDocument.vue';
import CheckboxCompnent from '@/components/CheckboxCompnent.vue';
import {
  appendixMarkdown,
  appendixParagraphs,
  changesWithNotes,
  type AppendixLabels
} from '@/utils/pedagogicalAppendix';
import { GREENCOMP, type GreenCompId } from '@/utils/greencomp';
import ResourceList from '@/components/tutor/ResourceList.vue';
import { useConnectionsStore } from '@/stores/connections';
import { useDraftStore } from '@/stores/draft';
import { useTutorStore } from '@/stores/tutor';
import { guessLanguage } from '@/utils/courseReading';
import { convertMarkdownToDocx, downloadDocx } from '@/utils/md-to-docx';
import { capitalise } from '@/utils/strings';
import {
  completeSyllabusDocx,
  insertionPoints,
  planComplete,
  validatePlan,
  type CompleteLabels
} from '@/utils/completeSyllabus';
import {
  buildUpdatedCourse,
  changesText,
  groupChanges,
  updatedCourseMarkdown,
  type ApprovedChange,
  type ExportLabels
} from '@/utils/updatedSyllabus';
import type { AdaptationKind } from '@/utils/connections';

// step 4 "updated syllabus": the changes the teacher accepted in step 3, brought together. two
// views (DESIGN.md): the changes only, grouped by where they belong, each editable or removable;
// and the course as confirmed with the changes in their places. an honest outline, not a remade
// syllabus: what WeLearn did not read is not reproduced. copied as text or downloaded as word,
// in the syllabus's language. no new suggestion is made here, and the uploaded file is untouched
const tutor = useTutorStore();
const store = useConnectionsStore();
const draftStore = useDraftStore();

// the course as confirmed in step 2 (the same one step 3b shows the places with)
const course = computed(() => tutor.courseToUpdate);
const changes = computed(() => store.acceptedChanges as ApprovedChange[]);
const updated = computed(() => buildUpdatedCourse(course.value, changes.value));
const groups = computed(() => groupChanges(course.value, changes.value));
// the course outline is shown only when it holds a change or there are no topics: it would
// otherwise repeat them
const isOutlineShown = computed(
  () =>
    updated.value.sessions.length > 0 &&
    (updated.value.sessions.some(({ added }) => added.length) || !updated.value.topics.length)
);

const view = ref<'changes' | 'course'>('course');

// where a change without a place may go: the course's topics and its outline, as confirmed
const places = computed(() => tutor.coursePlaces);
const valueOf = (e: Event) => (e.target as HTMLSelectElement).value;

// editing an accepted change keeps it accepted, with the teacher's wording
const editing = ref<number | null>(null);
const draft = ref('');
const editor = ref<HTMLTextAreaElement[] | null>(null);
const startEditing = async (change: ApprovedChange) => {
  editing.value = change.connectionId;
  draft.value = change.text;
  await nextTick();
  editor.value?.[0]?.focus();
};
const saveEdit = (change: ApprovedChange) => {
  if (draft.value.trim()) store.acceptChange(change.connectionId, draft.value);
  editing.value = null;
};
// an edit made in the course preview: the same action, so step 3, both views and the exports follow
const saveChange = (connectionId: number, text: string) => store.acceptChange(connectionId, text);

// the exports speak the syllabus's language, whatever the interface's
const language = computed(() =>
  guessLanguage(
    [course.value.title, course.value.overview, ...course.value.objectives].join(' '),
    i18n.global.locale.value === 'en' ? 'en' : 'fr'
  )
);
const KINDS: AdaptationKind[] = ['objective', 'topic', 'teaching', 'assessment'];
// a text in the syllabus's language (the preview's headings and labels)
const lt = (key: string, named: Record<string, unknown> = {}) =>
  i18n.global.t(key, named, { locale: language.value });
const labels = computed<ExportLabels>(() => {
  const t = (key: string) => i18n.global.t(key, {}, { locale: language.value });
  const at = (key: string) => t(`tutor.updated.export.${key}`);
  return {
    documentTitle: at('documentTitle'),
    note: at('note'),
    overview: at('overview'),
    objectives: at('objectives'),
    competencies: at('competencies'),
    topics: at('topics'),
    outline: at('outline'),
    toPlace: at('toPlace'),
    revised: at('revised'),
    added: at('added'),
    replaces: at('replaces'),
    why: at('why'),
    sources: at('sources'),
    placement: at('placement'),
    changesTitle: at('changesTitle'),
    placementUnknown: at('placementUnknown'),
    context: at('context'),
    kinds: Object.fromEntries(
      KINDS.map((kind) => [kind, t(`tutor.additions.change.kinds.${kind}`)])
    ) as Record<AdaptationKind, string>
  };
});

const isCopied = ref(false);
const copyChanges = async () => {
  try {
    await navigator.clipboard.writeText(changesText(course.value, changes.value, labels.value));
    isCopied.value = true;
    setTimeout(() => (isCopied.value = false), 2000);
  } catch {
    isCopied.value = false;
  }
};

// the complete updated syllabus: the syllabus's whole text with the approved changes in their
// verified places. offered only when the text is there and the checks pass (nothing lost, every
// change present once); otherwise the outline and changes document is the deliverable
const completePlan = computed(() =>
  tutor.documentText ? planComplete(tutor.documentText, course.value, changes.value) : null
);
const isCompleteReady = computed(
  () =>
    !!tutor.documentText &&
    !!completePlan.value &&
    validatePlan(tutor.documentText, changes.value, completePlan.value)
);
const completeLabels = computed<CompleteLabels>(() => {
  const t = (key: string, named = {}) => i18n.global.t(key, named, { locale: language.value });
  return {
    title: t('tutor.updated.complete.title', { title: course.value.title || '' }),
    note: t('tutor.updated.complete.note'),
    change: t('tutor.updated.complete.change'),
    replaces: t('tutor.updated.export.replaces'),
    sources: t('tutor.updated.export.sources'),
    toPlace: t('tutor.updated.export.toPlace'),
    toPlaceNote: t('tutor.updated.complete.toPlaceNote'),
    context: t('tutor.updated.export.context'),
    kinds: labels.value.kinds
  };
});
// where the document puts each change, shown in the changes view too
const points = computed(() =>
  isCompleteReady.value && completePlan.value ? insertionPoints(completePlan.value) : null
);

// the optional pedagogical appendix: off unless the teacher asks, offered only when an accepted
// change carries notes
const appendixChoice = ref<string[]>([]);
const hasNotes = computed(() => changesWithNotes(changes.value).length > 0);
const isAppendixIncluded = computed(() => hasNotes.value && appendixChoice.value.includes('notes'));
const appendixLabels = computed<AppendixLabels>(() => {
  const at = (key: string) => lt(`tutor.updated.appendix.${key}`);
  return {
    title: at('title'),
    note: at('note'),
    learning: lt('tutor.additions.change.notes.learning'),
    greencomp: lt('tutor.additions.change.notes.greencomp'),
    teaching: lt('tutor.additions.change.notes.teaching'),
    check: lt('tutor.additions.change.notes.check'),
    greencompNames: Object.fromEntries(
      GREENCOMP.map((id) => [id, lt(`tutor.greencomp.${id}`)])
    ) as Record<GreenCompId, string>,
    kinds: labels.value.kinds
  };
});

const fileName = (suffixKey: string) =>
  `${(course.value.title || labels.value.documentTitle)
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')}-${i18n.global.t(suffixKey, {}, { locale: language.value })}.docx`;

const isExportingComplete = ref(false);
const downloadComplete = async () => {
  if (!completePlan.value || !isCompleteReady.value) return;
  isExportingComplete.value = true;
  try {
    downloadDocx(
      await completeSyllabusDocx(
        completePlan.value,
        completeLabels.value,
        isAppendixIncluded.value ? appendixParagraphs(changes.value, appendixLabels.value) : []
      ),
      fileName('tutor.updated.complete.fileSuffix')
    );
  } finally {
    isExportingComplete.value = false;
  }
};

const isExporting = ref(false);
const downloadWord = async () => {
  isExporting.value = true;
  try {
    const markdown =
      updatedCourseMarkdown(course.value, changes.value, labels.value) +
      (isAppendixIncluded.value ? appendixMarkdown(changes.value, appendixLabels.value) : '');
    downloadDocx(
      await convertMarkdownToDocx(markdown),
      fileName('tutor.updated.export.fileSuffix')
    );
  } finally {
    isExporting.value = false;
  }
};
</script>

<template>
  <section class="updated" data-testid="updated">
    <button
      type="button"
      class="back-link"
      data-testid="back-to-additions"
      @click="tutor.setStep(3)"
    >
      ← {{ $t('tutor.updated.back') }}
    </button>
    <h1 class="updated-title">{{ $t('tutor.updated.title') }}</h1>
    <!-- the course, and how many changes, in one discreet line -->
    <p class="course-line" data-testid="updated-course-line">
      {{
        [course.title, $t('tutor.updated.approvedCount', changes.length)]
          .filter(Boolean)
          .join(' · ')
      }}
    </p>
    <p v-if="changes.length" class="updated-intro">{{ $t('tutor.updated.intro') }}</p>

    <div v-if="!changes.length" class="empty" data-testid="no-changes">
      <p>{{ $t('tutor.updated.noChanges') }}</p>
      <button
        type="button"
        class="button is-small is-primary mt-3"
        data-testid="empty-back"
        @click="tutor.setStep(3)"
      >
        ← {{ $t('tutor.updated.back') }}
      </button>
    </div>

    <template v-else>
      <div class="toolbar">
        <div class="tabs is-toggle is-small views" role="tablist">
          <ul>
            <li :class="{ 'is-active': view === 'course' }">
              <a role="tab" data-testid="view-course" @click="view = 'course'">
                {{ $t('tutor.updated.courseView') }}
              </a>
            </li>
            <li :class="{ 'is-active': view === 'changes' }">
              <a role="tab" data-testid="view-changes" @click="view = 'changes'">
                {{ $t('tutor.updated.changesView', changes.length) }}
              </a>
            </li>
          </ul>
        </div>
        <!-- one download: the complete syllabus when its text is verified, the outline otherwise -->
        <div class="exports">
          <button
            v-if="isCompleteReady"
            type="button"
            class="button is-small is-primary"
            :class="{ 'is-loading': isExportingComplete }"
            :title="$t('tutor.updated.complete.hint')"
            data-testid="download-complete"
            @click="downloadComplete"
          >
            {{ $t('tutor.updated.complete.download') }}
          </button>
          <button
            v-else
            type="button"
            class="button is-small is-primary"
            :class="{ 'is-loading': isExporting }"
            :title="$t('tutor.updated.downloadHint')"
            data-testid="download-word"
            @click="downloadWord"
          >
            {{ $t('tutor.updated.download') }}
          </button>
        </div>
      </div>
      <div v-if="hasNotes" class="appendix-choice" data-testid="appendix-choice">
        <CheckboxCompnent
          id="pedagogical-appendix"
          v-model="appendixChoice"
          name="pedagogical-appendix"
          value="notes"
          :label="$t('tutor.updated.appendix.choice')"
          :checked="appendixChoice.includes('notes')"
        />
      </div>
      <p class="muted export-note" data-testid="complete-note">
        {{
          isCompleteReady
            ? $t('tutor.updated.complete.layoutNote', completePlan?.toPlace.length || 0)
            : $t('tutor.updated.complete.unavailable')
        }}
      </p>

      <!-- the changes only, grouped by where they belong in the course -->
      <div v-if="view === 'changes'" data-testid="changes">
        <!-- secondary exports, next to the changes they contain -->
        <div class="changes-actions">
          <button
            type="button"
            class="button is-small is-text"
            :title="$t('tutor.updated.copyHint')"
            data-testid="copy-changes"
            @click="copyChanges"
          >
            {{ isCopied ? $t('tutor.updated.copied') : $t('tutor.updated.copy') }}
          </button>
          <button
            v-if="isCompleteReady"
            type="button"
            class="button is-small is-text"
            :class="{ 'is-loading': isExporting }"
            :title="$t('tutor.updated.downloadHint')"
            data-testid="download-word"
            @click="downloadWord"
          >
            {{ $t('tutor.updated.download') }}
          </button>
        </div>
        <section
          v-for="group in groups"
          :key="group.placement || 'unplaced'"
          class="group"
          data-testid="change-group"
        >
          <h2 class="group-title" :class="{ 'is-unplaced': !group.placement }">
            {{ group.placement || $t('tutor.updated.placementUnknown') }}
          </h2>
          <article
            v-for="change in group.changes"
            :key="change.connectionId"
            class="change"
            data-testid="approved-change"
          >
            <p class="kind">
              {{ $t(`tutor.additions.change.kinds.${change.kind}`) }}
              <span class="from">· {{ change.connection }}</span>
            </p>
            <template v-if="editing === change.connectionId">
              <textarea
                ref="editor"
                v-model="draft"
                class="textarea is-small"
                rows="3"
                data-testid="approved-editor"
                @keydown.esc="editing = null"
              />
              <div class="buttons mt-2">
                <button
                  type="button"
                  class="button is-small is-primary"
                  :disabled="!draft.trim()"
                  data-testid="save-approved"
                  @click="saveEdit(change)"
                >
                  {{ $t('tutor.check.saveChanges') }}
                </button>
                <button type="button" class="button is-small is-text" @click="editing = null">
                  {{ $t('tutor.check.cancel') }}
                </button>
              </div>
            </template>
            <p v-else class="text" data-testid="approved-text">{{ change.text }}</p>
            <p v-if="change.kind === 'objective' && change.original" class="muted">
              {{ $t('tutor.updated.replaces') }} {{ change.original }}
            </p>
            <p class="muted why">{{ change.why }}</p>
            <p
              v-if="change.placement && !tutor.courseParts.includes(change.placement)"
              class="muted"
              data-testid="approved-stale"
            >
              {{
                change.kind === 'objective'
                  ? $t('tutor.additions.change.staleObjective')
                  : $t('tutor.additions.change.stalePlace', { place: change.placement })
              }}
            </p>
            <p v-if="points" class="muted where" data-testid="approved-where">
              {{
                points.get(change.connectionId)
                  ? $t(
                      points.get(change.connectionId)?.action === 'replace'
                        ? 'tutor.additions.change.replacesLine'
                        : 'tutor.additions.change.afterLine',
                      { line: points.get(change.connectionId)?.line }
                    )
                  : $t('tutor.updated.atEnd')
              }}
            </p>
            <!-- no place in the course yet: the teacher says where it fits, nothing is invented -->
            <div v-if="!group.placement && places.length" class="select is-small place">
              <select
                :value="''"
                :aria-label="$t('tutor.additions.change.whereLabel')"
                data-testid="place-approved"
                @change="store.placeChange(change.connectionId, valueOf($event))"
              >
                <option value="">{{ $t('tutor.additions.change.whereLabel') }}</option>
                <option v-for="place in places" :key="place" :value="place">{{ place }}</option>
              </select>
            </div>
            <details v-if="change.resources.length" class="sources">
              <summary>
                {{ $t('tutor.additions.resources') }} ({{ change.resources.length }})
              </summary>
              <ResourceList :resources="change.resources" />
            </details>
            <div v-if="editing !== change.connectionId" class="actions">
              <button
                type="button"
                class="button is-small is-text"
                data-testid="edit-approved"
                @click="startEditing(change)"
              >
                {{ $t('tutor.check.edit') }}
              </button>
              <button
                type="button"
                class="button is-small is-text"
                data-testid="remove-approved"
                @click="store.keepOriginal(change.connectionId)"
              >
                {{ $t('tutor.updated.remove') }}
              </button>
            </div>
          </article>
        </section>
      </div>

      <!-- the course as confirmed, each accepted change in its place -->
      <!-- the course as a document: a white page on a light neutral workspace -->
      <div v-else class="workspace" data-testid="course-view">
        <p class="honest" data-testid="outline-note">
          {{
            $t(isCompleteReady ? 'tutor.updated.outlineNoteComplete' : 'tutor.updated.outlineNote')
          }}
        </p>
        <!-- the document the teacher downloads: same plan, same places -->
        <article v-if="isCompleteReady && completePlan" class="page">
          <CompleteDocument :plan="completePlan" :labels="completeLabels" @save="saveChange" />
        </article>
        <!-- ponytail: without a verified complete text, the confirmed outline stands in for the
             document, labelled as such -->
        <article v-else class="course page">
          <h2 class="course-title">{{ course.title }}</h2>
          <p v-if="course.discipline || course.level" class="muted">
            {{ [capitalise(course.discipline || ''), course.level].filter(Boolean).join(' · ') }}
          </p>
          <p v-if="course.overview" class="overview">{{ course.overview }}</p>

          <template v-if="updated.objectives.length">
            <h3>{{ lt('tutor.check.objectivesTitle') }}</h3>
            <ol class="plain-list">
              <li v-for="(objective, index) in updated.objectives" :key="index">
                <AddedChange
                  v-if="objective.revision"
                  :change="objective.revision"
                  :label="lt('tutor.additions.change.kinds.objective')"
                  is-editable
                  data-testid="revised"
                  @save="saveChange(objective.revision.connectionId, $event)"
                />
                <template v-else>{{ objective.text }}</template>
                <details v-if="objective.original" class="was">
                  <summary>{{ lt('tutor.updated.seeOriginal') }}</summary>
                  {{ objective.original }}
                </details>
                <AddedChange
                  v-for="change in objective.added"
                  :key="change.connectionId"
                  :change="change"
                  :label="lt(`tutor.additions.change.kinds.${change.kind}`)"
                  is-editable
                  @save="saveChange(change.connectionId, $event)"
                />
              </li>
            </ol>
          </template>

          <template v-if="updated.competencies.length">
            <h3>{{ lt('tutor.check.groups.competency') }}</h3>
            <ul class="plain-list bullets">
              <li v-for="(competency, index) in updated.competencies" :key="index">
                {{ competency.text }}
                <AddedChange
                  v-for="change in competency.added"
                  :key="change.connectionId"
                  :change="change"
                  :label="lt(`tutor.additions.change.kinds.${change.kind}`)"
                  is-editable
                  @save="saveChange(change.connectionId, $event)"
                />
              </li>
            </ul>
          </template>

          <template v-if="updated.topics.length">
            <h3>{{ lt('tutor.check.topicsLabel') }}</h3>
            <ul class="plain-list bullets">
              <li v-for="topic in updated.topics" :key="topic.title">
                <strong>{{ topic.title }}</strong>
                <span v-if="topic.subtopics.length" class="muted">
                  — {{ topic.subtopics.join(', ') }}</span
                >
                <AddedChange
                  v-for="change in topic.added"
                  :key="change.connectionId"
                  :change="change"
                  :label="lt(`tutor.additions.change.kinds.${change.kind}`)"
                  is-editable
                  @save="saveChange(change.connectionId, $event)"
                />
              </li>
            </ul>
          </template>

          <template v-if="isOutlineShown">
            <h3>{{ lt('tutor.check.outlineTitle', { n: updated.sessions.length }) }}</h3>
            <ul class="plain-list bullets">
              <li v-for="session in updated.sessions" :key="session.line">
                {{ session.line }}
                <AddedChange
                  v-for="change in session.added"
                  :key="change.connectionId"
                  :change="change"
                  :label="lt(`tutor.additions.change.kinds.${change.kind}`)"
                  is-editable
                  @save="saveChange(change.connectionId, $event)"
                />
              </li>
            </ul>
          </template>

          <template v-if="updated.unplaced.length">
            <h3>{{ lt('tutor.updated.placementUnknown') }}</h3>
            <AddedChange
              v-for="change in updated.unplaced"
              :key="change.connectionId"
              :change="change"
              :label="lt(`tutor.additions.change.kinds.${change.kind}`)"
              is-editable
              @save="saveChange(change.connectionId, $event)"
            />
          </template>
        </article>
      </div>
    </template>

    <p class="muted local" data-testid="local-note">
      {{ $t(draftStore.isOn ? 'tutor.draft.keptNote' : 'tutor.updated.localNote') }}
    </p>
  </section>
</template>

<style scoped>
.updated {
  width: 100%;
  max-width: 48rem;
}

.back-link {
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  font-size: 0.9rem;
  color: var(--primary-dark);
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  &:focus-visible {
    outline: 2px solid var(--primary-dark);
    outline-offset: 2px;
  }
}

.course-line {
  margin-top: 0.25rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.updated-title {
  margin-top: 1rem;
  font-size: 1.35rem;
  font-weight: 700;
}

.updated-intro {
  margin-top: 0.25rem;
  color: var(--neutral-80);
}

.empty {
  margin-top: 1.25rem;
  color: var(--neutral-80);
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.views {
  margin-bottom: 0;
}

/* the active view in WeLearn's colour, not bulma's default blue */
.views li.is-active a {
  border-color: var(--primary);
  background: var(--primary);
  color: var(--neutral-0);
}

.exports {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.appendix-choice {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
  font-size: 0.85rem;
}

.appendix-choice :deep(.checkbox-label) {
  font-size: 0.85rem;
}

.where {
  margin-top: 0.25rem;
}

.export-note {
  margin-top: 0.4rem;
  text-align: right;
}

.group {
  margin-top: 1.25rem;
}

.group-title {
  font-size: 1rem;
  font-weight: 700;
}

.group-title.is-unplaced {
  color: var(--neutral-70);
}

.change {
  margin-top: 0.6rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
}

.kind {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--neutral-70);
}

.from {
  font-weight: 400;
}

.text {
  margin-top: 0.25rem;
}

.muted {
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.why {
  margin-top: 0.25rem;
}

.place {
  display: block;
  margin-top: 0.5rem;
  max-width: 100%;
}

.place select {
  max-width: 100%;
}

.sources {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  summary {
    cursor: pointer;
  }
}

.actions {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.changes-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 1rem;
}

.workspace {
  margin-top: 1rem;
  padding: 0.75rem 1.25rem 1.5rem;
  border-radius: 8px;
  background: var(--neutral-10);
}

.honest {
  margin-bottom: 0.6rem;
  font-size: 0.85rem;
  color: var(--neutral-70);
}

/* a readable page, like the document it will become; a long one scrolls inside it */
.page {
  max-height: max(24rem, calc(100vh - 20rem));
  overflow-y: auto;
  padding: 2rem 2.5rem;
  border: 1px solid var(--neutral-15);
  border-radius: 4px;
  background: var(--neutral-0);
  line-height: 1.6;
}

@media (max-width: 600px) {
  .workspace {
    padding: 0.5rem 0.5rem 1rem;
  }
  .page {
    padding: 1.25rem 1rem;
  }
}

.course-title {
  font-size: 1.15rem;
  font-weight: 700;
}

.overview {
  margin-top: 0.5rem;
}

.course h3 {
  margin-top: 1.25rem;
  font-size: 1rem;
  font-weight: 700;
}

.plain-list {
  margin-top: 0.4rem;
  padding-left: 1.25rem;
  list-style: decimal;
}

.plain-list.bullets {
  list-style: disc;
}

.plain-list li + li {
  margin-top: 0.4rem;
}

.was {
  font-size: 0.85rem;
  color: var(--neutral-70);
  summary {
    cursor: pointer;
  }
}

.local {
  margin-top: 1.5rem;
}
</style>

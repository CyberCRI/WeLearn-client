<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { changeOf, useConnectionsStore, type Connection } from '@/stores/connections';
import { insertionPoint } from '@/utils/completeSyllabus';
import { useTutorStore } from '@/stores/tutor';
import { sourceLink } from '@/utils/connections';

// step 3b inside a connection's card: the one syllabus change WeLearn suggests, read in four
// parts: where it fits, the suggested wording, why it could be useful, and one sentence on how
// well it is supported (from the real result of the checks). the sources, their passages and
// every point of the check are one click away; placement problems stay visible. the teacher
// accepts it, edits it before accepting, or skips it (keeps the original of what it revises); the
// course itself is not changed here
const props = defineProps<{ connection: Connection }>();
const store = useConnectionsStore();
const tutor = useTutorStore();

const development = computed(() => props.connection.development);
const proposal = computed(() => development.value?.proposal || null);
// what the independent check of the change's claims found (utils/connections.ts withChecks)
const checks = computed(() => proposal.value?.checks || null);
const hasCheckNotes = computed(
  () =>
    !!checks.value &&
    (checks.value.status === 'unchecked' ||
      checks.value.problems.length > 0 ||
      checks.value.unbackedNames.length > 0)
);

// a revised objective replaces the course's own wording: it says which one, with its full wording
// below; any other change adds to the course
const isRevision = computed(() => proposal.value?.kind === 'objective');
const originalLabel = computed(() => {
  const original = proposal.value?.original;
  if (!original) return null;
  const objective = tutor.courseOnlyObjectives.findIndex(({ value }) => value === original);
  if (objective >= 0) return { key: 'tutor.additions.change.revisesObjective', n: objective + 1 };
  const competency = tutor.courseCompetencies.findIndex(({ value }) => value === original);
  if (competency >= 0)
    return { key: 'tutor.additions.change.revisesCompetency', n: competency + 1 };
  return { key: 'tutor.additions.change.revises', n: 0 };
});

// how well the change is supported, in one sentence: the level the checks gave it (never raised
// here) and, when limited, the first problem the check found, in its own words. "supported" says
// the sources back the wording, not that the science was verified
const evidence = computed(() => {
  const support = proposal.value?.support || 'none';
  const found = checks.value;
  if (found?.status === 'unchecked') {
    return {
      level: 'unchecked',
      head: 'tutor.additions.change.evidence.unchecked',
      detail: 'tutor.additions.change.evidence.uncheckedDetail',
      text: null
    };
  }
  const reason = found?.problems[0] || null;
  if (support === 'strong') {
    return {
      level: 'strong',
      head: 'tutor.additions.change.evidence.strong',
      detail: 'tutor.additions.change.evidence.strongDetail',
      text: null
    };
  }
  return {
    level: support,
    head: `tutor.additions.change.evidence.${support}`,
    detail: `tutor.additions.change.evidence.${support}Default`,
    text: reason
  };
});

// a long original (an objective) shows its first lines; all of it on request
const LONG_ORIGINAL = 180;
const isOriginalOpen = ref(false);
const isLongOriginal = computed(() => (proposal.value?.original || '').length > LONG_ORIGINAL);

// where the change goes, shown before it is accepted: with the syllabus's text, the very place the
// word document will use (after which line, or none found); otherwise the course part. the teacher
// can choose another place among the course's topics, subtopics and outline; a revised objective
// stays with its objective
const places = computed(() => tutor.coursePlaces);
const valueOf = (e: Event) => (e.target as HTMLSelectElement).value;
const change = computed(() => changeOf(props.connection));
const where = computed(() =>
  tutor.documentText && change.value
    ? insertionPoint(tutor.documentText, tutor.courseToUpdate, change.value)
    : undefined
);
const hasPlace = computed(() =>
  where.value === undefined ? !!change.value?.placement : !!where.value
);
const canChoosePlace = computed(
  () => proposal.value?.kind !== 'objective' && places.value.length > 0
);
const isChoosingPlace = ref(false);
// after a correction in step 2, the course part it was placed at may be gone
const isStale = computed(
  () => !!change.value?.placement && !tutor.courseParts.includes(change.value.placement)
);
const handlePlace = (e: Event) => {
  store.placeChange(props.connection.id, valueOf(e));
  isChoosingPlace.value = false;
};

// optional pedagogical notes for the teacher, folded under the change: not part of it, never
// added to the syllabus
const notes = computed(() => proposal.value?.guidance || null);
const hasNotes = computed(
  () =>
    !!notes.value &&
    !!(notes.value.learning || notes.value.greencomp || notes.value.teaching || notes.value.check)
);

const isEditing = ref(false);
const draft = ref('');
const editor = ref<HTMLTextAreaElement | null>(null);
const startEditing = async () => {
  draft.value = development.value?.edited || proposal.value?.suggested || '';
  isEditing.value = true;
  await nextTick();
  editor.value?.focus();
};
const saveAndAccept = () => {
  store.acceptChange(props.connection.id, draft.value);
  isEditing.value = false;
};
</script>

<template>
  <section v-if="development" class="development" data-testid="development">
    <p v-if="development.status === 'thinking'" class="waiting" role="status">
      <span class="dot" aria-hidden="true" />
      {{ $t('tutor.additions.change.thinking') }}
    </p>

    <div v-else-if="development.status !== 'ready'" class="problem" role="alert">
      <span>{{ $t(`tutor.additions.change.${development.status}`) }}</span>
      <button
        type="button"
        class="button is-small"
        data-testid="retry-develop"
        @click="store.develop(connection.id)"
      >
        {{ $t('tutor.additions.retry') }}
      </button>
    </div>

    <template v-else-if="proposal">
      <h4 class="change-title">{{ $t('tutor.additions.change.title') }}</h4>

      <dl class="change">
        <!-- where it goes in the syllabus: what the preview and the word document will show. a
             revised objective says which one it revises; a placement problem stays visible -->
        <dt>{{ $t('tutor.additions.change.placement') }}</dt>
        <dd data-testid="change-placement">
          <p v-if="isRevision && proposal.original && originalLabel" data-testid="change-original">
            <span class="ref">{{ $t(originalLabel.key, { n: originalLabel.n }) }}</span>
            <span
              class="original-text"
              :class="{ 'is-clamped': isLongOriginal && !isOriginalOpen }"
              data-testid="original-text"
              >{{ proposal.original }}</span
            >
            <button
              v-if="isLongOriginal"
              type="button"
              class="button is-small is-text more"
              data-testid="toggle-original"
              @click="isOriginalOpen = !isOriginalOpen"
            >
              {{ isOriginalOpen ? $t('tutor.check.showLess') : $t('tutor.check.showMore') }}
            </button>
          </p>
          <span v-if="where" data-testid="placement-line">
            {{
              $t(
                where.action === 'replace'
                  ? 'tutor.additions.change.replacesLine'
                  : 'tutor.additions.change.afterLine',
                { line: where.line }
              )
            }}
          </span>
          <span v-else-if="where === null" class="warning-text" data-testid="placement-none">
            {{ $t('tutor.additions.change.noPlace') }}
          </span>
          <span v-else-if="change?.placement">{{ change.placement }}</span>
          <span v-else class="warning-text">{{ $t('tutor.additions.change.notPlaced') }}</span>
          <button
            v-if="canChoosePlace && hasPlace && !isChoosingPlace"
            type="button"
            class="button is-small is-text more"
            data-testid="change-place"
            @click="isChoosingPlace = true"
          >
            {{ $t('tutor.additions.change.changePlace') }}
          </button>
          <p v-if="isStale" class="stale" role="alert" data-testid="placement-stale">
            {{
              proposal.kind === 'objective'
                ? $t('tutor.additions.change.staleObjective')
                : $t('tutor.additions.change.stalePlace', { place: change?.placement })
            }}
          </p>
          <!-- the teacher says where it fits, among the course's own parts -->
          <div
            v-if="canChoosePlace && (isChoosingPlace || !hasPlace || isStale)"
            class="select is-small place"
            data-testid="choose-place"
          >
            <select
              :value="development.placement || ''"
              :aria-label="$t('tutor.additions.change.whereLabel')"
              @change="handlePlace"
            >
              <option value="">{{ $t('tutor.additions.change.whereLabel') }}</option>
              <option v-for="place in places" :key="place" :value="place">{{ place }}</option>
            </select>
          </div>
        </dd>

        <dt>{{ $t('tutor.additions.change.suggested') }}</dt>
        <dd class="wording" data-testid="change-suggested">
          <template v-if="isEditing">
            <textarea
              ref="editor"
              v-model="draft"
              class="textarea is-small"
              rows="3"
              data-testid="change-editor"
              @keydown.esc="isEditing = false"
            />
            <div class="buttons mt-2">
              <button
                type="button"
                class="button is-small is-primary"
                :disabled="!draft.trim()"
                data-testid="save-change"
                @click="saveAndAccept"
              >
                {{ $t('tutor.additions.change.saveAndAccept') }}
              </button>
              <button type="button" class="button is-small is-text" @click="isEditing = false">
                {{ $t('tutor.check.cancel') }}
              </button>
            </div>
          </template>
          <template v-else>
            {{ development.edited || proposal.suggested }}
            <span v-if="development.edited" class="muted">
              ({{ $t('tutor.check.origin.edited') }})
            </span>
          </template>
        </dd>

        <dt>{{ $t('tutor.additions.change.why') }}</dt>
        <dd data-testid="change-why">{{ proposal.why }}</dd>
      </dl>

      <!-- how well the change is supported, in one sentence from the real result of the checks:
           always visible before the teacher decides -->
      <p
        class="evidence"
        :class="`is-${evidence.level}`"
        role="status"
        data-testid="evidence-summary"
      >
        <strong :data-testid="`support-${proposal.support}`">{{ $t(evidence.head) }}</strong>
        {{ evidence.text ?? $t(evidence.detail) }}
      </p>

      <!-- the sources, their passages and every point of the check, on request -->
      <details class="evidence-details" data-testid="change-support">
        <summary>{{ $t('tutor.additions.change.basedOn') }}</summary>
        <ul v-if="proposal.resources.length" class="based-on">
          <li v-for="resource in proposal.resources" :key="resource.document.payload.document_id">
            <a
              :href="sourceLink(resource.document, resource.quote || resource.evidence)"
              target="_blank"
              rel="noopener"
            >
              {{ resource.document.payload.document_title }}
            </a>
            <span v-if="resource.role" class="context-tag" data-testid="context-tag">
              {{ $t('tutor.additions.contextTag') }}
            </span>
            <!-- the sentence of the resource that backs this change, found word for word in it -->
            <q v-if="resource.quote" class="quote" data-testid="change-quote">{{
              resource.quote
            }}</q>
          </li>
        </ul>
        <p v-else class="muted">{{ $t('tutor.additions.change.evidence.noneDefault') }}</p>
        <div v-if="checks && hasCheckNotes" class="check-notes" data-testid="check-notes">
          <p class="muted">{{ $t('tutor.additions.change.checkTitle') }}</p>
          <ul>
            <li v-if="checks.status === 'unchecked'" data-testid="check-unchecked">
              {{ $t('tutor.additions.change.unchecked') }}
            </li>
            <li v-for="problem in checks.problems" :key="problem" data-testid="check-problem">
              {{ problem }}
            </li>
            <li v-if="checks.unbackedNames.length" data-testid="check-names">
              {{
                $t('tutor.additions.change.unbackedNames', {
                  names: checks.unbackedNames.join(', ')
                })
              }}
            </li>
          </ul>
        </div>
      </details>

      <!-- pedagogical notes: help to understand the change, not part of it; GreenComp last -->
      <details v-if="hasNotes && notes" class="notes" data-testid="pedagogical-notes">
        <summary>{{ $t('tutor.additions.change.notes.title') }}</summary>
        <p class="muted">{{ $t('tutor.additions.change.notes.hint') }}</p>
        <dl class="notes-list">
          <template v-if="notes.learning">
            <dt>{{ $t('tutor.additions.change.notes.learning') }}</dt>
            <dd data-testid="note-learning">{{ notes.learning }}</dd>
          </template>
          <template v-if="notes.teaching">
            <dt>{{ $t('tutor.additions.change.notes.teaching') }}</dt>
            <dd data-testid="note-teaching">{{ notes.teaching }}</dd>
          </template>
          <template v-if="notes.check">
            <dt>{{ $t('tutor.additions.change.notes.check') }}</dt>
            <dd data-testid="note-check">{{ notes.check }}</dd>
          </template>
          <template v-if="notes.greencomp">
            <dt>{{ $t('tutor.additions.change.notes.greencomp') }}</dt>
            <dd data-testid="note-greencomp">
              <strong>{{ $t(`tutor.greencomp.${notes.greencomp.id}`) }}</strong> —
              {{ notes.greencomp.how }}
            </dd>
          </template>
        </dl>
      </details>

      <!-- accept, edit or skip an addition; keep the original of what it revises -->
      <div v-if="!isEditing" class="change-actions">
        <template v-if="development.decision === 'pending'">
          <button
            type="button"
            class="button is-small is-primary"
            data-testid="accept-change"
            @click="store.acceptChange(connection.id)"
          >
            {{ $t('tutor.additions.change.accept') }}
          </button>
          <button
            type="button"
            class="button is-small is-text"
            data-testid="edit-change"
            @click="startEditing"
          >
            {{ $t('tutor.check.edit') }}
          </button>
          <button
            type="button"
            class="button is-small is-text"
            data-testid="keep-original"
            @click="store.keepOriginal(connection.id)"
          >
            {{
              isRevision
                ? $t('tutor.additions.change.keepOriginal')
                : $t('tutor.additions.change.skip')
            }}
          </button>
        </template>
        <template v-else>
          <span class="decided" :data-testid="`change-${development.decision}`">
            {{
              development.decision === 'accepted'
                ? '✓ ' + $t('tutor.additions.change.accepted')
                : isRevision
                  ? $t('tutor.additions.change.kept')
                  : $t('tutor.additions.change.skipped')
            }}
          </span>
          <button
            type="button"
            class="button is-small is-text"
            data-testid="reconsider"
            @click="store.reconsider(connection.id)"
          >
            {{ $t('tutor.additions.undo') }}
          </button>
        </template>
      </div>
    </template>
  </section>
</template>

<style scoped>
.stale {
  margin-top: 0.25rem;
  padding-left: 0.6rem;
  border-left: 3px solid var(--neutral-70);
  font-size: 0.85rem;
  color: var(--neutral-80);
}

.development {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--neutral-20);
}

.waiting {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--neutral-80);
}

.dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: var(--lpi-violet);
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  50% {
    opacity: 0.3;
  }
}

.problem {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  background: var(--lpi-yellow-lighter);
}

.change-title {
  font-size: 1rem;
  font-weight: 700;
}

.original-text.is-clamped {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.more {
  padding-left: 0;
}

[data-testid='placement-line'] + .more,
.warning-text + .more {
  margin-left: 0.5rem;
}

.place {
  display: block;
  margin-top: 0.4rem;
  max-width: 100%;
}

.place select {
  max-width: 100%;
}

.change {
  display: grid;
  grid-template-columns: 10rem minmax(0, 1fr);
  gap: 0.5rem 1rem;
  margin-top: 0.75rem;
}

.change dt {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--neutral-70);
}

.ref {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
}

.original-text {
  color: var(--neutral-80);
}

.muted,
.context-tag {
  margin-left: 0.4rem;
  font-size: 0.75rem;
  color: var(--neutral-70);
  white-space: nowrap;
}

.wording {
  font-weight: 500;
}

/* placement problems stay readable, not greyed out */
.warning-text {
  font-size: 0.9rem;
  color: var(--neutral-80);
}

/* the evidence in one sentence: a quiet line when supported, a clear note when not */
.evidence {
  margin-top: 0.75rem;
  padding: 0.4rem 0.75rem;
  border-left: 3px solid var(--primary);
  font-size: 0.9rem;
  color: var(--neutral-80);
}

.evidence.is-partial,
.evidence.is-none,
.evidence.is-unchecked {
  border-left-color: var(--neutral-70);
  background: var(--lpi-yellow-lighter);
}

.evidence-details {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  summary {
    font-weight: 600;
    color: var(--neutral-80);
    cursor: pointer;
  }
  .based-on {
    margin-top: 0.4rem;
  }
}

.check-notes {
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-left: 3px solid var(--neutral-40);
  background: var(--neutral-10);
  font-size: 0.85rem;
}

.check-notes ul {
  margin: 0.25rem 0 0 1.1rem;
  list-style: disc;
}

.based-on {
  list-style: disc;
  padding-left: 1.1rem;
  font-size: 0.9rem;
}

.quote {
  display: block;
  margin-top: 0.15rem;
  font-size: 0.85rem;
  font-style: italic;
  color: var(--neutral-70);
}

.notes {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  summary {
    font-weight: 600;
    color: var(--neutral-80);
    cursor: pointer;
  }
}

.notes-list {
  display: grid;
  grid-template-columns: 10rem minmax(0, 1fr);
  gap: 0.35rem 1rem;
  margin-top: 0.4rem;
}

.notes-list dt {
  font-size: 0.85rem;
  color: var(--neutral-70);
}

@media (max-width: 600px) {
  .notes-list {
    grid-template-columns: minmax(0, 1fr);
  }
}

.change-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.decided {
  font-weight: 600;
  color: var(--primary-dark);
}

@media (max-width: 600px) {
  .change {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.25rem;
  }
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { type Connection, changeOf, useConnectionsStore } from '@/stores/connections';
import { useCourseStore } from '@/stores/course';
import { insertionPoint } from '@/utils/completeSyllabus';

// where a proposed change goes in the course: the objective or competency it revises (its full
// wording below, clamped when long), or the course part it is added to. the teacher can choose
// another place among the course's topics, subtopics and outline; a revised objective stays with
// its objective. a place no longer in the course (corrected in step 2) is said, not hidden
const props = defineProps<{ connection: Connection }>();
const store = useConnectionsStore();
const course = useCourseStore();

const development = computed(() => props.connection.development);
const proposal = computed(() => development.value?.proposal || null);
const change = computed(() => changeOf(props.connection));
const isRevision = computed(() => proposal.value?.kind === 'objective');

// which of the course's objectives or competencies it revises, by its number
const revised = computed(() => {
  const original = proposal.value?.original;
  if (!isRevision.value || !original) return null;
  const { objectives, competencies } = course.courseToUpdate;
  const objective = objectives.indexOf(original);
  if (objective >= 0) return { key: 'tutor.additions.change.revisesObjective', n: objective + 1 };
  const competency = competencies.indexOf(original);
  if (competency >= 0) {
    return { key: 'tutor.additions.change.revisesCompetency', n: competency + 1 };
  }
  return { key: 'tutor.additions.change.revises', n: 0 };
});

const LONG_ORIGINAL = 180;
const isOriginalOpen = ref(false);
const isLongOriginal = computed(() => (proposal.value?.original || '').length > LONG_ORIGINAL);

const canChoosePlace = computed(() => !isRevision.value && course.coursePlaces.length > 0);
const isChoosingPlace = ref(false);
const isStale = computed(
  () => !!change.value?.placement && !course.courseParts.includes(change.value.placement)
);

// where the complete word document puts it, after which line of the syllabus: the same plan as
// the export, so the same place. only for an addition, when the syllabus's whole text was read
const isLinePlaced = computed(
  () => !!course.wholeText && !!change.value && !isRevision.value && !isStale.value
);
const point = computed(() =>
  isLinePlaced.value && course.wholeText && change.value
    ? insertionPoint(course.wholeText, course.courseToUpdate, change.value)
    : null
);

const handlePlace = (event: Event) => {
  store.placeChange(props.connection.id, (event.target as HTMLSelectElement).value);
  isChoosingPlace.value = false;
};
</script>

<template>
  <div class="placement">
    <p v-if="revised && proposal?.original" data-testid="change-original">
      <span class="ref">{{ $t(revised.key, { n: revised.n }) }}</span>
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
    <template v-else>
      <span v-if="change?.placement" data-testid="placement-part">{{ change.placement }}</span>
      <span v-else class="warning-text" data-testid="not-placed">
        {{ $t('tutor.additions.change.notPlaced') }}
      </span>
      <button
        v-if="canChoosePlace && change?.placement && !isChoosingPlace && !isStale"
        type="button"
        class="button is-small is-text more"
        data-testid="change-place"
        @click="isChoosingPlace = true"
      >
        {{ $t('tutor.additions.change.changePlace') }}
      </button>
    </template>

    <p v-if="isLinePlaced" class="line" data-testid="placement-line">
      {{
        point
          ? $t('tutor.additions.change.afterLine', { line: point.line })
          : $t('tutor.additions.change.atEnd')
      }}
    </p>

    <p v-if="isStale" class="stale" role="alert" data-testid="placement-stale">
      {{
        isRevision
          ? $t('tutor.additions.change.staleObjective')
          : $t('tutor.additions.change.stalePlace', { place: change?.placement })
      }}
    </p>

    <div
      v-if="canChoosePlace && (isChoosingPlace || !change?.placement || isStale)"
      class="select is-small place"
      data-testid="choose-place"
    >
      <select
        :value="development?.placement || ''"
        :aria-label="$t('tutor.additions.change.whereLabel')"
        @change="handlePlace"
      >
        <option value="">{{ $t('tutor.additions.change.whereLabel') }}</option>
        <option v-for="place in course.coursePlaces" :key="place" :value="place">
          {{ place }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
/* a long line of the syllabus, shortened: the document holds it whole */
.line {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  font-size: 0.85rem;
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

[data-testid='placement-part'] + .more {
  margin-left: 0.5rem;
}

/* a placement problem stays readable, not greyed out */
.warning-text {
  font-size: 0.9rem;
  color: var(--neutral-80);
}

.stale {
  margin-top: 0.25rem;
  padding-left: 0.6rem;
  border-left: 3px solid var(--neutral-70);
  font-size: 0.85rem;
  color: var(--neutral-80);
}

.place {
  display: block;
  margin-top: 0.4rem;
  max-width: 100%;
}

.place select {
  max-width: 100%;
}
</style>

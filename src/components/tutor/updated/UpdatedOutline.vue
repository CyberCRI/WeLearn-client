<script setup lang="ts">
import { computed } from 'vue';
import AddedChange from '@/components/tutor/updated/AddedChange.vue';
import { useSyllabusText } from '@/composables/useSyllabusExport';
import { useCourseStore } from '@/stores/course';
import { buildUpdatedCourse, isOutlineShown as outlineShown } from '@/utils/updatedSyllabus';
import { capitalise } from '@/utils/strings';
import type { ApprovedChange } from '@/types';

// ponytail: without a verified complete text, the outline confirmed in step 2 stands in for the
// document, labelled as such: what WeLearn did not read is not reproduced. each accepted change
// shows in its place, a revised objective instead of its original (one click away)
const props = defineProps<{ changes: ApprovedChange[] }>();
const emit = defineEmits<{ save: [connectionId: string, text: string] }>();

const course = useCourseStore();
const syllabusT = useSyllabusText();
const info = computed(() => course.courseToUpdate);
const updated = computed(() => buildUpdatedCourse(info.value, props.changes));
const isOutlineShown = computed(() => outlineShown(updated.value));
const kindLabel = (change: ApprovedChange) =>
  syllabusT(`tutor.additions.change.kinds.${change.kind}`);
const save = (id: string, text: string) => emit('save', id, text);
</script>

<template>
  <div class="course" data-testid="updated-outline">
    <h2 class="course-title">{{ info.title }}</h2>
    <p v-if="info.discipline || info.level" class="muted">
      {{ [capitalise(info.discipline || ''), info.level].filter(Boolean).join(' · ') }}
    </p>
    <p v-if="info.overview" class="overview">{{ info.overview }}</p>

    <template v-if="updated.objectives.length">
      <h3>{{ syllabusT('tutor.check.objectivesTitle') }}</h3>
      <ol class="plain-list">
        <li v-for="(objective, index) in updated.objectives" :key="index">
          <AddedChange
            v-if="objective.revision"
            :change="objective.revision"
            :label="kindLabel(objective.revision)"
            data-testid="revised"
            @save="save"
          />
          <template v-else>{{ objective.text }}</template>
          <details v-if="objective.original" class="was">
            <summary>{{ syllabusT('tutor.updated.seeOriginal') }}</summary>
            {{ objective.original }}
          </details>
          <AddedChange
            v-for="change in objective.added"
            :key="change.connectionId"
            :change="change"
            :label="kindLabel(change)"
            @save="save"
          />
        </li>
      </ol>
    </template>

    <template v-if="updated.competencies.length">
      <h3>{{ syllabusT('tutor.check.groups.competency') }}</h3>
      <ul class="plain-list bullets">
        <li v-for="(competency, index) in updated.competencies" :key="index">
          {{ competency.text }}
          <AddedChange
            v-for="change in competency.added"
            :key="change.connectionId"
            :change="change"
            :label="kindLabel(change)"
            @save="save"
          />
        </li>
      </ul>
    </template>

    <template v-if="updated.topics.length">
      <h3>{{ syllabusT('tutor.check.topicsLabel') }}</h3>
      <ul class="plain-list bullets">
        <li v-for="(topic, index) in updated.topics" :key="index">
          <strong>{{ topic.title }}</strong>
          <span v-if="topic.subtopics.length" class="muted">
            — {{ topic.subtopics.join(', ') }}</span
          >
          <AddedChange
            v-for="change in topic.added"
            :key="change.connectionId"
            :change="change"
            :label="kindLabel(change)"
            @save="save"
          />
        </li>
      </ul>
    </template>

    <template v-if="isOutlineShown">
      <h3>{{ syllabusT('tutor.check.outlineTitle', { n: updated.sessions.length }) }}</h3>
      <ul class="plain-list bullets">
        <li v-for="(session, index) in updated.sessions" :key="index">
          {{ session.line }}
          <AddedChange
            v-for="change in session.added"
            :key="change.connectionId"
            :change="change"
            :label="kindLabel(change)"
            @save="save"
          />
        </li>
      </ul>
    </template>

    <template v-if="updated.unplaced.length">
      <h3 data-testid="outline-unplaced">{{ syllabusT('tutor.updated.placementUnknown') }}</h3>
      <AddedChange
        v-for="change in updated.unplaced"
        :key="change.connectionId"
        :change="change"
        :label="kindLabel(change)"
        @save="save"
      />
    </template>
  </div>
</template>

<style scoped>
.course-title {
  font-size: 1.15rem;
  font-weight: 700;
}

.muted {
  font-size: 0.85rem;
  color: var(--neutral-70);
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
</style>

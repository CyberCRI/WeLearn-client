<script setup lang="ts">
import { computed, ref } from 'vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import EditButton from '@/components/tutor/EditButton.vue';
import ObjectivesEditor from '@/components/tutor/review/ObjectivesEditor.vue';
import { useCourseStore } from '@/stores/course';
import { itemsOf, noteOf } from '@/utils/courseReview';

// the course's own learning objectives as a plain numbered list, competencies folded,
// degree-level ones kept aside. objectives neither WeLearn nor the syllabus's headings place are
// never taken as the course's until the teacher sorts them
const store = useCourseStore();

// a long list shows its first ones; all of them, as written, one click away
const SHORT_LIST = 5;
const isAllShown = ref(false);
const isEditing = ref(false);

const courseItems = computed(() => itemsOf(store.courseObjectives, 'objective'));
const shownCourseItems = computed(() =>
  isAllShown.value ? courseItems.value : courseItems.value.slice(0, SHORT_LIST)
);
const competencyItems = computed(() => itemsOf(store.courseObjectives, 'competency'));
const unsortedItems = computed(() => itemsOf(store.courseObjectives, 'unsorted'));
</script>

<template>
  <section class="part" data-testid="objectives">
    <div class="part-head">
      <h2 class="part-title">{{ $t('tutor.check.objectivesTitle') }}</h2>
      <!-- a pencil to correct the list; adding the first objective stays a worded action -->
      <EditButton
        v-if="!isEditing && courseItems.length"
        :label="$t('tutor.check.editField', { field: $t('tutor.check.objectivesTitle') })"
        data-testid="edit-objectives"
        @click="isEditing = true"
      />
      <ButtonComponent
        v-else-if="!isEditing"
        is-discreet
        class="is-small"
        data-testid="edit-objectives"
        @click="isEditing = true"
      >
        {{ $t('tutor.check.addObjective') }}
      </ButtonComponent>
    </div>

    <ObjectivesEditor v-if="isEditing" @done="isEditing = false" />

    <template v-else>
      <ol v-if="courseItems.length" class="plain-list" data-testid="list-objective">
        <li v-for="{ field, index } in shownCourseItems" :key="index" data-testid="objective-item">
          {{ field.value }}
          <span v-if="noteOf(field)" class="muted" data-testid="item-note">
            ({{ $t(noteOf(field)!) }})
          </span>
        </li>
      </ol>
      <ButtonComponent
        v-if="courseItems.length > SHORT_LIST"
        is-discreet
        class="is-small mt-2"
        data-testid="show-all-objectives"
        @click="isAllShown = !isAllShown"
      >
        {{
          isAllShown
            ? $t('tutor.check.showFewer')
            : $t('tutor.check.showAll', { n: courseItems.length })
        }}
      </ButtonComponent>
      <p v-if="!courseItems.length" class="muted" data-testid="no-objectives">
        {{ $t('tutor.check.noObjectives') }}
      </p>

      <details v-if="competencyItems.length" class="sub-part" data-testid="list-competency">
        <summary>{{ $t('tutor.check.groups.competency') }} ({{ competencyItems.length }})</summary>
        <ul class="plain-list">
          <li v-for="{ field, index } in competencyItems" :key="index" data-testid="objective-item">
            {{ field.value }}
            <span v-if="noteOf(field)" class="muted">({{ $t(noteOf(field)!) }})</span>
          </li>
        </ul>
      </details>
    </template>

    <details v-if="unsortedItems.length" class="sub-part" data-testid="group-unsorted">
      <summary>{{ $t('tutor.check.unsortedTitle', { n: unsortedItems.length }) }}</summary>
      <p class="muted mb-2">{{ $t('tutor.check.unsortedHint') }}</p>
      <ul class="aside-list">
        <li v-for="{ field, index } in unsortedItems" :key="index" data-testid="unsorted-item">
          <span>{{ field.value }}</span>
          <span class="sort-actions">
            <ButtonComponent
              is-discreet
              class="is-small"
              data-testid="sort-to-course"
              @click="store.setGroup(index, 'objective')"
            >
              {{ $t('tutor.check.sortToCourse') }}
            </ButtonComponent>
            <ButtonComponent
              is-discreet
              class="is-small"
              data-testid="sort-aside"
              @click="store.setGroup(index, 'programme')"
            >
              {{ $t('tutor.check.sortAside') }}
            </ButtonComponent>
          </span>
        </li>
      </ul>
    </details>
  </section>
</template>

<style scoped>
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

.plain-list {
  padding-left: 1.25rem;
  list-style: decimal;
  li + li {
    margin-top: 0.35rem;
  }
}

ul.plain-list {
  margin-top: 0.5rem;
  list-style: disc;
}

.muted {
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.sub-part {
  margin-top: 1rem;
  summary {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--neutral-80);
    cursor: pointer;
  }
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

.sort-actions {
  display: flex;
  gap: 0.25rem;
}
</style>

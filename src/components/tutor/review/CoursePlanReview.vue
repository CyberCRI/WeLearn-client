<script setup lang="ts">
import { computed, ref } from 'vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import EditButton from '@/components/tutor/EditButton.vue';
import { useCourseStore } from '@/stores/course';
import { normalise } from '@/utils/courseCheck';

// the course outline (sessions, weeks or chapters) as the syllabus lays it out, one click away
// and correctable. not shown when it only repeats the main topics
const store = useCourseStore();

const isShown = computed(() => {
  const plan = store.coursePlan;
  if (!plan.length) return false;
  const topics = store.courseTopics.map(({ value }) => normalise(value));
  const repeated = plan.filter((line) => topics.some((topic) => normalise(line).includes(topic)));
  return plan.length > store.courseTopics.length || repeated.length < plan.length;
});

const draft = ref<string | null>(null);
const save = () => {
  store.setCoursePlan((draft.value || '').split('\n'));
  draft.value = null;
};
</script>

<template>
  <details v-if="isShown || draft !== null" class="outline" data-testid="course-plan">
    <summary>{{ $t('tutor.check.outlineTitle', { n: store.coursePlan.length }) }}</summary>
    <form v-if="draft !== null" @submit.prevent="save">
      <p class="muted mb-1">{{ $t('tutor.check.outlineHint') }}</p>
      <textarea v-model="draft" class="textarea is-small" rows="8" data-testid="outline-editor" />
      <div class="editor-actions">
        <ButtonComponent type="submit" color="primary" class="is-small" data-testid="save-outline">
          {{ $t('tutor.check.saveChanges') }}
        </ButtonComponent>
        <ButtonComponent
          type="button"
          is-discreet
          class="is-small"
          data-testid="cancel-outline"
          @click="draft = null"
        >
          {{ $t('tutor.check.cancel') }}
        </ButtonComponent>
      </div>
    </form>
    <template v-else>
      <ol class="sessions">
        <li v-for="(line, index) in store.coursePlan" :key="index">{{ line }}</li>
      </ol>
      <EditButton
        :label="$t('tutor.check.editField', { field: $t('tutor.check.outlineName') })"
        data-testid="edit-outline"
        @click="draft = store.coursePlan.join('\n')"
      />
    </template>
  </details>
</template>

<style scoped>
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

.muted {
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.editor-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
</style>

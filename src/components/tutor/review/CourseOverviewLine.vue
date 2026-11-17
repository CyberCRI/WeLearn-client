<script setup lang="ts">
import { computed } from 'vue';
import ReviewField from '@/components/tutor/ReviewField.vue';
import ReviewLine from '@/components/tutor/review/ReviewLine.vue';
import { useCourseStore } from '@/stores/course';
import { looksLikeMoreThanDescription } from '@/utils/courseCheck';

// the overview: WeLearn's short summary; without one, the syllabus's own description when it is
// a clear one. a description that holds more (programme information) stays in the store, unshown
const store = useCourseStore();

const isClearDescription = computed(
  () =>
    !!store.courseDescription &&
    (store.courseDescription.origin !== 'extracted' ||
      !looksLikeMoreThanDescription(store.courseDescription.value))
);
const overviewKind = computed(() =>
  store.courseSummary ? 'summary' : isClearDescription.value ? 'description' : null
);
</script>

<template>
  <ReviewLine
    v-if="overviewKind"
    :label="$t('tutor.check.overviewLabel')"
    data-testid="description-part"
  >
    <ReviewField
      v-if="overviewKind === 'summary'"
      :field="store.courseSummary"
      isCollapsible
      :editLabel="$t('tutor.check.editField', { field: $t('tutor.check.overviewLabel') })"
      data-testid="summary"
      @save="store.setSummary"
      @restore="store.restoreSummary"
    />
    <ReviewField
      v-else
      :field="store.courseDescription"
      isCollapsible
      :editLabel="$t('tutor.check.editField', { field: $t('tutor.check.overviewLabel') })"
      data-testid="description"
      @save="store.setDescription"
      @restore="store.restoreDescription"
    />
  </ReviewLine>
</template>

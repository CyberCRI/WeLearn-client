<script setup lang="ts">
import { computed } from 'vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import ReviewField from '@/components/tutor/ReviewField.vue';
import TeachingContext from '@/components/tutor/TeachingContext.vue';
import { useCourseStore } from '@/stores/course';
import { OVERVIEW_KEYS, type OverviewKey, overviewOf } from '@/utils/courseReview';

// what WeLearn did not identify: one line of "+ add" buttons; the one being added takes the
// full width
const store = useCourseStore();

const missingKeys = computed(() => OVERVIEW_KEYS.filter((key) => !store.teachingContext[key]));
const hasOverview = computed(() => !!overviewOf(store.courseSummary, store.courseDescription));
// shared with CourseInfoLines, where a value being added goes once typed
const addingKey = defineModel<OverviewKey | null>('editingKey', { default: null });
</script>

<template>
  <div v-if="missingKeys.length || !hasOverview" class="missing" data-testid="overview-missing">
    <span class="muted">{{ $t('tutor.check.notFoundOverview') }}</span>
    <template v-for="key in missingKeys" :key="key">
      <TeachingContext
        v-if="addingKey === key"
        class="adding"
        isPlain
        :keys="[key]"
        :context="store.teachingContext"
        :prefilled="store.prefilled"
        :updateContext="store.updateContext"
      />
      <ButtonComponent
        v-else
        is-discreet
        class="is-small"
        :data-testid="`add-overview-${key}`"
        @click="addingKey = key"
      >
        + {{ $t(`tutor.course.fields.${key}`) }}
      </ButtonComponent>
    </template>
    <ReviewField
      v-if="!hasOverview"
      :field="null"
      :addLabel="'+ ' + $t('tutor.check.overviewLabel')"
      data-testid="add-overview-description"
      @save="store.setDescription"
    />
  </div>
</template>

<style scoped>
.missing {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.5rem;
  padding-top: 0.75rem;
}

.adding {
  flex-basis: 100%;
}

.muted {
  font-size: 0.85rem;
  color: var(--neutral-70);
}
</style>

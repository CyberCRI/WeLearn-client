<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import CourseChoice from '@/components/tutor/review/CourseChoice.vue';
import CourseInfoLines from '@/components/tutor/review/CourseInfoLines.vue';
import CourseOverviewLine from '@/components/tutor/review/CourseOverviewLine.vue';
import CoursePlanReview from '@/components/tutor/review/CoursePlanReview.vue';
import MissingOverview from '@/components/tutor/review/MissingOverview.vue';
import ObjectivesReview from '@/components/tutor/review/ObjectivesReview.vue';
import TopicsReview from '@/components/tutor/review/TopicsReview.vue';
import TeachingContext from '@/components/tutor/TeachingContext.vue';
import { useCourseStore } from '@/stores/course';
import type { OverviewKey } from '@/utils/courseReview';

// "check your course": has WeLearn understood the course? the original one click away, a short
// course card (title, discipline, level, overview, main topics, outline), the learning
// objectives. each part has its own Edit; only a real doubt is marked for the teacher
const store = useCourseStore();

// a syllabus or a course plan are what this screen expects; a lesson or an article are not
const isSyllabus = computed(
  () => !store.detectedType || ['syllabus', 'course_plan'].includes(store.detectedType)
);

// how the course is taught: optional, folded unless the syllabus stated some of it
const CONTEXT_KEYS = [
  'sessions',
  'sessionLength',
  'sessionType',
  'sessionMode',
  'classSize'
] as const;
const hasReadContext = computed(() => CONTEXT_KEYS.some((key) => store.prefilled.includes(key)));

// the course information line being added or corrected, shared by its two parts
const editingKey = ref<OverviewKey | null>(null);

// a local link to the teacher's own file (it never leaves the device again)
const originalUrl = ref<string | null>(null);
watch(
  () => store.file,
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
  store.file ? `${Math.max(1, Math.round(store.file.size / 1024))} KB` : ''
);
</script>

<template>
  <div class="course-review">
    <h1 class="title is-4 is-size-5-mobile">{{ $t('tutor.check.title') }}</h1>
    <p class="subtitle is-6">{{ $t('tutor.check.description') }}</p>

    <p v-if="store.file" class="file-line" data-testid="original">
      <span class="original-name">{{ store.file.name }}</span>
      <span class="muted">{{ fileSize }}</span>
      <a v-if="originalUrl" :href="originalUrl" target="_blank" rel="noopener">
        {{ $t('tutor.check.openOriginal') }}
      </a>
    </p>

    <!-- notes on the reading itself, only when they apply -->
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
    <CourseChoice
      v-if="store.coursesFound.length > 1"
      :courses="store.coursesFound"
      @choose="store.chooseCourse"
    />

    <div class="course-card" data-testid="course">
      <dl>
        <CourseInfoLines v-model:editingKey="editingKey" />
        <CourseOverviewLine />
        <TopicsReview />
      </dl>
      <CoursePlanReview />
      <MissingOverview v-model:editingKey="editingKey" />
    </div>

    <ObjectivesReview />

    <details class="context" :open="hasReadContext" data-testid="teaching-context-more">
      <summary>
        {{ $t('tutor.course.contextTitle') }}
        <span class="muted">{{ $t('tutor.course.optional') }}</span>
      </summary>
      <p class="muted mt-1 mb-3">{{ $t('tutor.course.contextHint') }}</p>
      <TeachingContext
        isPlain
        :keys="[...CONTEXT_KEYS]"
        :context="store.teachingContext"
        :prefilled="store.prefilled"
        :evidence="store.contextEvidence"
        :aiFilled="store.aiFilled"
        :updateContext="store.updateContext"
      />
    </details>

    <p class="local-note" data-testid="local-note">{{ $t('tutor.check.localNote') }}</p>

    <div class="review-actions">
      <span v-if="!store.canConfirm" class="muted" data-testid="need-objective">
        {{ $t('tutor.check.needObjective') }}
      </span>
      <ButtonComponent
        color="primary"
        data-testid="confirm-course"
        :disabled="!store.canConfirm"
        @click="store.confirmReview"
      >
        {{ $t('tutor.check.action') }} →
      </ButtonComponent>
    </div>
  </div>
</template>

<style scoped>
.course-review {
  width: 100%;
  max-width: 48rem;
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

.detected {
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  background: var(--lpi-yellow-lighter);
  font-size: 0.9rem;
}

.course-card {
  margin-top: 1.25rem;
  padding-bottom: 0.75rem;
}

.context {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--neutral-20);
  summary {
    font-weight: 600;
    cursor: pointer;
  }
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
</style>

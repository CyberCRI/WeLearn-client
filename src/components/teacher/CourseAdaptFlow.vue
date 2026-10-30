<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import SyllabusUpload from '@/components/teacher/SyllabusUpload.vue';
import CourseReview from '@/components/teacher/CourseReview.vue';
import CourseChooser from '@/components/teacher/CourseChooser.vue';
import CourseConnections from '@/components/teacher/CourseConnections.vue';
import { useCourseDesignStore } from '@/stores/courseDesign';

// "adapt my existing course": upload (or example / pasted text), real reading by the API, review.
// shown on /teach/design/adapt and inside "design your course" (/teach/design/course)
const store = useCourseDesignStore();

// a warning left from an earlier visit is not shown again: only a request that fails now shows one
store.dismissProblem();

const isReading = computed(() => ['uploading', 'reading'].includes(store.status));
// the upload has really finished once the API is reading
const isUploaded = computed(() => store.status === 'reading');

// seconds since the API started reading (shown while waiting, never a fake progress)
const now = ref(Date.now());
let timer: ReturnType<typeof setInterval> | undefined;
watch(
  () => store.status,
  (status) => {
    clearInterval(timer);
    if (status === 'reading') timer = setInterval(() => (now.value = Date.now()), 1000);
  }
);
onBeforeUnmount(() => clearInterval(timer));
const elapsed = computed(() =>
  store.readingStartedAt ? Math.max(0, Math.round((now.value - store.readingStartedAt) / 1000)) : 0
);
</script>
<template>
  <div class="course-adapt-flow">
    <CourseReview v-if="store.status === 'ready' && !store.isConfirmed" />
    <CourseConnections v-else-if="store.status === 'ready'" />
    <CourseChooser v-else-if="store.status === 'choosing'" />

    <!-- only real operations: the upload (with its real progress), then the API reading;
         the review step is never marked done here: on success the review itself replaces this -->
    <section v-else-if="isReading" class="processing" aria-live="polite" data-testid="reading">
      <div class="processing-head">
        <p class="processing-file">{{ store.file?.name }}</p>
        <button type="button" class="button is-small is-text" @click="store.cancelReading()">
          {{ $t('journey.teach.adapt.reading.cancel') }}
        </button>
      </div>
      <ol class="processing-steps">
        <li :class="isUploaded ? 'is-done' : 'is-active'" data-testid="step-sending">
          <span class="step-dot" aria-hidden="true">{{ isUploaded ? '✓' : '1' }}</span>
          <div class="step-body">
            <p class="step-title">
              {{
                isUploaded
                  ? $t('journey.teach.adapt.reading.sent')
                  : $t('journey.teach.adapt.reading.sending')
              }}
            </p>
            <div
              v-if="!isUploaded"
              class="bar"
              role="progressbar"
              :aria-valuenow="store.uploadProgress"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <span class="bar-fill" :style="{ width: `${store.uploadProgress}%` }" />
            </div>
          </div>
        </li>
        <li :class="isUploaded ? 'is-active' : 'is-pending'" data-testid="step-reading">
          <span class="step-dot" aria-hidden="true">2</span>
          <div class="step-body">
            <p class="step-title">
              {{ $t('journey.teach.adapt.reading.reading') }}
              <span v-if="isUploaded" class="elapsed">{{
                $t('journey.teach.adapt.reading.elapsed', { seconds: elapsed })
              }}</span>
            </p>
            <div v-if="isUploaded" class="bar is-indeterminate" role="progressbar">
              <span class="bar-fill" />
            </div>
          </div>
        </li>
        <li class="is-pending" data-testid="step-review">
          <span class="step-dot" aria-hidden="true">3</span>
          <div class="step-body">
            <p class="step-title">{{ $t('journey.teach.adapt.reading.review') }}</p>
          </div>
        </li>
      </ol>
    </section>

    <template v-else>
      <div
        v-if="store.status === 'unavailable' || store.status === 'error'"
        class="problem"
        role="alert"
        :data-testid="`problem-${store.status}`"
      >
        <p class="problem-title">{{ $t(`journey.teach.adapt.${store.status}.title`) }}</p>
        <p>{{ $t(`journey.teach.adapt.${store.status}.text`) }}</p>
      </div>
      <SyllabusUpload />
    </template>
  </div>
</template>

<style scoped>
.processing {
  max-width: 36rem;
  padding: 1.5rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
}

.processing-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.processing-file {
  overflow: hidden;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.processing-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.25rem;
  list-style: none;
}

.processing-steps li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.step-dot {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border: 2px solid var(--neutral-20);
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--neutral-70);
}

.is-active .step-dot {
  border-color: var(--primary);
  color: var(--primary-dark);
  animation: pulse 1.6s ease-in-out infinite;
}

.is-done .step-dot {
  border-color: var(--primary-dark);
  background: var(--primary-dark);
  color: var(--neutral-0);
}

.step-body {
  flex: 1;
  min-width: 0;
  padding-top: 0.2rem;
}

.step-title {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
}

.is-pending .step-title {
  color: var(--neutral-70);
}

.is-active .step-title,
.is-done .step-title {
  font-weight: 600;
}

.elapsed {
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--neutral-70);
}

.bar {
  position: relative;
  height: 0.35rem;
  margin-top: 0.5rem;
  overflow: hidden;
  border-radius: 999px;
  background: var(--neutral-10);
}

.bar-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: var(--primary);
  transition: width 0.2s;
}

/* while the API reads, nothing is measurable: a quiet moving segment, never a percentage */
.bar.is-indeterminate .bar-fill {
  position: absolute;
  width: 30%;
  animation: slide 1.4s ease-in-out infinite;
}

.problem {
  max-width: 40rem;
  margin-bottom: 1rem;
  padding: 1rem 1.25rem;
  border-left: 4px solid var(--tertiary);
  border-radius: 4px;
  background: var(--tertiary-lighter);
}

.problem-title {
  font-weight: 700;
}

.syllabus-upload {
  max-width: 40rem;
}

@keyframes pulse {
  50% {
    box-shadow: 0 0 0 4px var(--primary-lighter);
  }
}

@keyframes slide {
  from {
    left: -30%;
  }
  to {
    left: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .is-active .step-dot,
  .bar.is-indeterminate .bar-fill,
  .bar-fill {
    animation: none;
    transition: none;
  }
}
</style>

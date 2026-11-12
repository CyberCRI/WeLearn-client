<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import i18n from '@/localisation/i18n';
import PathChoice from '@/components/tutor/PathChoice.vue';
import CursusInfo from '@/components/tutor/CursusInfo.vue';
import CourseCheck from '@/components/tutor/CourseCheck.vue';
import SustainabilityAdditions from '@/components/tutor/SustainabilityAdditions.vue';
import UpdatedSyllabus from '@/components/tutor/UpdatedSyllabus.vue';
import { useConnectionsStore } from '@/stores/connections';
import { useDraftStore } from '@/stores/draft';
import DraftResume from '@/components/tutor/DraftResume.vue';
import DraftControl from '@/components/tutor/DraftControl.vue';
import ReadingProgress from '@/components/tutor/ReadingProgress.vue';
import ProgressBar from '@/components/microlearning/ProgressBar.vue';
import ErrorComponent from '@/components/ErrorComponent.vue';
import { useTutorStore } from '@/stores/tutor';
import { scrollToAnchor } from '@/utils/navigation';
import { calculateProgress } from '@/utils/progress';
import type { CoursePath } from '@/types';

const store = useTutorStore();
const { t } = i18n.global;

// one step bar per path: improving an existing course, or creating one from scratch
const SCREENS: Record<CoursePath, readonly string[]> = {
  existing: ['course', 'check', 'additions', 'updated'],
  scratch: ['idea', 'proposal', 'syllabus']
};
const screens = computed(() => (store.path ? SCREENS[store.path] : []));
const stepLabels = computed(() => screens.value.map((s) => t(`tutor.steps.${s}`)));
// the sustainability additions carry their own way back and course line: the start link and the
// recaps of the finished steps are not repeated above them
const isAdditions = computed(() => screens.value[store.step - 1] === 'additions');
const isOwnHeader = computed(() =>
  ['additions', 'updated'].includes(screens.value[store.step - 1])
);

// finished screens fold into a one-line recap; "Edit" opens one again
const expanded = ref<Record<number, boolean>>({});
const isFolded = (n: number) => n < store.step && !expanded.value[n];

const connections = useConnectionsStore();

const recaps = computed<Record<string, string>>(() => ({
  additions: t('tutor.additions.acceptedCount', connections.acceptedChanges.length),
  course: t('tutor.course.recap', { file: store.syllabusFileName }),
  check: store.courseOnlyObjectives.length
    ? t('tutor.check.recap', store.courseOnlyObjectives.length)
    : t('tutor.check.recapTopics', store.courseTopics.length)
}));

watch(
  () => store.step,
  async (step) => {
    expanded.value = {};
    await nextTick();
    scrollToAnchor(`target-${step}`);
  }
);

// a draft kept in this browser is offered when no course is under way
const draft = useDraftStore();
const isStarting = computed(() => !store.path || (store.step === 1 && !store.hasStartedCourse));

onMounted(() => {
  if (isStarting.value) draft.check();
  scrollToAnchor(`target-${store.step}`);
});

// a finished step opens again from the step bar, the work kept. steps 3 and 4 have their own
// page: from there step 2 opens (step 1 shows above it as its recap)
const handleStepSelect = async (index: number) => {
  const step = index + 1;
  if (isOwnHeader.value) {
    store.setStep(Math.max(step, 2));
    await nextTick();
  }
  scrollToAnchor(`target-${step}`);
};
</script>
<template>
  <div class="content-centered-wrapper">
    <DraftResume v-if="isStarting" />
    <div v-if="store.path" class="steps-bar" data-testid="steps-bar">
      <ProgressBar
        :currentStep="store.step - 1"
        :labels="stepLabels"
        :progress="calculateProgress(store.step - 1, stepLabels.length)"
        clickable
        @select="handleStepSelect"
      />
    </div>
    <ErrorComponent v-if="store.reloadError" />

    <div class="layout-flex" :class="{ 'is-wide': isAdditions }">
      <PathChoice
        v-if="!isOwnHeader"
        :path="store.path"
        :hasStarted="store.hasStartedCourse"
        @choose="store.choosePath"
        @reset="store.resetCourse"
      />

      <template v-for="(screen, index) in screens" :key="screen">
        <section
          v-if="store.step > index && !(isOwnHeader && index < store.step - 1)"
          :id="`target-${index + 1}`"
          class="step-section"
        >
          <div v-if="index + 1 < store.step" class="recap" :class="{ open: expanded[index + 1] }">
            <span class="recap-check" aria-hidden="true">✓</span>
            <strong>{{ stepLabels[index] }}</strong>
            <span class="recap-text">{{ recaps[screen] }}</span>
            <button
              class="button is-small is-text"
              @click="expanded[index + 1] = !expanded[index + 1]"
            >
              {{ expanded[index + 1] ? $t('tutor.collapse') : $t('tutor.edit') }}
            </button>
          </div>

          <template v-if="!isFolded(index + 1)">
            <ReadingProgress
              v-if="screen === 'course' && store.readingPhase !== 'idle'"
              :fileName="store.syllabusFile?.name || ''"
              :phase="store.readingPhase"
              :uploadProgress="store.uploadProgress"
              :startedAt="store.readingStartedAt"
              @cancel="store.cancelReading"
            />
            <template v-else-if="screen === 'course'">
              <div
                v-if="store.readError"
                class="notification is-warning is-light"
                role="alert"
                data-testid="read-error"
              >
                <p class="has-text-weight-bold">
                  {{ $t(`tutor.reading.${store.readError}.title`) }}
                </p>
                <p>{{ $t(`tutor.reading.${store.readError}.text`) }}</p>
              </div>
              <CursusInfo
                data-test="fist-step"
                :file="store.syllabusFile"
                :fileError="store.fileError"
                :setFile="store.setSyllabusFile"
                :removeFile="store.removeSyllabusFile"
                :action="store.readSyllabus"
              />
            </template>
            <CourseCheck v-else-if="screen === 'check'" :action="store.confirmCourse" />
            <SustainabilityAdditions v-else-if="screen === 'additions'" />
            <UpdatedSyllabus v-else-if="screen === 'updated'" />
          </template>
        </section>
      </template>
      <!-- a discreet save action, after the work: never a choice imposed at the top -->
      <DraftControl v-if="draft.isSavable" />
    </div>
  </div>
</template>

<style scoped>
.content-centered-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow: hidden;
}

.steps-bar {
  width: 100%;
  padding: 0 20%;
  border-bottom: 1px solid var(--neutral-20);
}

/* compact version of the micro-learning progress bar */
.steps-bar :deep(.progress-wrapper) {
  margin: 0.75rem 0 0.5rem;
}
.steps-bar :deep(.steps) {
  margin-top: 0.5rem;
}
.steps-bar :deep(.step) {
  flex-direction: row;
  justify-content: center;
  gap: 0.5rem;
}
.steps-bar :deep(.circle) {
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.75rem;
  border-width: 1.5px;
}
.steps-bar :deep(.check) {
  width: 0.8rem;
  height: 0.8rem;
}
.steps-bar :deep(.label) {
  margin-top: 0;
  max-width: none;
  font-size: 0.8rem;
}
@media (max-width: 640px) {
  /* only the current step keeps its name */
  .steps-bar :deep(.step:not(.active) .label) {
    display: none;
  }
}

.layout-flex {
  width: 100%;
  overflow-y: auto;
  padding: 1rem 20%;
}

/* the connections read better a little wider, on desktop only */
@media (min-width: 1025px) {
  .layout-flex.is-wide {
    padding-inline: 14%;
  }
}

.step-section {
  padding: 1.5rem 0;
  scroll-margin-top: 0.5rem;
}

.step-section + .step-section {
  border-top: 1px solid var(--neutral-20);
}

.recap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--neutral-70);
}

.recap.open {
  margin-bottom: 1.5rem;
}

.recap-check {
  color: var(--primary-dark);
  font-weight: bold;
}

.recap-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 1024px) {
  .layout-flex,
  .steps-bar {
    padding-inline: 10%;
  }
}

@media (max-width: 768px) {
  .layout-flex,
  .steps-bar {
    padding-inline: 1rem;
  }
}
</style>

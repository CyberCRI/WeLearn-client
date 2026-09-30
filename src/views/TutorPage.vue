<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import i18n from '@/localisation/i18n';
import CursusInfo from '@/components/tutor/CursusInfo.vue';
import SummariesStep from '@/components/tutor/SummariesStep.vue';
import ResourcesStep from '@/components/tutor/ResourcesStep.vue';
import EditableSyllabus from '@/components/tutor/ThirdStep.vue';
import ProgressBar from '@/components/microlearning/ProgressBar.vue';
import ErrorComponent from '@/components/ErrorComponent.vue';
import { useTutorStore } from '@/stores/tutor';
import StatusModal from '@/components/tutor/StatusModal.vue';
import { scrollToAnchor } from '@/utils/navigation';

const store = useTutorStore();
const { t } = i18n.global;

const STEPS = ['documents', 'summary', 'resources', 'syllabus'] as const;
const stepLabels = computed(() => STEPS.map((s) => t(`tutor.steps.${s}`)));

// which loading / error message the modal shows (feedback runs at step 4)
const loadingKind = computed(
  () => (['extract', 'search', 'syllabus', 'feedback'] as const)[store.step - 1] || 'extract'
);

const stepToAction: Record<1 | 2 | 3 | 4, (arg?: any) => Promise<void>> = {
  1: store.handleSummaryFiles,
  2: store.retrieveTutorSearch,
  3: store.handleCreateSyllabus,
  4: store.handleDownloadSyllabus
};

// finished steps fold into a one-line recap; "Edit" opens one again
const expanded = ref<Record<number, boolean>>({});
const isFolded = (n: number) => n < store.step && !expanded.value[n];

const recap = computed(() => ({
  1: t('tutor.documentsStep.recap', {
    files: Object.keys(store.newFilesToSearch).join(', '),
    lang: t(`lang.${store.syllabusLanguage}`)
  }),
  2: t('tutor.summaryStep.recap', store.summaries.length),
  3: store.selectedSources.length
    ? t('tutor.resourcesStep.selected', store.selectedSources.length)
    : t('tutor.resourcesStep.recapAll')
}));

watch(
  () => store.step,
  async (step) => {
    expanded.value = {};
    await nextTick();
    scrollToAnchor(`target-${step}`);
  }
);

onMounted(() => {
  scrollToAnchor(`target-${store.step}`);
});
</script>
<template>
  <div class="content-centered-wrapper">
    <div class="steps-bar">
      <ProgressBar
        :currentStep="store.step - 1"
        :labels="stepLabels"
        clickable
        @select="(i: number) => scrollToAnchor(`target-${i + 1}`)"
      />
    </div>
    <ErrorComponent v-if="store.reloadError" />
    <StatusModal
      :isLoading="store.isLoading"
      :shouldRetryAction="store.shouldRetryAction"
      :action="stepToAction[store.step as 1 | 2 | 3 | 4]"
      :stopAction="store.stopAction"
      :kind="loadingKind"
    />

    <div class="layout-flex">
      <template v-for="n in 4" :key="n">
        <section v-if="store.step >= n" :id="`target-${n}`" class="step-section">
          <div v-if="n < store.step" class="recap" :class="{ open: expanded[n] }">
            <span class="recap-check" aria-hidden="true">✓</span>
            <strong>{{ stepLabels[n - 1] }}</strong>
            <span class="recap-text">{{ recap[n as 1 | 2 | 3] }}</span>
            <button class="button is-small is-text" @click="expanded[n] = !expanded[n]">
              {{ expanded[n] ? $t('tutor.collapse') : $t('tutor.edit') }}
            </button>
          </div>

          <template v-if="!isFolded(n)">
            <CursusInfo
              v-if="n === 1"
              data-test="fist-step"
              :files="store.newFilesToSearch"
              :addFiles="store.addFiles"
              :removeFile="store.removeFile"
              :fileError="store.fileError"
              :selectLang="store.selectSyllabusLanguage"
              :storedLanguage="store.syllabusLanguage"
              v-model:courseTitle="store.courseTitle"
              v-model:level="store.level"
              v-model:duration="store.duration"
              v-model:description="store.description"
              :action="stepToAction[1]"
            />
            <SummariesStep
              v-else-if="n === 2"
              :updateSummary="store.updateSummary"
              :summaries="store.summaries"
              :files="store.newFilesToSearch"
              :action="stepToAction[2]"
            />
            <ResourcesStep
              v-else-if="n === 3"
              data-test="second-step"
              :sources="store.tutorSearch?.documents"
              :searchError="store.hasSearchError"
              :appendSource="store.appendSource"
              :selectedSources="store.selectedSources"
              :action="stepToAction[3]"
            />
            <EditableSyllabus
              v-else
              data-test="third-step"
              :syllabus="store.syllabi"
              :updateSyllabus="store.updateSyllabus"
              :giveFeedback="store.giveFeedback"
              :feedbackHistory="store.feedbackHistory"
              :action="stepToAction[4]"
              :restart="store.restart"
              :updateSyllabusInDB="store.updateSyllabusInDB"
            />
          </template>
        </section>
      </template>
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

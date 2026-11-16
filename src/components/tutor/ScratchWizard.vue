<script setup lang="ts">
// the current syllabus creator: files → summaries → resources → syllabus. TutorPage renders it,
// and syllabus v2 makes it the "from scratch" path, with the path choice in its `intro` slot
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import i18n from '@/localisation/i18n';
import CursusInfo from '@/components/tutor/CursusInfo.vue';
import SummariesStep from '@/components/tutor/SummariesStep.vue';
import ResourcesStep from '@/components/tutor/ResourcesStep.vue';
import EditableSyllabus from '@/components/tutor/ThirdStep.vue';
import TutorStepsBar from '@/components/tutor/TutorStepsBar.vue';
import ErrorComponent from '@/components/ErrorComponent.vue';
import { useTutorStore } from '@/stores/tutor';
import StatusModal from '@/components/tutor/StatusModal.vue';
import GuestQuotaNotice from '@/components/GuestQuotaNotice.vue';
import ToasterComponent from '@/components/ToasterComponent.vue';
import { scrollToAnchor } from '@/utils/navigation';

const store = useTutorStore();
const { t } = i18n.global;

const STEPS = ['documents', 'summary', 'resources', 'syllabus'] as const;
const stepLabels = computed(() => STEPS.map((s) => t(`tutor.steps.${s}`)));

// which loading / error message the modal shows (feedback runs at step 4)
const loadingKind = computed(
  () => (['extract', 'search', 'syllabus', 'feedback'] as const)[store.step - 1] || 'extract'
);

// finished steps fold into a one-line recap; "Edit" opens one again
const expanded = ref<Record<number, boolean>>({});
const isFolded = (n: number) => n < store.step && !expanded.value[n];

// unchanged files keep the later steps: fold the documents step again and go back to where
// the user was (the step usually stays the same, so the watcher below does not do it)
const continueFromDocuments = async () => {
  if (await store.handleSummaryFiles()) {
    expanded.value[1] = false;
    scrollToAnchor(`target-${store.step}`);
  }
};

const stepToAction: Record<1 | 2 | 3 | 4, (arg?: any) => Promise<void>> = {
  1: continueFromDocuments,
  2: store.retrieveTutorSearch,
  3: store.handleCreateSyllabus,
  4: store.handleDownloadSyllabus
};

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
    <TutorStepsBar :labels="stepLabels" :step="store.step" />
    <GuestQuotaNotice feature="syllabus" class="mb-3" />
    <ToasterComponent
      v-if="store.hasDownloadError"
      class="download-error"
      role="alert"
      level="error"
      headingTag="h2"
      :title="$t('tutor.downloadError.title')"
      :description="$t('tutor.downloadError.description')"
    />
    <ErrorComponent v-if="store.reloadError" />
    <StatusModal
      :isLoading="store.isLoading"
      :shouldRetryAction="store.shouldRetryAction"
      :action="stepToAction[store.step as 1 | 2 | 3 | 4]"
      :stopAction="store.stopAction"
      :kind="loadingKind"
    />

    <div class="layout-flex">
      <slot name="intro" />
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

.download-error {
  width: min(100% - 2rem, 40rem);
  margin-bottom: 0.75rem;
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
  .layout-flex {
    padding-inline: 10%;
  }
}

@media (max-width: 768px) {
  .layout-flex {
    padding-inline: 1rem;
  }
}
</style>

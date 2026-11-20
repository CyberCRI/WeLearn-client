<script setup lang="ts">
import { ref } from 'vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import ChangesView from '@/components/tutor/updated/ChangesView.vue';
import CompleteDocument from '@/components/tutor/updated/CompleteDocument.vue';
import ExportBar from '@/components/tutor/updated/ExportBar.vue';
import UpdatedOutline from '@/components/tutor/updated/UpdatedOutline.vue';
import { useSyllabusExport } from '@/composables/useSyllabusExport';
import { useConnectionsStore } from '@/stores/connections';
import { useCourseStore } from '@/stores/course';

// screen 4 "updated syllabus": the changes the teacher accepted, brought together. two views:
// the course with the changes in their places (the document they download), and the changes
// alone, grouped by where they belong. copied as text or downloaded as word, in the syllabus's
// language. no new suggestion is made here, and the uploaded file is untouched
const course = useCourseStore();
const store = useConnectionsStore();
const {
  changes,
  completeLabels,
  completePlan,
  isCompleteReady,
  hasNotes,
  isExporting,
  hasExportError,
  exportWord,
  isCopied,
  hasCopyError,
  copyChanges
} = useSyllabusExport();

const view = ref<'course' | 'changes'>('course');
const handleSave = (id: string, text: string) => store.acceptChange(id, text);
</script>

<template>
  <section class="updated" data-testid="updated">
    <h2 class="title is-4">{{ $t('tutor.updated.title') }}</h2>
    <p class="subtitle is-6" data-testid="updated-count">
      {{
        [course.courseToUpdate.title, $t('tutor.updated.approvedCount', changes.length)]
          .filter(Boolean)
          .join(' · ')
      }}
    </p>

    <div v-if="!changes.length" class="empty" data-testid="no-changes">
      <p>{{ $t('tutor.updated.noChanges') }}</p>
      <ButtonComponent class="is-small mt-3" data-testid="empty-back" @click="course.setStep(3)">
        ← {{ $t('tutor.updated.back') }}
      </ButtonComponent>
    </div>

    <template v-else>
      <p class="intro">{{ $t('tutor.updated.intro') }}</p>
      <div class="toolbar">
        <div class="tabs is-toggle is-small views" role="tablist">
          <ul>
            <li :class="{ 'is-active': view === 'course' }">
              <a
                role="tab"
                :aria-selected="view === 'course'"
                data-testid="view-course"
                @click="view = 'course'"
              >
                {{ $t('tutor.updated.courseView') }}
              </a>
            </li>
            <li :class="{ 'is-active': view === 'changes' }">
              <a
                role="tab"
                :aria-selected="view === 'changes'"
                data-testid="view-changes"
                @click="view = 'changes'"
              >
                {{ $t('tutor.updated.changesView', changes.length) }}
              </a>
            </li>
          </ul>
        </div>
        <ExportBar
          :is-complete-ready="isCompleteReady"
          :to-place-count="completePlan?.toPlace.length || 0"
          :has-notes="hasNotes"
          :is-exporting="isExporting"
          :has-export-error="hasExportError"
          @download="exportWord"
        />
      </div>

      <div v-if="view === 'changes'">
        <div class="changes-actions">
          <ButtonComponent class="is-small is-text" data-testid="copy-changes" @click="copyChanges">
            {{ isCopied ? $t('tutor.updated.copied') : $t('tutor.updated.copy') }}
          </ButtonComponent>
          <!-- the outline is a download of its own once the complete version is the main one -->
          <ButtonComponent
            v-if="isCompleteReady"
            class="is-small is-text"
            data-testid="download-outline"
            @click="exportWord('outline', false)"
          >
            {{ $t('tutor.updated.download') }}
          </ButtonComponent>
        </div>
        <p v-if="hasCopyError" class="muted" role="alert" data-testid="copy-error">
          {{ $t('tutor.updated.copyError') }}
        </p>
        <ChangesView :changes="changes" />
      </div>

      <!-- the course as a document: a white page on a light neutral workspace -->
      <div v-else class="workspace" data-testid="course-view">
        <p class="muted" data-testid="outline-note">
          {{
            $t(isCompleteReady ? 'tutor.updated.outlineNoteComplete' : 'tutor.updated.outlineNote')
          }}
        </p>
        <article class="page">
          <CompleteDocument
            v-if="isCompleteReady && completePlan"
            :plan="completePlan"
            :labels="completeLabels"
            @save="handleSave"
          />
          <UpdatedOutline v-else :changes="changes" @save="handleSave" />
        </article>
      </div>
    </template>

    <p class="muted local" data-testid="local-note">{{ $t('tutor.updated.localNote') }}</p>
  </section>
</template>

<style scoped>
.updated {
  width: 100%;
}

.intro {
  color: var(--neutral-80);
}

.empty {
  margin-top: 1rem;
  color: var(--neutral-80);
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.views {
  margin-bottom: 0;
}

/* the active view in WeLearn's colour, not bulma's default blue */
.views li.is-active a {
  border-color: var(--primary);
  background: var(--primary);
  color: var(--neutral-0);
}

.changes-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 1rem;
}

.muted {
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.workspace {
  margin-top: 1rem;
  padding: 0.75rem 1.25rem 1.5rem;
  border-radius: 8px;
  background: var(--neutral-10);
}

.workspace > .muted {
  margin-bottom: 0.6rem;
}

/* a readable page, like the document it will become; a long one scrolls inside it */
.page {
  max-height: max(24rem, calc(100vh - 20rem));
  overflow-y: auto;
  padding: 2rem 2.5rem;
  border: 1px solid var(--neutral-15);
  border-radius: 4px;
  background: var(--neutral-0);
  line-height: 1.6;
}

@media (max-width: 600px) {
  .workspace {
    padding: 0.5rem 0.5rem 1rem;
  }
  .page {
    padding: 1.25rem 1rem;
  }
}

.local {
  margin-top: 1.5rem;
}
</style>

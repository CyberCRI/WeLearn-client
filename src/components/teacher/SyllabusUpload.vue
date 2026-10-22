<script setup lang="ts">
import { computed, ref } from 'vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import { useCourseDesignStore } from '@/stores/courseDesign';
import { getQueryParamValue } from '@/utils/urlsUtils';

// one syllabus file and the course language, read by the WeLearn API.
// for local development and testing only (?demo=true): the fictional example and pasted text,
// which stay in this tab and are never sent or analysed
// ponytail: a small dropzone of its own rather than tutor/CursusInfo.vue, so /tutor stays untouched
const store = useCourseDesignStore();
const isDragging = ref(false);
// ponytail: demo paths behind a query flag, like ?score=true on search; not shown to teachers
const isDemoEnabled = getQueryParamValue('demo') === 'true';
const hasFailed = computed(() => store.status === 'unavailable' || store.status === 'error');
const isPasteOpen = ref(false);
const pasted = ref('');

const handlePick = (event: Event) => {
  const input = event.target as HTMLInputElement;
  store.setFile(input.files?.[0] || null);
  input.value = '';
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  store.setFile(event.dataTransfer?.files?.[0] || null);
};
</script>
<template>
  <section class="syllabus-upload">
    <h2 class="title is-5">{{ $t('journey.teach.adapt.upload.title') }}</h2>

    <label
      v-if="!store.file"
      class="dropzone"
      :class="{ 'is-dragging': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        class="is-sr-only"
        type="file"
        accept="application/pdf, text/plain, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        data-testid="syllabus-input"
        @change="handlePick"
      />
      <span>
        {{ $t('journey.teach.adapt.upload.dropzone') }}
        <span class="browse">{{ $t('journey.teach.adapt.upload.browse') }}</span>
      </span>
      <span class="limits">{{ $t('journey.teach.adapt.upload.limits') }}</span>
    </label>

    <div v-else class="picked-file" data-testid="picked-file">
      <span class="file-name">{{ store.file.name }}</span>
      <button
        type="button"
        class="delete is-small"
        :aria-label="$t('journey.teach.adapt.upload.remove', { name: store.file.name })"
        @click="store.setFile(null)"
      />
    </div>
    <p v-if="store.uploadError" class="help is-danger" role="alert">
      {{ $t(`journey.teach.adapt.upload.errors.${store.uploadError}`) }}
    </p>

    <div class="field mt-4 language">
      <label class="label" for="adapt-language">
        {{ $t('journey.teach.adapt.upload.languageLabel') }}
      </label>
      <div class="select is-small">
        <select id="adapt-language" v-model="store.language">
          <option v-for="lang in ['fr', 'en']" :key="lang" :value="lang">
            {{ $t(`lang.${lang}`) }}
          </option>
        </select>
      </div>
    </div>

    <p class="send-notice" data-testid="send-notice">
      {{ $t('journey.teach.adapt.upload.notice') }}
    </p>

    <div class="upload-actions">
      <ButtonComponent
        color="primary"
        :disabled="!store.file"
        data-testid="read-button"
        @click="store.readSyllabus()"
      >
        {{
          hasFailed ? $t('journey.teach.adapt.upload.retry') : $t('journey.teach.adapt.upload.read')
        }}
      </ButtonComponent>
      <template v-if="isDemoEnabled">
        <span class="or">{{ $t('journey.teach.adapt.upload.or') }}</span>
        <button
          type="button"
          class="button is-text example-button"
          data-testid="example-button"
          @click="store.loadExample()"
        >
          {{ $t('journey.teach.adapt.upload.example') }}
        </button>
      </template>
    </div>
    <p v-if="isDemoEnabled" class="example-hint">
      {{ $t('journey.teach.adapt.upload.exampleHint') }}
    </p>

    <!-- the teacher's own text, used locally: never sent, never analysed (demo only) -->
    <details
      v-if="isDemoEnabled"
      class="paste"
      :open="isPasteOpen"
      @toggle="isPasteOpen = ($event.target as HTMLDetailsElement).open"
    >
      <summary data-testid="paste-toggle">
        {{ $t('journey.teach.adapt.upload.pasteToggle') }}
      </summary>
      <label class="label mt-3" for="adapt-paste">
        {{ $t('journey.teach.adapt.upload.pasteLabel') }}
      </label>
      <textarea
        id="adapt-paste"
        v-model="pasted"
        class="textarea"
        rows="6"
        data-testid="paste-input"
      />
      <p class="example-hint">{{ $t('journey.teach.adapt.upload.pasteHint') }}</p>
      <button
        type="button"
        class="button is-small mt-2"
        :disabled="!pasted.trim()"
        data-testid="paste-button"
        @click="store.loadPastedText(pasted)"
      >
        {{ $t('journey.teach.adapt.upload.pasteUse') }}
      </button>
    </details>
  </section>
</template>

<style scoped>
.syllabus-upload {
  padding: 1.5rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
}

.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 2rem 1rem;
  border: 2px dashed var(--neutral-20);
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;
}

.dropzone:hover,
.dropzone.is-dragging {
  border-color: var(--primary);
}

.browse {
  color: var(--primary-dark);
  font-weight: 600;
  text-decoration: underline;
}

.limits {
  font-size: 0.8rem;
  color: var(--neutral-70);
}

.picked-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--neutral-20);
  border-left: 4px solid var(--primary);
  border-radius: 8px;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}

.send-notice {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.upload-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.or {
  color: var(--neutral-70);
}

.paste {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--neutral-20);
}

.paste summary {
  font-weight: 600;
  color: var(--primary-dark);
  cursor: pointer;
}

.example-hint {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: var(--neutral-70);
}
</style>

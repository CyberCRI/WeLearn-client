<script setup lang="ts">
import ButtonComponent from '@/components/ButtonComponent.vue';
import FileDropzone from '@/components/tutor/FileDropzone.vue';
import type { FileErrorReason } from '@/types';
import type { CourseLanguage, ReadError } from '@/stores/course';

// syllabus v2, screen 1 "your course": one syllabus file and the teacher's language
const props = defineProps<{
  file: File | null;
  fileError: FileErrorReason | null;
  language: CourseLanguage;
  readError: ReadError | null;
  setFile: (file: File) => void;
  removeFile: () => void;
  selectLanguage: (lang: CourseLanguage) => void;
  action: () => void;
}>();

const LANGUAGES: CourseLanguage[] = ['fr', 'en'];

// one syllabus: the first file when several are dropped
const onPick = (files: File[]) => props.setFile(files[0]);
</script>

<template>
  <div class="wrapper">
    <h1 class="title is-4 is-size-5-mobile">{{ $t('tutor.course.title') }}</h1>
    <p class="subtitle is-6">{{ $t('tutor.course.description') }}</p>

    <FileDropzone
      :label="$t('tutor.course.dropzone')"
      :limits="$t('tutor.course.limits')"
      inputTestId="course-file-input"
      @pick="onPick"
    />

    <p v-if="fileError" class="has-text-danger mt-2" data-testid="course-file-error">
      {{ $t(`tutor.${fileError}`) }}
    </p>

    <div v-if="file" class="picked-file" data-testid="course-file">
      <span class="file-name">{{ file.name }}</span>
      <button
        class="delete is-small mp-sensitive"
        :aria-label="$t('tutor.documentsStep.removeFile', { name: file.name })"
        @click="removeFile"
      />
    </div>

    <div class="field mt-5 language">
      <label class="label" for="course-lang">{{ $t('tutor.course.languageLabel') }}</label>
      <div class="select">
        <select
          id="course-lang"
          :value="language"
          data-testid="course-lang"
          @change="selectLanguage(($event.target as HTMLSelectElement).value as CourseLanguage)"
        >
          <option v-for="lang in LANGUAGES" :key="lang" :value="lang">
            {{ $t(`lang.${lang}`) }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="readError" class="notification is-danger is-light mt-4" data-testid="read-error">
      <p class="has-text-weight-semibold">{{ $t(`tutor.reading.${readError}.title`) }}</p>
      <p>{{ $t(`tutor.reading.${readError}.text`) }}</p>
    </div>

    <p class="is-size-7 has-text-grey mt-5" data-testid="ai-notice">
      {{ $t('tutor.course.aiNotice') }}
    </p>

    <div class="step-footer">
      <span v-if="!file" class="has-text-grey is-size-7">{{ $t('tutor.course.noFile') }}</span>
      <ButtonComponent
        color="primary"
        data-testid="read-course-button"
        :disabled="!file"
        @click="action()"
      >
        {{ $t('tutor.course.action') }} →
      </ButtonComponent>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.picked-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--neutral-20);
  border-radius: 0.5rem;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.step-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>

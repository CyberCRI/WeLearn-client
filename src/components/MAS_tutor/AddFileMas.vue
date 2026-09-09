<script setup lang="ts">
import { useMAsTutorStore } from '@/stores/mas_tutor';
import UploadIcon from '../icons/UploadIcon.vue';

const store = useMAsTutorStore();

const handleFileAdded = async (e) => {
  await store.addFile(e, 'syllabus');
  await store.getFilesContent();
  store.nextStepOnFlow();
};
</script>

<template>
  <div class="wrapper">
    <h1 class="title is-4">{{ $t('syllabus.addSyllabusTitle') }}</h1>
    <h2 class="subtitle is-5">{{ $t('syllabus.addSyllabusSubtitle') }}</h2>
    <p class="description">{{ $t('syllabus.addSyllabusDescription') }}</p>
    <div class="inputFile">
      <div class="file has-name is-boxed is-centered my-6">
        <label class="file-label">
          <input
            class="file-input"
            type="file"
            name="syllabus"
            @change="(e) => handleFileAdded(e)"
            required
          />
          <span class="file-cta">
            <span class="file-icon mb-2">
              <UploadIcon />
            </span>
            <span class="file-label">{{ $t('syllabus.addSyllabusPlaceholder') }} </span>
          </span>
          <span class="file-name">
            {{ store.filesRef.length ? store.filesRef[0].name : $t('noFileUploaded') }}
          </span>
        </label>
      </div>
    </div>
    <div class="actions">
      <button class="button" @click="store.previousStepOnFlow()">previous</button>
      <button class="button" @click="store.nextStepOnFlow()">next</button>
    </div>
  </div>
</template>

<style lang="css" scoped>
.wrapper {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 2rem auto;
}

.actions {
  margin: 0 auto;
  display: flex;
  gap: 2rem;
}

.file-name {
  max-width: 100%;
  text-align: center;
}
</style>

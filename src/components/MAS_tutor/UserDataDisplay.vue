<script setup lang="ts">
import SummariesStep from '@/components/MAS_tutor/SummariesStep.vue';

defineProps<{
  courseMetadaRef: {
    discipline?: string;
    topic?: string;
    level?: string;
    num_sessions?: number;
    session_duration?: number;
    session_type?: string;
    class_size?: number;
    session_mode?: string;
    output_language?: string;
    user_description?: string;
    syllabus_mode?: string;
  };
  summaries: Array<string>;
  filesRef: Array<File>;
  hasUserInputData: boolean;
  nextAction: () => void;
  updateSummary: (index: number, summary: string) => void;
}>();

const syllabusModeMapping = {
  one: 'courseMetadataOnly',
  two: 'courseMetadataAndDocument',
  three: 'existingSyllabus'
};
</script>
<template>
  <div id="target-2">
    <div
      class="user-input-section"
      v-if="hasUserInputData && Object.keys(courseMetadaRef).length > 0"
    >
      <div class="user-input-data">
        <h1 class="title is-4 is-size-5-mobile mt-4">
          Here is the data that will be used to create your syllabus, please confirm
        </h1>
        <div class="user-input-data-items">
          <div class="discipline-topic">
            <div class="user-input-data-item is-size-6 py-2 px-4">
              <strong class="is-capitalized">{{ $t('discipline') }}:</strong>
              {{ courseMetadaRef.discipline }}
            </div>
            <div class="user-input-data-item is-size-6 mb-3 py-1 px-4">
              <strong class="is-capitalized">{{ $t('topic') }} :</strong>
              {{ courseMetadaRef.topic }}
            </div>
          </div>

          <div class="user-input-data-item px-4" v-for="(value, key) in courseMetadaRef" :key="key">
            <div
              v-if="key !== 'discipline' && key !== 'topic' && key && value"
              class="is-size-6 py-1"
            >
              <strong class="is-capitalized">{{ $t(key) }}: </strong>
              <span v-if="key === 'syllabus_mode'">{{
                $t(syllabusModeMapping[value as keyof typeof syllabusModeMapping])
              }}</span>
              <span v-else>{{ $t(value.toString()) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button
          class="button is-primary action-button"
          v-if="courseMetadaRef.syllabus_mode !== 'two'"
          @click="nextAction"
        >
          generate syllabus
        </button>
      </div>
      <SummariesStep
        :id_number="0"
        :disabled="false"
        v-if="summaries.length"
        :updateSummary="updateSummary"
        :summaries="summaries"
        :files="filesRef"
        :action="nextAction"
        actionText="Chercher des documents en lien"
      />
    </div>
  </div>
</template>

<style lang="css" scoped>
.user-input-section {
  width: 100%;
  padding: 2rem;
  background-color: var(--neutral-10);
  border-radius: 0.5rem;
}

.user-input-data-items {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 1rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--neutral-50);
}

.user-input-data-item {
  width: 100%;
  & > strong {
    display: inline;
    margin-right: 0.5rem;
  }
}
.discipline-topic {
  border-radius: 0.5rem;
  background-color: var(--neutral-0);
  width: 100%;
}

.action-button {
  margin-top: 1rem;
  margin-left: auto;
  display: flex;
  justify-content: flex-end;
}
</style>

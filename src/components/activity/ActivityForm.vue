<script setup lang="ts">
import { useActivityStore } from '@/stores/activityGenerator';
import ButtonComponent from '@/components/ButtonComponent.vue';

const store = useActivityStore();
</script>

<template>
  <div class="form-wrapper">
    <h2 class="form-title">{{ $t('activity.title') }}</h2>
    <p class="form-description">{{ $t('activity.description') }}</p>

    <div class="form-fields">
      <div class="field">
        <label class="field-label">{{ $t('activity.subjectLabel') }}</label>
        <input
          class="field-input"
          type="text"
          v-model="store.subject"
          :placeholder="$t('activity.subjectPlaceholder')"
        />
      </div>

      <div class="field">
        <label class="field-label">{{ $t('activity.activityTypeLabel') }}</label>
        <select class="field-select" v-model="store.activityType">
          <option value="debate">{{ $t('activity.activityTypes.debate') }}</option>
          <option value="case_study">{{ $t('activity.activityTypes.case_study') }}</option>
          <option value="role_play">{{ $t('activity.activityTypes.role_play') }}</option>
          <option value="think_pair_share">
            {{ $t('activity.activityTypes.think_pair_share') }}
          </option>
          <option value="jigsaw">{{ $t('activity.activityTypes.jigsaw') }}</option>
          <option value="project_based">{{ $t('activity.activityTypes.project_based') }}</option>
          <option value="flipped">{{ $t('activity.activityTypes.flipped') }}</option>
        </select>
      </div>

      <div class="field">
        <label class="field-label">{{ $t('activity.levelLabel') }}</label>
        <select class="field-select" v-model="store.level">
          <option value="secondary">{{ $t('activity.levels.secondary') }}</option>
          <option value="undergraduate">{{ $t('activity.levels.undergraduate') }}</option>
          <option value="graduate">{{ $t('activity.levels.graduate') }}</option>
        </select>
      </div>

      <div class="field-row">
        <div class="field">
          <label class="field-label">{{ $t('activity.studentsLabel') }}</label>
          <select class="field-select" v-model="store.studentCount">
            <option value="small">{{ $t('activity.studentCounts.small') }}</option>
            <option value="medium">{{ $t('activity.studentCounts.medium') }}</option>
            <option value="large">{{ $t('activity.studentCounts.large') }}</option>
            <option value="xlarge">{{ $t('activity.studentCounts.xlarge') }}</option>
          </select>
        </div>

        <div class="field">
          <label class="field-label">{{ $t('activity.durationLabel') }}</label>
          <select class="field-select" v-model="store.duration">
            <option value="30min">{{ $t('activity.durations.30min') }}</option>
            <option value="1h">{{ $t('activity.durations.1h') }}</option>
            <option value="2h">{{ $t('activity.durations.2h') }}</option>
            <option value="3h">{{ $t('activity.durations.3h') }}</option>
          </select>
        </div>
      </div>

      <ButtonComponent
        class="generate-btn"
        :disabled="!store.canGenerate || store.isGenerating"
        @click="store.generate"
      >
        {{ $t('activity.generateButton') }}
      </ButtonComponent>
    </div>
  </div>
</template>

<style scoped>
.form-wrapper {
  padding: 1.5rem 1rem 1.5rem 0;
}

.form-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--neutral-80);
  margin-bottom: 0.5rem;
}

.form-description {
  font-size: 0.875rem;
  color: var(--neutral-60, #666);
  margin-bottom: 1.75rem;
  line-height: 1.5;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  flex: 1;
}

.field-row {
  display: flex;
  gap: 1rem;
}

.field-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--neutral-80);
}

.field-input,
.field-select {
  border: 1px solid var(--neutral-20);
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: var(--neutral-80);
  background: var(--neutral-0);
  width: 100%;
  outline: none;
  transition: border-color 0.15s;
}

.field-input:focus,
.field-select:focus {
  border-color: var(--primary);
}

.generate-btn {
  margin-top: 0.5rem;
  width: 100%;
}
</style>

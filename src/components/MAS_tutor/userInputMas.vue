<script setup lang="ts">
import type { CourseMetadata } from '@/types';
import { reactive } from 'vue';
import ChevronDown from '@/components/icons/ChevronDown.vue';
import i18n from '@/localisation/i18n';
import { getFromStorage } from '@/utils/storage';

const emit = defineEmits(['submit']);

defineProps<{
  actionText?: string;
  action?: () => void;
}>();

const form: CourseMetadata = reactive(
  getFromStorage('courseMetadaRef') || {
    discipline: undefined,
    topic: undefined,
    level: undefined,
    num_sessions: undefined,
    session_duration: undefined,
    user_description: undefined,
    session_type: undefined,
    class_size: undefined,
    session_mode: 'PRESENTIEL',
    output_language: i18n.global.locale.value === 'fr' ? 'french' : 'english'
  }
);

function submitForm() {
  if (Object.keys(form).length !== Object.values(form).filter((x) => x).length) {
    window.alert('please fill all entries');
    return;
  }

  emit('submit', { ...form });
}
</script>

<template>
  <div class="course-info-section">
    <h2 class="title is-4 is-size-5-mobile has-text-centered">{{ $t('courseInformation') }}</h2>
    <h3 class="subtitle">
      In order to create a syllabus from scratch, we need to collect some basic information, please
      fill the following information.
    </h3>
    <form @submit.prevent="submitForm" class="user-form">
      <div class="field">
        <label class="label">{{ $t('discipline') }}</label>
        <div class="control">
          <input
            class="input"
            type="text"
            v-model="form.discipline"
            :placeholder="$t('Economics')"
            required
          />
        </div>
        <p class="help">{{ $t('disciplineExample') }}</p>
      </div>
      <div class="field">
        <label class="label">{{ $t('topic') }}</label>
        <div class="control">
          <input
            class="input"
            type="text"
            v-model="form.topic"
            :placeholder="$t('Microeconomics')"
            required
          />
        </div>
        <p class="help">{{ $t('topicExample') }}</p>
      </div>

      <div class="field">
        <label class="label">{{ $t('level') }}</label>
        <div class="control">
          <input
            class="input"
            type="text"
            v-model="form.level"
            :placeholder="$t('Level')"
            required
          />
        </div>
        <p class="help">{{ $t('levelExample') }}</p>
      </div>

      <div class="field">
        <label class="label is-capitalized">{{ $t('class_size') }}</label>
        <div class="control">
          <input
            class="input"
            type="number"
            v-model="form.class_size"
            :placeholder="$t('classSizePlaceholder')"
            required
          />
        </div>
        <p class="help">{{ $t('classSizeExample') }}</p>
      </div>

      <div class="field">
        <label class="label">{{ $t('num_sessions') }}</label>
        <div class="control">
          <input
            class="input"
            type="number"
            v-model="form.num_sessions"
            :placeholder="$t('num_sessions_placeholder')"
            required
          />
        </div>
        <p class="help">{{ $t('numSessionsExample') }}</p>
      </div>

      <div class="field">
        <label class="label is-capitalized">{{ $t('session_duration') }}</label>
        <div class="control">
          <input
            class="input"
            type="number"
            v-model="form.session_duration"
            :placeholder="$t('sessionDurationPlaceholder')"
            required
          />
        </div>
        <p class="help">{{ $t('sessionDurationExample') }}</p>
      </div>

      <div class="field">
        <label class="label is-capitalized">{{ $t('session_type') }}</label>
        <div class="control">
          <input
            class="input"
            type="text"
            v-model="form.session_type"
            :placeholder="$t('sessionTypePlaceholder')"
            required
          />
        </div>
        <p class="help">{{ $t('sessionTypeExample') }}</p>
      </div>

      <div class="field">
        <label class="label">{{ $t('session_mode') }}</label>
        <div class="select is-primary">
          <select v-model="form.session_mode" required>
            <option value="PRESENTIEL">{{ $t('inPerson') }}</option>
            <option value="DISTANCIEL">{{ $t('remote') }}</option>
            <option value="HYBRIDE">{{ $t('hybrid') }}</option>
          </select>
        </div>
      </div>

      <div class="field">
        <label class="label">{{ $t('output_language') }}</label>
        <div class="select is-primary">
          <select v-model="form.output_language" required>
            <option value="french">{{ $t('french') }}</option>
            <option value="english">{{ $t('english') }}</option>
          </select>
        </div>
      </div>

      <div class="field course-description">
        <label class="label">{{ $t('user_description') }}</label>
        <div class="control">
          <textarea
            class="textarea"
            type="text"
            v-model="form.user_description"
            :placeholder="$t('courseDescriptionPlaceholder')"
            required
          />
        </div>
        <p class="help">{{ $t('descriptionExample') }}</p>
      </div>
      <div></div>
      <div class="field submit-button">
        <div class="control">
          <button class="button is-primary" type="submit">
            <ChevronDown />
            {{ $t(`${actionText || 'start'}`) }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
<style lang="css" scoped>
.course-info-section {
  margin: auto;
  width: 50%;
  height: 100%;
}

.user-form {
  height: 100%;
  display: grid;
  grid-template-columns: auto auto;
  gap: 1rem;
  width: 100%;
  padding: 0rem;
  padding-left: 1rem;
  padding-right: 0.5rem;
  padding-bottom: 4rem;
}

.field {
  width: 100%;
}

.select {
  width: 100%;
}

select {
  width: 100%;
}

.submit-button {
  z-index: 9;
  position: sticky;
  background-color: var(--neutral-0);
  top: 0;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 1rem 0;
}

.course-description {
  flex: 1 1 100%;
}
</style>

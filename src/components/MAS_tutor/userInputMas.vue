<script setup lang="ts">
import type { CourseMetadata } from '@/views/TestMAS.vue';
import { reactive } from 'vue';
import ChevronDown from '@/components/icons/ChevronDown.vue';
import { scrollToAnchor } from '@/utils/navigation';

const emit = defineEmits(['submit']);

defineProps<{
  id_number: number;
  actionText?: string;
}>();

const form: CourseMetadata = reactive({
  topic: '',
  discipline: '',
  level: '',
  num_sessions: 0,
  session_duration: 1,
  course_description: '',
  session_type: '',
  class_size: 0,
  session_mode: 'in person',
  output_language: 'french'
});

function submitForm() {
  emit('submit', { ...form });
}
</script>

<template>
  <div id="target-1" class="course-info-section">
    <h2 class="title is-4 is-size-5-mobile has-text-centered">{{ $t('courseInformation') }}</h2>
    <form @submit.prevent="submitForm" class="user-form">
      <div class="field">
        <label class="label is-capitalized">{{ $t('inputMode') }}</label>
        <div class="select is-primary">
          <select v-model="form.session_mode">
            <option value="PRESENTIEL">{{ $t('In Person') }}</option>
            <option value="DISTANCIEL">{{ $t('Remote') }}</option>
            <option value="HYBRIDE">{{ $t('Hybrid') }}</option>
          </select>
        </div>
      </div>
      <div class="field">
        <label class="label is-capitalized">{{ $t('discipline') }}</label>
        <div class="control">
          <input
            class="input"
            type="text"
            v-model="form.discipline"
            :placeholder="$t('Economics')"
          />
        </div>
        <p class="help">{{ $t('disciplineExample') }}</p>
      </div>
      <div class="field">
        <label class="label is-capitalized">{{ $t('topic') }}</label>
        <div class="control">
          <input
            class="input"
            type="text"
            v-model="form.topic"
            :placeholder="$t('Microeconomics')"
          />
        </div>
        <p class="help">{{ $t('topicExample') }}</p>
      </div>

      <div class="field">
        <label class="label is-capitalized">{{ $t('level') }}</label>
        <div class="control">
          <input class="input" type="text" v-model="form.level" :placeholder="$t('Level')" />
        </div>
        <p class="help">{{ $t('levelExample') }}</p>
      </div>

      <div class="field">
        <label class="label is-capitalized">{{ $t('number of sessions') }}</label>
        <div class="control">
          <input
            class="input"
            type="number"
            v-model="form.num_sessions"
            :placeholder="$t('Number of sessions')"
          />
        </div>
        <p class="help">{{ $t('numberOfSessionsExample') }}</p>
      </div>

      <div class="field">
        <label class="label is-capitalized">{{ $t('sessions durations') }}</label>
        <div class="control">
          <input
            class="input"
            type="text"
            v-model="form.session_duration"
            :placeholder="$t('Sessions durations')"
          />
        </div>
        <p class="help">{{ $t('sessionDurationExample') }}</p>
      </div>

      <div class="field">
        <label class="label is-capitalized">{{ $t('session type') }}</label>
        <div class="control">
          <input
            class="input"
            type="text"
            v-model="form.session_type"
            :placeholder="$t('Lecture')"
          />
        </div>
        <p class="help">{{ $t('sessionTypeExample') }}</p>
      </div>

      <div class="field">
        <label class="label is-capitalized">{{ $t('class size') }}</label>
        <div class="control">
          <input
            class="input"
            type="number"
            v-model="form.class_size"
            :placeholder="$t('Number of students')"
          />
        </div>
        <p class="help">{{ $t('numberOfStudentsInClass') }}</p>
      </div>

      <div class="field">
        <label class="label is-capitalized">{{ $t('session mode') }}</label>
        <div class="select is-primary">
          <select v-model="form.session_mode">
            <option value="PRESENTIEL">{{ $t('In Person') }}</option>
            <option value="DISTANCIEL">{{ $t('Remote') }}</option>
            <option value="HYBRIDE">{{ $t('Hybrid') }}</option>
          </select>
        </div>
      </div>

      <div class="field">
        <label class="label is-capitalized">{{ $t('output language') }}</label>
        <div class="select is-primary">
          <select v-model="form.output_language">
            <option value="french">{{ $t('French') }}</option>
            <option value="english">{{ $t('English') }}</option>
          </select>
        </div>
      </div>

      <div class="field course-description">
        <label class="label is-capitalized">{{ $t('course description') }}</label>
        <div class="control">
          <textarea
            class="textarea"
            type="text"
            v-model="form.user_description"
            :placeholder="$t('Course description')"
          />
        </div>
        <p class="help">{{ $t('descriptionExample') }}</p>
      </div>

      <div class="field submit-button">
        <div class="control">
          <button
            class="button is-primary"
            type="submit"
            @click="scrollToAnchor(`target-${id_number + 1}`)"
          >
            <ChevronDown />
            {{ $t(`${actionText || 'next'}`) }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
<style lang="css" scoped>
.user-form {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
  width: 100%;
  padding: 0rem;
  padding-left: 1rem;
  padding-right: 0.5rem;
}

.submit-button {
  margin-left: auto;
  align-self: flex-end;
}

.course-description {
  flex: 1 1 100%;
}
</style>
